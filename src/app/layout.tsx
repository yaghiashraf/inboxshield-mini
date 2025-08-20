import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InboxShield Mini - Email Deliverability Audit Tool",
  description: "Professional email authentication audit for small businesses. Analyze SPF, DKIM, DMARC, BIMI & MTA-STS records. Get instant fixes and improve email deliverability.",
  keywords: ["email deliverability", "SPF", "DKIM", "DMARC", "BIMI", "MTA-STS", "email authentication", "DNS audit", "email security"],
  authors: [{ name: "InboxShield" }],
  creator: "InboxShield",
  publisher: "InboxShield",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://inboxshield-mini.netlify.app'),
  openGraph: {
    title: "InboxShield Mini - Email Deliverability Audit Tool",
    description: "Professional email authentication audit for small businesses. Check SPF, DKIM, DMARC, BIMI & MTA-STS records and get instant fixes to improve your email deliverability.",
    url: 'https://inboxshield-mini.netlify.app',
    siteName: 'InboxShield Mini',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'InboxShield Mini - Email Deliverability Audit Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "InboxShield Mini - Email Deliverability Audit Tool",
    description: "Professional email authentication audit. Check SPF, DKIM, DMARC, BIMI & MTA-STS records and get instant fixes.",
    images: ['/og-image.png'],
    creator: '@inboxshield',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
