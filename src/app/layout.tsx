import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { AppShell } from "@/components/layout/AppShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { AnalyticsScript } from "@/components/seo/AnalyticsScript";
import { WebVitalsReporter } from "@/components/seo/WebVitalsReporter";
import { ServiceWorkerRegistration } from "@/components/seo/ServiceWorkerRegistration";
import { rootMetadata, rootViewport } from "@/lib/site-metadata";
import "./globals.css";
import "@/styles/touch-blur-fallback.css";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-sans",
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

export const metadata = rootMetadata;
export const viewport = rootViewport;

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
            <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
                <JsonLd />
                <AnalyticsScript />
                <WebVitalsReporter />
                <ServiceWorkerRegistration />
                <Providers>
                    <AppShell>{children}</AppShell>
                </Providers>
            </body>
        </html>
    );
}
