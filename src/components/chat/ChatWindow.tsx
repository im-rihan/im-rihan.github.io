"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    Send,
    Bot,
    User,
    Copy,
    Check,
    RotateCcw,
    Trash2,
    Square,
    ChevronDown,
    Sparkles,
    Shield,
    Shuffle,
} from "lucide-react";
import { getChatResponse } from "@/lib/chat-engine";
import { formatMessageTime, streamText } from "@/lib/chat-stream";
import { pickSuggestedPrompts, suggestedPromptPool } from "@/data/chat-knowledge";
import { LogoMark } from "@/components/layout/LogoMark";
import { ChatMarkdown } from "./ChatMarkdown";
import styles from "./ChatWindow.module.css";

const STORAGE_KEY = "rm-portfolio-chat";

interface Message {
    id: string;
    role: "user" | "assistant";
    text: string;
    timestamp: number;
}

const WELCOME_TEXT =
    "Hi! I'm **Rihan's portfolio assistant** — ask me about skills, experience, projects, certifications, or how to get in touch.\n\nEverything runs **locally in your browser** from Rihan's resume knowledge base.";

function createMessageId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeMessageIds(messages: Message[]): Message[] {
    const seen = new Set<string>();
    return messages.map((m) => {
        if (m.id && !seen.has(m.id)) {
            seen.add(m.id);
            return m;
        }
        const id = createMessageId();
        seen.add(id);
        return { ...m, id };
    });
}

const WELCOME_MESSAGE: Message = {
    id: "welcome",
    role: "assistant",
    text: WELCOME_TEXT,
    timestamp: 0,
};

const INITIAL_MESSAGES: Message[] = [WELCOME_MESSAGE];

function freshChat(): Message[] {
    return [{ ...WELCOME_MESSAGE }];
}

function loadStoredMessages(): Message[] | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Message[];
        if (!Array.isArray(parsed) || parsed.length === 0) return null;
        return normalizeMessageIds(
            parsed.filter((m) => m.id && m.role && typeof m.text === "string")
        );
    } catch {
        return null;
    }
}

