"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { getChatResponse } from "@/lib/chat-engine";
import { suggestedPrompts } from "@/data/chat-knowledge";
import styles from "./ChatWindow.module.css";

interface Message {
    role: "user" | "assistant";
    text: string;
}

export function ChatWindow() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            text: "Hi! Ask me anything about Rihan Mohammed — skills, experience, projects, certifications, or contact info.",
        },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typing]);

    const send = (text: string) => {
        if (!text.trim()) return;
        setMessages((m) => [...m, { role: "user", text: text.trim() }]);
        setInput("");
        setTyping(true);
        setTimeout(() => {
            const reply = getChatResponse(text);
            setMessages((m) => [...m, { role: "assistant", text: reply }]);
            setTyping(false);
        }, 600);
    };

    return (
        <div className={`glass-card ${styles.window}`}>
            <div className={styles.messages}>
                {messages.map((msg, i) => (
                    <div key={i} className={`${styles.bubble} ${styles[msg.role]}`}>
                        {msg.text}
                    </div>
                ))}
                {typing && (
                    <div className={`${styles.bubble} ${styles.assistant} ${styles.typing}`}>
                        <span /><span /><span />
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
            <div className={styles.prompts}>
                {suggestedPrompts.map((p) => (
                    <button key={p} type="button" onClick={() => send(p)}>
                        {p}
                    </button>
                ))}
            </div>
            <form
                className={styles.form}
                onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                }}
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about Rihan's skills, experience..."
                    aria-label="Chat message"
                />
                <button type="submit" aria-label="Send">
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
