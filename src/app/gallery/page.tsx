import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export default function GalleryPage() {
    return (
        <>
            <header className="page-header container">
                <h1>Gallery</h1>
                <p>Personal snapshots — work, learning, and life. Placeholder tiles ready for your photos.</p>
            </header>
            <div className="container">
                <GalleryGrid />
            </div>
        </>
    );
}
