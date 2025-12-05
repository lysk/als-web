import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anime Last Stand - Team Optimizer & Active Codes | ALS Tools",
  description: "Build the perfect team in Anime Last Stand with our advanced DPS calculator. Get the latest active codes and tier lists to dominate every stage.",
  keywords: "anime last stand, als, team calculator, active codes, tier list, dps calculator, best team",
  openGraph: {
    title: "Anime Last Stand Team Optimizer & Active Codes",
    description: "Build the best team with our DPS calculator. Find active codes and tier lists.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="text-2xl font-bold">
                ALS Tools
              </a>
              <div className="hidden md:flex gap-6">
                <a href="/" className="hover:text-primary">Home</a>
                <a href="/units" className="hover:text-primary">Units</a>
                <a href="/codes" className="hover:text-primary">Codes</a>
                <a href="/tier-list" className="hover:text-primary">Tier List</a>
                <a href="/items" className="hover:text-primary">Items</a>
              </div>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="border-t mt-20">
          <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
            <p>© 2025 ALS Tools. Data sourced from Anime Last Stand Wiki.</p>
            <p className="mt-2">
              Not affiliated with Anime Last Stand or Roblox.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
