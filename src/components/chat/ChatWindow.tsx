"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { getChatResponse } from "@/lib/chat-engine";
import { suggestedPrompts } from "@/data/chat-knowledge";
import { LogoMark } from "@/components/layout/LogoMark";
import styles from "./ChatWindow.module.css";

interface Message {
    id: string;
    role: "user" | "assistant";
    text: string;
}

let messageId = 0;
function nextId() {
    messageId += 1;
    return `msg-${messageId}`;
}

export function ChatWindow() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: nextId(),
            role: "assistant",
            text: "Hi! I'm Rihan's portfolio assistant. Ask about skills, experience, projects, certifications, or how to get in touch.",
        },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typing]);

    const send = (text: string) => {
        if (!text.trim() || typing) return;
        const userText = text.trim();
        setMessages((m) => [...m, { id: nextId(), role: "user", text: userText }]);
        setInput("");
        setTyping(true);
        setTimeout(() => {
            const reply = getChatResponse(userText);
            setMessages((m) => [...m, { id: nextId(), role: "assistant", text: reply }]);
            setTyping(false);
        }, 500 + Math.min(userText.length * 8, 400));
    };

    return (
        <div className={styles.shell} data-cursor="card">
            <div className={styles.glowBorder} aria-hidden />

            <header className={styles.header}>
                <div className={styles.avatar}>
                    <LogoMark size="sm" />
                    <span className={styles.avatarPulse} aria-hidden />
                </div>
                <div className={styles.headerText}>
                    <h2>Rihan&apos;s Assistant</h2>
                    <p>
                        <span className={styles.statusDot} aria-hidden />
                        Online · client-side knowledge base
                    </p>
                </div>
                <Sparkles size={18} className={styles.headerIcon} aria-hidden />
            </header>

            <div className={styles.messages}>
                {messages.map((msg, i) => (
                    <div
                        key={msg.id}
                        className={`${styles.row} ${styles[msg.role]}`}
                        style={{ animationDelay: `${Math.min(i * 40, 200)}ms` }}
                    >
                        <span className={styles.msgIcon} aria-hidden>
                            {msg.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
                        </span>
                        <div className={`${styles.bubble} ${styles[`${msg.role}Bubble`]}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {typing && (
                    <div className={`${styles.row} ${styles.assistant}`}>
                        <span className={styles.msgIcon} aria-hidden>
                            <Bot size={14} />
                        </span>
                        <div className={`${styles.bubble} ${styles.assistantBubble} ${styles.typing}`}>
                            <span /><span /><span />
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className={styles.prompts}>
                <span className={styles.promptsLabel}>Try asking</span>
                <div className={styles.promptGrid}>
                    {suggestedPrompts.map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => send(p)}
                            disabled={typing}
                            data-cursor="pointer"
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <form
                className={styles.form}
                onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                }}
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about skills, experience, projects..."
                    aria-label="Chat message"
                    disabled={typing}
                />
                <button type="submit" aria-label="Send" disabled={typing || !input.trim()} data-cursor="pointer">
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
