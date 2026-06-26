import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { AppShell } from "@/components/layout/AppShell";
import { rootMetadata } from "@/lib/site-metadata";
import "./globals.css";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
                <Providers>
                    <AppShell>{children}</AppShell>
                </Providers>
            </body>
        </html>
    );
}
