import { assetPath } from "@/lib/paths";

/** Primary resume download — PDF when generated, HTML fallback always available. */
export const resumePdfUrl = assetPath("/resume.pdf");
export const resumeDocxUrl = assetPath("/resume.docx");
export const resumeHtmlUrl = assetPath("/resume.html");

/** Use HTML fallback until PDF is synced from the resume/ project. */
export const resumePrimaryUrl = resumePdfUrl;
