import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flash Loan Risk Lab — Educational Demo",
  description:
    "Educational lab comparing VulnerableVault vs MitigatedVault under single-block oracle manipulation. Demo funds only. Not production DeFi. Not financial advice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