export function ChatWindow() {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState("");
    const [streaming, setStreaming] = useState(false);
    const [thinking, setThinking] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [showScrollDown, setShowScrollDown] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const messagesRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const abortRef = useRef<AbortController | null>(null);
    const lastUserPromptRef = useRef("");
    const usedPromptsRef = useRef<Set<string>>(new Set());
    const skipInitialScrollRef = useRef(true);
    const hydratedScrollDoneRef = useRef(false);

    const [activePrompts, setActivePrompts] = useState<string[]>([]);

    const refreshPrompts = useCallback((extraExclude?: string) => {
        const exclude = new Set(usedPromptsRef.current);
        if (extraExclude) exclude.add(extraExclude);
        setActivePrompts(pickSuggestedPrompts(exclude));
    }, []);

    useEffect(() => {
        const stored = loadStoredMessages();
        if (stored) {
            setMessages(stored);
            stored
                .filter((m) => m.role === "user")
                .forEach((m) => usedPromptsRef.current.add(m.text.trim()));
        }
        refreshPrompts();
        setHydrated(true);
    }, [refreshPrompts]);

    useEffect(() => {
        if (!hydrated) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-80)));
    }, [messages, hydrated]);

    const scrollToBottom = useCallback((smooth = true) => {
        const el = messagesRef.current;
        if (!el) return;
        el.scrollTo({
            top: el.scrollHeight,
            behavior: smooth ? "smooth" : "auto",
        });
    }, []);

    useEffect(() => {
        if (!hydrated || hydratedScrollDoneRef.current) return;
        if (!messages.some((m) => m.role === "user")) return;
        hydratedScrollDoneRef.current = true;
        requestAnimationFrame(() => scrollToBottom(false));
    }, [hydrated, messages, scrollToBottom]);

    useEffect(() => {
        if (skipInitialScrollRef.current) {
            skipInitialScrollRef.current = false;
            return;
        }
        scrollToBottom();
    }, [messages, thinking, streaming, scrollToBottom]);

    useEffect(() => {
        const el = messagesRef.current;
        if (!el) return;
        const onScroll = () => {
            const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
            setShowScrollDown(dist > 120);
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, []);

    const resizeTextarea = useCallback(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
    }, []);

    useEffect(() => {
        resizeTextarea();
    }, [input, resizeTextarea]);

    const runAssistantReply = useCallback(
        async (userText: string, replaceLast = false) => {
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setThinking(true);
            const thinkMs = 400 + Math.min(userText.length * 6, 500);
            await new Promise((r) => setTimeout(r, thinkMs));
            if (controller.signal.aborted) return;

            const fullReply = getChatResponse(userText);
            setThinking(false);
            setStreaming(true);

            const assistantId = createMessageId();
            setMessages((prev) => {
                const base = replaceLast
                    ? prev.filter((m, i) => !(i === prev.length - 1 && m.role === "assistant"))
                    : prev;
                return [
                    ...base,
                    {
                        id: assistantId,
                        role: "assistant",
                        text: "",
                        timestamp: Date.now(),
                    },
                ];
            });

            await streamText(
                fullReply,
                (partial) => {
                    setMessages((prev) =>
                        prev.map((m) => (m.id === assistantId ? { ...m, text: partial } : m))
                    );
                },
                controller.signal
            );

            setStreaming(false);
            abortRef.current = null;
            refreshPrompts();
        },
        [refreshPrompts]
    );

    const send = useCallback(
        (text: string, fromSuggestion = false) => {
            const userText = text.trim();
            if (!userText || thinking || streaming) return;

            lastUserPromptRef.current = userText;

            const poolMatch = suggestedPromptPool.find(
                (p) => p.toLowerCase() === userText.toLowerCase()
            );
            if (poolMatch) {
                usedPromptsRef.current.add(poolMatch);
                refreshPrompts();
            } else if (fromSuggestion) {
                usedPromptsRef.current.add(userText);
                refreshPrompts();
            }

            setMessages((m) => [
                ...m,
                { id: createMessageId(), role: "user", text: userText, timestamp: Date.now() },
            ]);
            setInput("");
            void runAssistantReply(userText);
        },
        [thinking, streaming, runAssistantReply, refreshPrompts]
    );

    const stopGeneration = () => {
        abortRef.current?.abort();
        setThinking(false);
        setStreaming(false);
    };

    const clearChat = () => {
        stopGeneration();
        usedPromptsRef.current.clear();
        setMessages(freshChat());
        refreshPrompts();
        localStorage.removeItem(STORAGE_KEY);
        textareaRef.current?.focus();
    };

    const regenerate = () => {
        if (!lastUserPromptRef.current || thinking || streaming) return;
        void runAssistantReply(lastUserPromptRef.current, true);
    };

    const copyMessage = async (id: string, text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            /* ignore */
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send(input);
        }
    };

    const busy = thinking || streaming;
    const hasUserMessages = messages.some((m) => m.role === "user");
    const visibleMessages = hasUserMessages
        ? messages.filter((m) => m.id !== "welcome")
        : messages;
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    const canRegenerate = hasUserMessages && lastAssistant && !busy;

    return (
        <div
            className={styles.shell}
            data-conversation={hasUserMessages ? "active" : "idle"}
            data-cursor="card"
        >
            <div className={styles.glowBorder} aria-hidden />

            <header className={styles.header}>
                <div className={styles.avatar}>
                    <LogoMark size="sm" />
                    <span className={styles.avatarPulse} aria-hidden />
                </div>
                <div className={styles.headerText}>
                    <div className={styles.headerTitleRow}>
                        <h2>Rihan&apos;s Assistant</h2>
                        <span className={styles.modelBadge}>
                            <Sparkles size={11} aria-hidden />
                            Portfolio AI
                        </span>
                    </div>
                    <p>
                        <span className={styles.statusDot} aria-hidden />
                        {busy ? "Generating response…" : "Online · private & client-side"}
                    </p>
                </div>
                <div className={styles.headerActions}>
                    {canRegenerate && (
                        <button
                            type="button"
                            className={styles.iconBtn}
                            onClick={regenerate}
                            aria-label="Regenerate last response"
                            title="Regenerate"
                            data-cursor="pointer"
                        >
                            <RotateCcw size={16} />
                        </button>
                    )}
                    <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={clearChat}
                        aria-label="Clear conversation"
                        title="Clear chat"
                        data-cursor="pointer"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </header>

            <div className={styles.messagesWrap}>
                <div className={styles.messages} ref={messagesRef} role="log" aria-live="polite">
                    {!hasUserMessages && (
                        <div className={styles.welcomeBanner}>
                            <Shield size={14} aria-hidden />
                            <span>No data leaves your browser — answers come from Rihan&apos;s resume knowledge base.</span>
                        </div>
                    )}

                    {visibleMessages.map((msg, i) => (
                        <article
                            key={msg.id}
                            className={`${styles.row} ${styles[msg.role]}`}
                            style={{ animationDelay: `${Math.min(i * 30, 180)}ms` }}
                        >
                            <span className={styles.msgIcon} aria-hidden>
                                {msg.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
                            </span>
                            <div className={styles.msgBody}>
                                <div className={styles.msgMeta}>
                                    <span className={styles.msgRole}>
                                        {msg.role === "assistant" ? "Assistant" : "You"}
                                    </span>
                                    {hydrated && msg.timestamp > 0 && (
                                        <time dateTime={new Date(msg.timestamp).toISOString()}>
                                            {formatMessageTime(msg.timestamp)}
                                        </time>
                                    )}
                                </div>
                                <div
                                    className={`${styles.bubble} ${styles[`${msg.role}Bubble`]}`}
                                >
                                    {msg.role === "assistant" ? (
                                        msg.text ? (
                                            <>
                                                <ChatMarkdown source={msg.text} />
                                                {streaming &&
                                                    msg.id === messages[messages.length - 1]?.id && (
                                                        <span className={styles.cursor} aria-hidden />
                                                    )}
                                            </>
                                        ) : null
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                                {msg.role === "assistant" && msg.text && !busy && (
                                    <div className={styles.msgActions}>
                                        <button
                                            type="button"
                                            className={styles.actionBtn}
                                            onClick={() => copyMessage(msg.id, msg.text)}
                                            aria-label="Copy message"
                                            data-cursor="pointer"
                                        >
                                            {copiedId === msg.id ? (
                                                <Check size={13} />
                                            ) : (
                                                <Copy size={13} />
                                            )}
                                            {copiedId === msg.id ? "Copied" : "Copy"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}

                    {thinking &&
                        !messages.some(
                            (m) => m.role === "assistant" && !m.text && m === messages[messages.length - 1]
                        ) && (
                            <div className={`${styles.row} ${styles.assistant}`}>
                                <span className={styles.msgIcon} aria-hidden>
                                    <Bot size={14} />
                                </span>
                                <div className={styles.msgBody}>
                                    <div className={`${styles.bubble} ${styles.assistantBubble} ${styles.typing}`}>
                                        <span /><span /><span />
                                    </div>
                                </div>
                            </div>
                        )}

                    <div ref={bottomRef} />
                </div>

                {showScrollDown && (
                    <button
                        type="button"
                        className={styles.scrollDown}
                        onClick={() => scrollToBottom()}
                        aria-label="Scroll to latest messages"
                        data-cursor="pointer"
                    >
                        <ChevronDown size={18} />
                    </button>
                )}
            </div>

            {hydrated && !busy && activePrompts.length > 0 && (
                <div className={styles.prompts}>
                    <div className={styles.promptsHead}>
                        <span className={styles.promptsLabel}>
                            {hasUserMessages ? "Keep exploring" : "Suggested prompts"}
                        </span>
                        <button
                            type="button"
                            className={styles.shuffleBtn}
                            onClick={() => refreshPrompts()}
                            aria-label="Show different suggestions"
                            title="Shuffle suggestions"
                            data-cursor="pointer"
                        >
                            <Shuffle size={13} aria-hidden />
                            Shuffle
                        </button>
                    </div>
                    <div className={styles.promptGrid} key={activePrompts.join("|")}>
                        {activePrompts.map((p) => (
                            <button
                                key={p}
                                type="button"
                                className={styles.promptChip}
                                onClick={() => send(p, true)}
                                disabled={busy}
                                data-cursor="pointer"
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.composer}>
                <form
                    className={styles.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        send(input);
                    }}
                >
                    <div className={styles.inputWrap}>
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Message Rihan's assistant…"
                            aria-label="Chat message"
                            disabled={busy}
                            rows={1}
                        />
                        {busy ? (
                            <button
                                type="button"
                                className={`${styles.sendBtn} ${styles.stopBtn}`}
                                onClick={stopGeneration}
                                aria-label="Stop generating"
                                data-cursor="pointer"
                            >
                                <Square size={14} fill="currentColor" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className={styles.sendBtn}
                                aria-label="Send message"
                                disabled={!input.trim()}
                                data-cursor="pointer"
                            >
                                <Send size={18} />
                            </button>
                        )}
                    </div>
                    <p className={styles.composerHint}>
                        <kbd>Enter</kbd> to send · <kbd>Shift</kbd>+<kbd>Enter</kbd> for new line
                    </p>
                </form>
            </div>
        </div>
    );
}
