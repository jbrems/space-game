import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Space Game",
  description: "Launch from Earth, land on the Moon!",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="w-screen h-screen overflow-hidden">{children}</body>
    </html>
  );
}
