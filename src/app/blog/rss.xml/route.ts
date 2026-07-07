import { sortedBlogPosts } from "@/data/blog-posts";
import { siteMeta } from "@/data/profile";
import { siteUrl } from "@/lib/site-metadata";

// Route Handlers that only respond to GET and return static content are
// pre-rendered to a static file at build time under `output: "export"` —
// same mechanism as sitemap.ts/robots.ts.
export const dynamic = "force-static";

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export async function GET() {
    const posts = sortedBlogPosts();
    const feedUrl = `${siteUrl}/blog/rss.xml`;
    const now = new Date().toUTCString();

    const items = posts
        .map((post) => {
            const url = `${siteUrl}/blog/${post.slug}/`;
            const categories = post.tags
                .map((tag) => `      <category>${escapeXml(tag)}</category>`)
                .join("\n");
            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
${categories}
    </item>`;
        })
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteMeta.name)} — Blog</title>
    <link>${siteUrl}/blog/</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(siteMeta.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>
`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
        },
    });
}
