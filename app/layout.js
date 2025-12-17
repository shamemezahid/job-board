import { Figtree, Geist, Geist_Mono, Google_Sans_Code, Parkinsans } from "next/font/google";
import "./globals.css";

const font = Parkinsans({
  subsets: ["latin"],
});

export const metadata = {
  title: "Job Board",
  description: "Browse available job postings",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${font.className}`}
      >
        {children}
      </body>
    </html>
  );
}
