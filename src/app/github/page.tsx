import { ContributionGraph } from "@/components/github/ContributionGraph";
import { PageHeader } from "@/components/layout/PageHeader";
import { FadeIn } from "@/components/effects/FadeIn";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(
    "GitHub Activity",
    "Contribution graph, animated snake, and activity insights for @im-rihan.",
    "/github",
);

export default function GitHubPage() {
    return (
        <>
            <PageHeader
                title="GitHub Activity"
                description={
                    <>
                        Public contribution heatmap, daily snake animation, and rule-based insights from{" "}
                        <a
                            href="https://github.com/im-rihan"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor="pointer"
                        >
                            @im-rihan
                        </a>
                        . Full profile README →{" "}
                        <a
                            href="https://github.com/im-rihan"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor="pointer"
                        >
                            github.com/im-rihan
                        </a>
                        .
                    </>
                }
            />
            <FadeIn>
                <div className="container page-content">
                    <ContributionGraph />
                </div>
            </FadeIn>
        </>
    );
}
