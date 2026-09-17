# Gallery photos

Tiles use **local SVG illustrations** in this folder — no external CDN hotlinks. Each file
matches the tile theme (dev setup, certifications, Puri coast, etc.) and falls back to the
gradient defined in `src/data/gallery.ts` if `image` is removed.

To swap in a real photo later:

```ts
{
    id: "1",
    title: "Remote Dev Setup",
    category: "Work",
    description: "...",
    gradient: "linear-gradient(135deg, #0f766e 0%, #1e293b 100%)",
    image: "/gallery/remote-setup.jpg",
}
```

- Drop JPG/WebP files here and update the `image` path in `src/data/gallery.ts`.
- Recommended: compress to `<300KB`, roughly `1600x1000` (16:10).
- `GalleryGrid` renders the photo with `object-fit: cover`; gradients remain the fallback.
