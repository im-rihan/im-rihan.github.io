# Gallery photos

Every tile currently shows a real, freely-licensed photo hotlinked from [Unsplash](https://unsplash.com/license)
(free to use, attribution appreciated but not required), picked to match that tile's theme —
e.g. a MacBook with code for "Remote Dev Setup", a framed diploma for "Certification
Milestones". Unsplash's old random-by-keyword "Source" API was shut down in 2024, so these
are specific, verified photo IDs rather than a random feed. Replace them with real photos
whenever available.

Drop real photos here (e.g. `remote-setup.jpg`, `puri-odisha.jpg`) and reference them from
`src/data/gallery.ts` by setting the `image` field on the matching `GalleryItem`:

```ts
{
    id: "1",
    title: "Remote Dev Setup",
    category: "Work",
    description: "...",
    gradient: "linear-gradient(135deg, #0f766e 0%, #1e293b 100%)",
    image: "/gallery/remote-setup.jpg", // <- add this line
}
```

- `GalleryGrid` automatically renders the photo (`object-fit: cover`) instead of the gradient
  tile once `image` is set — no other code changes needed.
- Recommended: compress to `<300KB`, roughly `1600x1000` (16:10), JPG or WebP. This is a fully
  static export, so images are served as-is with no server-side optimization.
- Items without an `image` keep showing their gradient placeholder, so photos can be added
  incrementally.
