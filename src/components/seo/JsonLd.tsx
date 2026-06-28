import { siteMeta } from "@/data/profile";
import { siteUrl } from "@/lib/site-metadata";

export function JsonLd() {
    const person = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: siteMeta.name,
        jobTitle: siteMeta.title,
        url: siteUrl,
        email: siteMeta.email,
        address: {
            "@type": "PostalAddress",
            addressLocality: "Puri",
            addressRegion: "Odisha",
            addressCountry: "IN",
        },
        sameAs: [siteMeta.github, siteMeta.linkedin, siteMeta.twitter],
    };

    const website = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: `${siteMeta.name} Portfolio`,
        url: siteUrl,
        description: siteMeta.description,
        author: { "@type": "Person", name: siteMeta.name },
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
        </>
    );
}
