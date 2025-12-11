import { getCodes } from '@/lib/services/code-service';
import { ActiveCodesList } from '@/components/home/ActiveCodesList';
import { ToolCard } from '@/components/ui/ToolCard';
import { Calculator, List, Database, Gift, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const date = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return {
    title: `Anime Last Stand Tools - Calculator, Codes & Tier List (${month} ${year})`,
    description: `The ultimate Anime Last Stand (ALS) companion. Features the best DPS Calculator, updated ${month} ${year} Codes, and S+ Tier List. Dominate Story and Infinite modes now.`,
    keywords: [`Anime Last Stand`, `Anime Last Stand Calculator`, `ALS Tools`, `Anime Last Stand Wiki`, `ALS Codes`, `ALS Tier List`],
    openGraph: {
      title: `Anime Last Stand Tools - Calculator, Codes & Tier List (${month} ${year})`,
      description: `The ultimate Anime Last Stand (ALS) companion. Features the best DPS Calculator, updated ${month} ${year} Codes, and S+ Tier List.`,
      type: 'website',
    }
  };
}


export default async function HomePage() {
  const codes = await getCodes();
  const activeCodes = codes.filter(code => code.status === 'Active');

  const date = new Date();
  const lastUpdated = `${date.getDate()} ${date.toLocaleString('en-US', { month: 'long' })} ${date.getFullYear()}`;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="relative text-center mb-24 max-w-4xl mx-auto">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
          Updated: {lastUpdated}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 text-glow">
          Anime Last Stand Tools & Calculator
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Dominate Anime Last Stand with advanced tools. Optimize your DPS, find the best units, and never miss a code.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/calculator"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
          >
            Optimize Team
          </Link>
          <Link
            href="/codes"
            className="px-8 py-4 bg-white/5 text-foreground border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-sm"
          >
            Get Active Codes
          </Link>
          <a
            href="https://discord.gg/animelaststand"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[#5865F2] text-white rounded-xl font-bold hover:bg-[#4752C4] transition-all hover:scale-105 shadow-lg shadow-[#5865F2]/25 flex items-center justify-center gap-2"
          >
            <Users className="h-5 w-5" />
            Join Discord
          </a>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
        <ToolCard
          title="DPS Calculator"
          description="Build the perfect team. Calculate DPS, analyze synergies, and get AI-powered upgrade recommendations."
          href="/calculator"
          icon={<Calculator className="h-6 w-6" />}
          className="md:col-span-2 lg:col-span-1"
        />
        <ToolCard
          title="Tier List"
          description="Rankings for every unit in the game. Filter by meta, story mode, and infinite mode viability."
          href="/tier-list"
          icon={<List className="h-6 w-6" />}
        />
        <ToolCard
          title="Unit Database"
          description="Complete stats for over 200+ units. Search by rarity, element, and ability type."
          href="/units"
          icon={<Database className="h-6 w-6" />}
          stats="200+ Units"
        />
        <ToolCard
          title="Active Codes"
          description="Don't miss out on free gems and shards. Updated daily with the latest working codes."
          href="/codes"
          icon={<Gift className="h-6 w-6" />}
          stats={`${activeCodes.length} Active`}
        />
        <ToolCard
          title="Items & Techniques"
          description="Browse all available items, evolution materials, and technique effects."
          href="/items"
          icon={<ExternalLink className="h-6 w-6" />}
        />
        <a
          href="https://discord.gg/animelaststand"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col justify-center items-center overflow-hidden rounded-xl border border-dashed border-[#5865F2]/30 bg-[#5865F2]/5 p-6 hover:bg-[#5865F2]/10 transition-colors"
        >
          <Users className="h-8 w-8 text-[#5865F2] mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold text-[#5865F2]">Official Discord</h3>
          <p className="text-xs text-muted-foreground mt-2 group-hover:text-[#5865F2]/80">Join the Community</p>
        </a>
      </section>

      {/* Live Data Sections */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Latest Codes Preview */}
        <ActiveCodesList activeCodes={activeCodes} />

        {/* About & Info */}
        <section className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold flex items-center gap-2 not-prose mb-8">
            <Database className="text-primary" /> About The Project
          </h2>
          <p className="text-muted-foreground">
            This open-source project aims to provide the most accurate and up-to-date tools for the Anime Last Stand community.
            We automatically scrape the Wiki and verify data to ensure your calculations are precise.
          </p>
          <div className="grid grid-cols-2 gap-4 not-prose mt-8">
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">Daily</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Updates</div>
            </div>
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Free</div>
            </div>
          </div>
        </section>
      </div>
      {/* WebSite Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Anime Last Stand Tools",
            "url": "https://als-tools.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://als-tools.com/units?search={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "description": "The ultimate operational hub for Anime Last Stand players. DPS Calculator, Tier Lists, and Active Codes."
          })
        }}
      />
    </div>
  );
}
