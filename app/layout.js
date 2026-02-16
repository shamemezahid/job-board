import {  Google_Sans_Code, Inter, Merriweather, Merriweather_Sans, Parkinsans } from "next/font/google";
import "./globals.css";

const font = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Airwork AI | All jobs",
  description: "Browse available job postings",
  icons: {
    icon: "/airwork.ai.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body
        className={`${font.className} h-dvh `}
      >
        {children}
      </body>
    </html>
  );
}
