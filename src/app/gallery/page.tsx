import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(
    "Gallery",
    "Personal snapshots — work, learning, and life."
);

export default function GalleryPage() {
    return (
        <>
            <PageHeader
                title="Gallery"
                description="Personal snapshots — work, learning, and life. Placeholder tiles ready for your photos."
            />
            <div className="container">
                <GalleryGrid />
            </div>
        </>
    );
}
