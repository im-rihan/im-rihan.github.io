import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/data/case-studies";
import { createPageMetadata, siteUrl } from "@/lib/site-metadata";
import { siteMeta } from "@/data/profile";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { CaseStudyContent } from "@/components/work/CaseStudyContent";

export function generateStaticParams() {
    return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const study = getCaseStudy(slug);
    if (!study) return {};
    return createPageMetadata(study.title, study.subtitle, `/work/${slug}`, {
        ogImage: study.ogImage,
    });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const study = getCaseStudy(slug);
    if (!study) notFound();

    const studyUrl = `${siteUrl}/work/${slug}/`;

    const creativeWork = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: study.title,
        description: study.subtitle,
        url: studyUrl,
        keywords: study.stack.join(", "),
        creator: { "@type": "Person", name: siteMeta.name, url: siteUrl },
        about: study.problem,
    };

    const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
            { "@type": "ListItem", position: 2, name: "Case Studies", item: `${siteUrl}/work/` },
            { "@type": "ListItem", position: 3, name: study.title, item: studyUrl },
        ],
    };

    return (
        <>
            <PageJsonLd data={[creativeWork, breadcrumb]} />
            <PageHeader title={study.title} description={study.subtitle} />
            <CaseStudyContent study={study} />
        </>
    );
}
