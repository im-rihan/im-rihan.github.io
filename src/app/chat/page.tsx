import { ChatWindow } from "@/components/chat/ChatWindow";
import { PageHeader } from "@/components/layout/PageHeader";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(
    "Portfolio Chat",
    "Portfolio assistant for Rihan's resume — keyword-matched answers, streaming replies, and private in-browser chat.",
    "/chat",
);

export default function ChatPage() {
    return (
        <>
            <PageHeader
                title="Portfolio Chat"
                description={
                    <>
                        Chat with a portfolio assistant trained on Rihan&apos;s resume — skills, experience,
                        projects, and certifications. Answers are keyword-matched and run entirely in your browser.
                    </>
                }
            />
            <div className="container page-content">
                <ChatWindow />
            </div>
        </>
    );
}
