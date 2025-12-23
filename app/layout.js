import {  Google_Sans_Code, Merriweather, Merriweather_Sans, Parkinsans } from "next/font/google";
import "./globals.css";

const font = Parkinsans({
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
      <body
        className={`${font.className} h-dvh `}
      >
        {children}
      </body>
    </html>
  );
}
