import { assetPath } from "@/lib/paths";

/** Bump when public/resume.* files are regenerated (cache bust). */
const RESUME_VERSION = "20250628";

function resumeAsset(path: string): string {
    return `${assetPath(path)}?v=${RESUME_VERSION}`;
}

export const resumePdfUrl = resumeAsset("/resume.pdf");
export const resumeDocxUrl = resumeAsset("/resume.docx");
export const resumeHtmlUrl = resumeAsset("/resume.html");
