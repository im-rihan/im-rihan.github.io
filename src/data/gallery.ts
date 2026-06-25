export type GalleryCategory = "Work" | "Learning" | "Life";

export interface GalleryItem {
    id: string;
    title: string;
    category: GalleryCategory;
    description: string;
    gradient: string;
}

export const galleryItems: GalleryItem[] = [
    {
        id: "1",
        title: "Dev Workspace",
        category: "Work",
        description: "Placeholder — add your workspace photo",
        gradient: "linear-gradient(135deg, #0f766e 0%, #1e293b 100%)",
    },
    {
        id: "2",
        title: "Code & Coffee",
        category: "Work",
        description: "Placeholder — add a candid work moment",
        gradient: "linear-gradient(135deg, #a855f7 0%, #0f172a 100%)",
    },
    {
        id: "3",
        title: "Learning Sprint",
        category: "Learning",
        description: "Placeholder — course or certification milestone",
        gradient: "linear-gradient(135deg, #22c55e 0%, #0d5c56 100%)",
    },
    {
        id: "4",
        title: "Side Project",
        category: "Learning",
        description: "Placeholder — hobby build or experiment",
        gradient: "linear-gradient(135deg, #f59e0b 0%, #1e293b 100%)",
    },
    {
        id: "5",
        title: "Puri Sunset",
        category: "Life",
        description: "Placeholder — hometown or travel photo",
        gradient: "linear-gradient(135deg, #ec4899 0%, #0f766e 100%)",
    },
    {
        id: "6",
        title: "Team Remote",
        category: "Work",
        description: "Placeholder — remote collaboration snapshot",
        gradient: "linear-gradient(135deg, #14b8a6 0%, #334155 100%)",
    },
    {
        id: "7",
        title: "Conference / Meetup",
        category: "Learning",
        description: "Placeholder — event or community photo",
        gradient: "linear-gradient(135deg, #6366f1 0%, #0f172a 100%)",
    },
    {
        id: "8",
        title: "Weekend Reset",
        category: "Life",
        description: "Placeholder — personal life moment",
        gradient: "linear-gradient(135deg, #f97316 0%, #1e293b 100%)",
    },
    {
        id: "9",
        title: "Open Source",
        category: "Work",
        description: "Placeholder — GitHub contribution highlight",
        gradient: "linear-gradient(135deg, #22d3ee 0%, #0f766e 100%)",
    },
];
