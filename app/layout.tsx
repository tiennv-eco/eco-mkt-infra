import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Serif } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-sans",
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Ecomobi Marketing Knowledge Base",
  description: "Internal knowledge-base tool for the Ecomobi marketing team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${ibmPlexSerif.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
        />
      </head>
      <body>
        <SessionProvider>
          <div className="app-shell">
            <Sidebar />
            <main className="site-main">{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
