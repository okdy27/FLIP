import type { Metadata } from "next";
import "./globals.css";
import MiniKitProvider from "./minikit-provider";

export const metadata: Metadata = {
  title: "FLIP - World App Wallet & Swap",
  description: "Swap token instan di World App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <MiniKitProvider>{children}</MiniKitProvider>
      </body>
    </html>
  );
}