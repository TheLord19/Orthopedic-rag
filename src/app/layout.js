// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/animations.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OrthoInsight — Orthopedic AI Assistant",
  description:
    "AI-powered orthopedic research assistant with musculoskeletal X-ray analysis, backed by a 17-model MURA deep-learning ensemble.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1120" },
  ],
};

const themeInitScript = `(function(){try{var p=localStorage.getItem('oi-theme');var t=(p==='light'||p==='dark')?p:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={inter.className}>
        <div className="app-container">{children}</div>
      </body>
    </html>
  );
}
