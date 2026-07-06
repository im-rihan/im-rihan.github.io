import { readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";
import gifenc from "gifenc";
import { PNG } from "pngjs";

const { GIFEncoder, quantize, applyPalette } = gifenc;

const OG_WIDTH = 1200;
const BRAND_WIDTH = 512;
const GIF_FRAMES = 20;
const GIF_DELAY_MS = 90;

function svgToPng(svg, width) {
    const resvg = new Resvg(Buffer.from(svg), { fitTo: { mode: "width", value: width } });
    return resvg.render().asPng();
}

function svgToPngFile(input, output, width) {
    const svg = readFileSync(input, "utf8");
    writeFileSync(output, svgToPng(svg, width));
    console.log(`Generated ${output}`);
}

function pngToRgba(buffer) {
    const png = PNG.sync.read(buffer);
    return { data: png.data, width: png.width, height: png.height };
}

function frameState(frameIndex) {
    const t = (frameIndex / GIF_FRAMES) * Math.PI * 2;
    const cursorOpacity = frameIndex % GIF_FRAMES < GIF_FRAMES / 2 ? 1 : 0;
    const glowOpacity = 0.045 + 0.028 * Math.sin(t);
    const dotOpacity = 0.55 + 0.45 * Math.sin(t + Math.PI / 5);
    const liveDotOpacity = 0.6 + 0.4 * Math.sin(t + Math.PI / 4);
    const bracketPulse = 0.82 + 0.18 * Math.sin(t);

    return { cursorOpacity, glowOpacity, dotOpacity, liveDotOpacity, bracketPulse };
}

function patchOgSvg(baseSvg, { theme, cursorOpacity, glowOpacity, dotOpacity }) {
    const cursorColor = theme === "dark" ? "#2dd4bf" : "#0f766e";
    const dotColor = theme === "dark" ? "#22c55e" : "#16a34a";
    const cursor =
        `<rect x="37" y="32" width="2" height="8" rx="0.5" fill="${cursorColor}" opacity="${cursorOpacity.toFixed(2)}"/>`;

    let svg = baseSvg.replace(
        /<ellipse cx="238" cy="315"[^/]*\/>/,
        `<ellipse cx="238" cy="315" rx="190" ry="175" fill="#14b8a6" opacity="${glowOpacity.toFixed(3)}"/>`,
    );

    svg = svg.replace(
        /<circle cx="22" cy="17" r="5" fill="[^"]+"\/>/,
        `<circle cx="22" cy="17" r="5" fill="${dotColor}" opacity="${dotOpacity.toFixed(3)}"/>`,
    );

    svg = svg.replace(
        /(<path d="M29 36 V18 L32 26 L35 18 V36"[^/]*\/>)/,
        `$1\n      ${cursor}`,
    );

    return svg;
}

function patchBrandSvg(baseSvg, { cursorOpacity, liveDotOpacity, bracketPulse }) {
    let svg = baseSvg.replace(
        /<rect x="37" y="32" width="2" height="8" rx="0.5" fill="([^"]+)"[^/]*\/>/,
        `<rect x="37" y="32" width="2" height="8" rx="0.5" fill="$1" opacity="${cursorOpacity.toFixed(2)}"/>`,
    );

    svg = svg.replace(
        /<circle cx="20" cy="10" r="1.5" fill="#22c55e" opacity="[^"]+"\/>/,
        `<circle cx="20" cy="10" r="1.5" fill="#22c55e" opacity="${liveDotOpacity.toFixed(3)}"/>`,
    );

    svg = svg.replace(
        /(<path d="M(?:11|37) 20 V38[^"]*" stroke="url\(#stroke\)" stroke-width="1\.[^"]*" stroke-linecap="round" opacity=")([0-9.]+)("\/>)/g,
        (_, pre, base, post) => `${pre}${(parseFloat(base) * bracketPulse).toFixed(3)}${post}`,
    );

    return svg;
}

function buildGif({ inputSvgPath, outputGifPath, width, patchFrame }) {
    const baseSvg = readFileSync(inputSvgPath, "utf8");
    const encoder = GIFEncoder();
    const frames = [];

    for (let i = 0; i < GIF_FRAMES; i++) {
        const state = frameState(i);
        const svg = patchFrame(baseSvg, state);
        const pngBuffer = svgToPng(svg, width);
        frames.push(pngToRgba(pngBuffer));
    }

    for (const frame of frames) {
        const palette = quantize(frame.data, 256);
        const index = applyPalette(frame.data, palette);
        encoder.writeFrame(index, frame.width, frame.height, {
            palette,
            delay: GIF_DELAY_MS,
            dispose: 2,
        });
    }

    writeFileSync(outputGifPath, Buffer.from(encoder.bytes()));
    const sizeKb = Math.round(readFileSync(outputGifPath).length / 1024);
    console.log(`Generated ${outputGifPath} (${sizeKb} KB, ${GIF_FRAMES} frames)`);
}

svgToPngFile("public/og-image-dark.svg", "public/og-image-dark.png", OG_WIDTH);
svgToPngFile("public/og-image-light.svg", "public/og-image-light.png", OG_WIDTH);
svgToPngFile("public/og-image-dark.svg", "public/og-image.png", OG_WIDTH);
svgToPngFile("public/brand-logo-light.svg", "public/brand-logo-light.png", BRAND_WIDTH);
svgToPngFile("public/brand-logo-dark.svg", "public/brand-logo-dark.png", BRAND_WIDTH);

// PWA manifest icons
svgToPngFile("public/favicon.svg", "public/icon-192.png", 192);
svgToPngFile("public/favicon.svg", "public/icon-512.png", 512);
svgToPngFile("public/icon-maskable.svg", "public/icon-maskable-512.png", 512);

buildGif({
    inputSvgPath: "public/og-image-dark.svg",
    outputGifPath: "public/og-image-dark.gif",
    width: OG_WIDTH,
    patchFrame: (svg, state) => patchOgSvg(svg, { theme: "dark", ...state }),
});

buildGif({
    inputSvgPath: "public/og-image-light.svg",
    outputGifPath: "public/og-image-light.gif",
    width: OG_WIDTH,
    patchFrame: (svg, state) => patchOgSvg(svg, { theme: "light", ...state }),
});

buildGif({
    inputSvgPath: "public/og-image-dark.svg",
    outputGifPath: "public/og-image.gif",
    width: OG_WIDTH,
    patchFrame: (svg, state) => patchOgSvg(svg, { theme: "dark", ...state }),
});

buildGif({
    inputSvgPath: "public/brand-logo-dark.svg",
    outputGifPath: "public/brand-logo-dark.gif",
    width: BRAND_WIDTH,
    patchFrame: (svg, state) => patchBrandSvg(svg, state),
});

buildGif({
    inputSvgPath: "public/brand-logo-light.svg",
    outputGifPath: "public/brand-logo-light.gif",
    width: BRAND_WIDTH,
    patchFrame: (svg, state) => patchBrandSvg(svg, state),
});

buildGif({
    inputSvgPath: "public/brand-logo-dark.svg",
    outputGifPath: "public/brand-logo.gif",
    width: BRAND_WIDTH,
    patchFrame: (svg, state) => patchBrandSvg(svg, state),
});
