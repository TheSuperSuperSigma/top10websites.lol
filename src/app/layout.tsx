import { Analytics } from '@vercel/analytics/next';
import { Geist, Geist_Mono } from "next/font/google";
// Remove the Script import since it's not being used
import ThemeToggle from "../components/ThemeToggle";
import ThemeProvider from "../components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Top 10 Websites",
  description: "ChatGPT Works Overtime No Pay",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <ThemeToggle />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
