import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";
import { themeInitializationScript } from "@/lib/theme-preference";

export const metadata: Metadata = {
  title: "SellWella",
  description: "SellWella application",
  icons: {
    icon: { url: "/sellwella-mark.svg", type: "image/svg+xml" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitializationScript }}
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
