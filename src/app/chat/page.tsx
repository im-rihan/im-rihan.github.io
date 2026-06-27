import { ChatWindow } from "@/components/chat/ChatWindow";
import { PageHeader } from "@/components/layout/PageHeader";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(
    "Portfolio Chat",
    "Ask about skills, experience, projects, and certifications."
);

export default function ChatPage() {
    return (
        <>
            <PageHeader
                title="Portfolio Chat"
                description={
                    <>
                        Chat with an AI assistant trained on Rihan&apos;s resume — skills, experience,
                        projects, and certifications. Everything runs in your browser.
                    </>
                }
            />
            <div className="container">
                <ChatWindow />
            </div>
        </>
    );
}
