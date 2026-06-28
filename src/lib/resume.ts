import { assetPath } from "@/lib/paths";

/** Bump when resume files in public/ are regenerated (cache bust for CDN/browsers). */
const RESUME_VERSION = "20250628";

function resumeAsset(path: string): string {
    return `${assetPath(path)}?v=${RESUME_VERSION}`;
}

/** Primary resume download — PDF when generated, HTML fallback always available. */
export const resumePdfUrl = resumeAsset("/resume.pdf");
export const resumeDocxUrl = resumeAsset("/resume.docx");
export const resumeHtmlUrl = resumeAsset("/resume.html");

/** Use HTML fallback until PDF is synced from the resume/ project. */
export const resumePrimaryUrl = resumePdfUrl;