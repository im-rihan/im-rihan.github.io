import { ContributionGraph } from "@/components/github/ContributionGraph";

export default function GitHubPage() {
    return (
        <>
            <header className="page-header container">
                <h1>GitHub Activity</h1>
                <p>
                    Public contribution graph and rule-based suggestions from{" "}
                    <a href="https://github.com/im-rihan" target="_blank" rel="noopener noreferrer">
                        @im-rihan
                    </a>
                    .
                </p>
            </header>
            <div className="container">
                <ContributionGraph />
            </div>
        </>
    );
}
