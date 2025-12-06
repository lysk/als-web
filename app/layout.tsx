import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen relative overflow-hidden">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

          {children}
        </main>
        <footer className="border-t border-white/10 mt-20 bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="font-bold text-lg mb-4 text-foreground">ALS Tools</div>
                <p className="text-sm text-muted-foreground">
                  The ultimate companion for Anime Last Stand. Build better teams, find codes, and track tier lists.
                </p>
              </div>
              <div>
                <div className="font-bold mb-4 text-foreground">Tools</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="/calculator" className="hover:text-primary transition-colors">DPS Calculator</a></li>
                  <li><a href="/tier-list" className="hover:text-primary transition-colors">Tier List</a></li>
                  <li><a href="/units" className="hover:text-primary transition-colors">Unit Database</a></li>
                  <li><a href="/codes" className="hover:text-primary transition-colors">Active Codes</a></li>
                </ul>
              </div>
              <div>
                <div className="font-bold mb-4 text-foreground">Legal</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
              <p>© 2025 ALS Tools. Data sourced from Anime Last Stand Wiki.</p>
              <p className="mt-2">
                Not affiliated with Anime Last Stand or Roblox.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
