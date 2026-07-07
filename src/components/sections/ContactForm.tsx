"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Send, CheckCircle2, Mail } from "lucide-react";
import { siteMeta } from "@/data/profile";
import { ThemedSelect } from "@/components/ui/ThemedSelect";
import styles from "./ContactForm.module.css";

const INQUIRY_TOPICS = [
    { value: "Job opportunity", label: "Job opportunity" },
    { value: "Contract / freelance", label: "Contract / freelance" },
    { value: "Collaboration", label: "Collaboration" },
    { value: "General inquiry", label: "General inquiry" },
] as const;

const DEFAULT_TOPIC = INQUIRY_TOPICS[0].value;

export function ContactForm() {
    const [sent, setSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [topic, setTopic] = useState<string>(DEFAULT_TOPIC);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        const form = e.currentTarget;
        const data = new FormData(form);

        const name = String(data.get("name") ?? "").trim();
        const email = String(data.get("email") ?? "").trim();
        const topic = String(data.get("topic") ?? "General inquiry").trim();

        data.set("_template", "table");
        data.set("_captcha", "false");
        data.set("_subject", `Portfolio · ${topic} — ${name || "New message"}`);
        data.set("_replyto", email);

        try {
            const res = await fetch("https://formsubmit.co/ajax/im.rihan.dev@gmail.com", {
                method: "POST",
                headers: { Accept: "application/json" },
                body: data,
            });
            if (!res.ok) throw new Error("Submit failed");
            setSent(true);
            form.reset();
            setTopic(DEFAULT_TOPIC);
        } catch {
            const subject = encodeURIComponent(`Portfolio · ${topic}`);
            const body = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${String(data.get("message") ?? "")}`,
            );
            window.location.href = `mailto:${siteMeta.email}?subject=${subject}&body=${body}`;
        } finally {
            setSubmitting(false);
        }
    }

    const slideIn = { opacity: 0, y: 18 } as const;
    const slideAnimate = { opacity: 1, y: 0 } as const;
    const slideExit = { opacity: 0, y: -18 } as const;
    const slideTx = { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };

    return (
        <AnimatePresence mode="wait">
            {sent ? (
                <m.div
                    key="success"
                    className={`glass-card ${styles.success}`}
                    initial={slideIn}
                    animate={slideAnimate}
                    exit={slideExit}
                    transition={slideTx}
                >
                    <div className={styles.successIcon}>
                        <CheckCircle2 size={28} />
                    </div>
                    <h3>Message sent</h3>
                    <p>Thanks for reaching out — I&apos;ll reply within 24–48 hours.</p>
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => {
                            setSent(false);
                            setTopic(DEFAULT_TOPIC);
                        }}
                    >
                        Send another
                    </button>
                </m.div>
            ) : (
                <m.form
                    key="form"
                    className={`glass-card ${styles.form}`}
                    initial={slideIn}
                    animate={slideAnimate}
                    exit={slideExit}
                    transition={slideTx}
                    onSubmit={handleSubmit}
                    noValidate={false}
                >
            <div className={styles.header}>
                <div className={styles.headerIcon} aria-hidden>
                    <Mail size={22} />
                </div>
                <div>
                    <p className={styles.label}>Direct message</p>
                    <h3>Send a message</h3>
                    <p className={styles.subtitle}>I&apos;ll get back to you at the email you provide.</p>
                </div>
            </div>

            <input type="text" name="_honey" className={styles.honey} tabIndex={-1} autoComplete="off" />

            <div className={styles.fields}>
                <label className={styles.field}>
                    <span className={styles.fieldLabel}>Full name</span>
                    <input name="name" type="text" required autoComplete="name" placeholder="Your name" />
                </label>

                <label className={styles.field}>
                    <span className={styles.fieldLabel}>Email</span>
                    <input
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@company.com"
                    />
                </label>

                <div className={styles.field}>
                    <span className={styles.fieldLabel} id="contact-topic-label">
                        Topic
                    </span>
                    <ThemedSelect
                        name="topic"
                        value={topic}
                        onChange={setTopic}
                        options={INQUIRY_TOPICS}
                        required
                        aria-label="Inquiry topic"
                    />
                </div>

                <label className={styles.field}>
                    <span className={styles.fieldLabel}>Message</span>
                    <textarea
                        name="message"
                        rows={4}
                        required
                        placeholder="Tell me about the role, project, or how I can help…"
                    />
                </label>
            </div>

            <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={submitting}>
                <Send size={18} />
                {submitting ? "Sending…" : "Send message"}
            </button>
                </m.form>
            )}
        </AnimatePresence>
    );
}
