import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Longer Break",
  description: "Find the perfect time for your extended breaks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.cdnfonts.com/css/satoshi" rel="stylesheet" />
      </head>
      <body className="font-['Satoshi']">{children}</body>
    </html>
  );
}
