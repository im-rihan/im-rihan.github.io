import { ContributionGraph } from "@/components/github/ContributionGraph";
import { PageHeader } from "@/components/layout/PageHeader";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(
    "GitHub Activity",
    "Public contribution graph and activity insights for @im-rihan."
);

export default function GitHubPage() {
    return (
        <>
            <PageHeader
                title="GitHub Activity"
                description={
                    <>
                        Public contribution graph and rule-based suggestions from{" "}
                        <a href="https://github.com/im-rihan" target="_blank" rel="noopener noreferrer">
                            @im-rihan
                        </a>
                        .
                    </>
                }
            />
            <div className="container">
                <ContributionGraph />
            </div>
        </>
    );
}
