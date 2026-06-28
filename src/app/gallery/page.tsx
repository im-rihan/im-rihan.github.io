import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(
    "Gallery",
    "Work, learning, and life snapshots from Rihan's portfolio journey.",
    "/gallery",
);

export default function GalleryPage() {
    return (
        <>
            <PageHeader
                title="Gallery"
                description="Moments from remote engineering, continuous learning, and life in Puri — filter by Work, Learning, or Life."
            />
            <div className="container">
                <GalleryGrid />
            </div>
        </>
    );
}
