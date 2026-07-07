import { caseStudies } from "@/data/case-studies";
import { createPageMetadata, siteUrl } from "@/lib/site-metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { WorkCardList } from "@/components/work/WorkCardList";
import styles from "./work.module.css";

export const metadata = createPageMetadata(
    "Case Studies",
    "Deep dives into production fintech and real-estate projects — Ziffy.ai, NestJS APIs, integrations, and data pipelines.",
    "/work",
);

const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Case Studies", item: `${siteUrl}/work/` },
    ],
};

export default function WorkIndexPage() {
    return (
        <>
            <PageJsonLd data={breadcrumb} />
            <PageHeader
                title="Case Studies"
                description={
                    <>
                        Production systems built at Ziffy.ai and HomeAbroad Inc. — problem, approach, and results for
                        each project.
                    </>
                }
            />
            <div className={`container ${styles.page}`}>
                <WorkCardList studies={caseStudies} />
            </div>
        </>
    );
}
