import { ChatWindow } from "@/components/chat/ChatWindow";
import { createPageMetadata } from "@/lib/site-metadata";
import styles from "./chat.module.css";

export const metadata = createPageMetadata(
    "Portfolio Chat",
    "Portfolio assistant for Rihan's resume — keyword-matched answers, streaming replies, and private in-browser chat.",
    "/chat",
);

export default function ChatPage() {
    return (
        <div className={styles.layout}>
            <div className={`container ${styles.page}`}>
                <ChatWindow />
            </div>
        </div>
    );
}
