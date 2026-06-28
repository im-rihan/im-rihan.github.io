"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { siteMeta } from "@/data/profile";
import styles from "./ContactForm.module.css";

export function ContactForm() {
    const [sent, setSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        const form = e.currentTarget;
        const data = new FormData(form);

        try {
            await fetch("https://formsubmit.co/ajax/im.rihan.dev@gmail.com", {
                method: "POST",
                headers: { Accept: "application/json" },
                body: data,
            });
            setSent(true);
            form.reset();
        } catch {
            window.location.href = `mailto:${siteMeta.email}?subject=Portfolio%20inquiry`;
        } finally {
            setSubmitting(false);
        }
    }

    if (sent) {
        return (
            <div className={`glass-card ${styles.success}`}>
                <CheckCircle2 size={28} />
                <h3>Message sent</h3>
                <p>Thanks for reaching out — I&apos;ll reply within 24–48 hours.</p>
                <button type="button" className="btn btn-outline" onClick={() => setSent(false)}>
                    Send another
                </button>
            </div>
        );
    }

    return (
        <form className={`glass-card ${styles.form}`} onSubmit={handleSubmit}>
            <h3>Send a message</h3>
            <input type="hidden" name="_subject" value="Portfolio contact form" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="text" name="_honey" className={styles.honey} tabIndex={-1} autoComplete="off" />

            <label>
                Name
                <input name="name" type="text" required autoComplete="name" />
            </label>
            <label>
                Email
                <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
                Message
                <textarea name="message" rows={4} required placeholder="Tell me about the role or project…" />
            </label>
            <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={submitting}>
                <Send size={18} />
                {submitting ? "Sending…" : "Send message"}
            </button>
        </form>
    );
}
