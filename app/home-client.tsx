'use client';

import { Code } from '@/lib/types';
import Link from 'next/link';
import { ToolCard } from '@/components/ui/ToolCard';
import { Calculator, List, Database, Gift, Users, ExternalLink } from 'lucide-react';

interface HomeClientProps {
    activeCodes: Code[];
}

export default function HomeClient({ activeCodes }: HomeClientProps) {
    const displayCodes = activeCodes.slice(0, 3); // Show top 3 codes

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <section className="relative text-center mb-24 max-w-4xl mx-auto">
                <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                    The Ultimate Companion
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 text-glow">
                    MASTERY AWAITS
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
                <div className="group relative flex flex-col justify-center items-center overflow-hidden rounded-xl border border-dashed border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
                    <Users className="h-8 w-8 text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
                    <h3 className="text-lg font-bold text-muted-foreground group-hover:text-foreground">More Coming Soon</h3>
                    <p className="text-xs text-muted-foreground mt-2">Community Features</p>
                </div>
            </section>

            {/* Live Data Sections */}
            <div className="grid lg:grid-cols-2 gap-12">
                {/* Latest Codes Preview */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Gift className="text-primary" /> Latest Codes
                        </h2>
                        <Link href="/codes" className="text-sm text-primary hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {displayCodes.map((code) => (
                            <div key={code.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg hover:border-primary/50 transition-colors">
                                <div>
                                    <div className="font-mono font-bold text-lg text-primary">{code.code}</div>
                                    <div className="text-xs text-muted-foreground flex gap-2 mt-1">
                                        {code.rewards.slice(0, 2).map((r, i) => (
                                            <span key={i} className="bg-white/5 px-2 py-0.5 rounded">{r.quantity}x {r.itemType}</span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(code.code);
                                    }}
                                    className="px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 rounded transition-colors"
                                >
                                    Copy
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

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
        </div>
    );
}
