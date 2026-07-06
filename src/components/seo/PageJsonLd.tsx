/** Renders one or more schema.org JSON-LD blocks for a single page. */
export function PageJsonLd({ data }: { data: object | object[] }) {
    const items = Array.isArray(data) ? data : [data];
    return (
        <>
            {items.map((item, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
            ))}
        </>
    );
}
