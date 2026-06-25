import { ChatWindow } from "@/components/chat/ChatWindow";

export default function ChatPage() {
    return (
        <>
            <header className="page-header container">
                <h1>Portfolio Chat</h1>
                <p>
                    Ask about Rihan&apos;s skills, experience, projects, and certifications —
                    powered by a client-side knowledge base.
                </p>
            </header>
            <div className="container">
                <ChatWindow />
            </div>
        </>
    );
}
