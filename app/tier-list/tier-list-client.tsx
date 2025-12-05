'use client';

import { useState } from 'react';
import { Unit } from '@/lib/types';

interface TierListClientProps {
    initialUnits: Unit[];
}

export default function TierListClient({ initialUnits }: TierListClientProps) {
    const units = initialUnits;

    const [selectedCategory, setSelectedCategory] = useState('overall');

    // Create tier list based on max DPS
    const createTierList = () => {
        const sortedUnits = [...units]
            .filter(u => u.upgrades.length > 0)
            .sort((a, b) => {
                const aDps = a.upgrades[a.upgrades.length - 1]?.dps || 0;
                const bDps = b.upgrades[b.upgrades.length - 1]?.dps || 0;
                return bDps - aDps;
            });

        const totalUnits = sortedUnits.length;
        const tierSizes = {
            'S+': Math.ceil(totalUnits * 0.05), // Top 5%
            'S': Math.ceil(totalUnits * 0.10), // Next 10%
            'A': Math.ceil(totalUnits * 0.20), // Next 20%
            'B': Math.ceil(totalUnits * 0.25), // Next 25%
            'C': Math.ceil(totalUnits * 0.40), // Remaining 40%
        };

        let currentIndex = 0;
        const tiers: Record<string, Unit[]> = {};

        for (const [tier, size] of Object.entries(tierSizes)) {
            tiers[tier] = sortedUnits.slice(currentIndex, currentIndex + size);
            currentIndex += size;
        }

        return tiers;
    };

    const tierList = createTierList();

    const getTierColor = (tier: string) => {
        const colors: Record<string, string> = {
            'S+': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
            'S': 'bg-gradient-to-r from-red-500 to-orange-500 text-white',
            'A': 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white',
            'B': 'bg-gradient-to-r from-green-500 to-teal-500 text-white',
            'C': 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
        };
        return colors[tier] || 'bg-gray-500 text-white';
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Anime Last Stand Tier List - Complete Unit Rankings
                </h1>
                <p className="text-lg text-muted-foreground">
                    Units ranked by maximum DPS output. S+ tier represents the strongest units in the game.
                </p>

            </div>

            {/* Category Tabs */}
            <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
                {['overall', 'godly', 'ultimate', 'mythic'].map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                            }`}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>

            {/* Tier List */}
            <div className="space-y-4">
                {Object.entries(tierList).map(([tier, tierUnits]) => (
                    <div key={tier} className="border rounded-lg overflow-hidden">
                        {/* Tier Header */}
                        <div className={`px-6 py-4 font-bold text-2xl ${getTierColor(tier)}`}>
                            {tier} Tier
                            <span className="ml-3 text-sm opacity-90">
                                ({tierUnits.length} units)
                            </span>
                        </div>

                        {/* Tier Units */}
                        <div className="p-4 bg-card">
                            {tierUnits.length > 0 ? (
                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {tierUnits.map(unit => (
                                        <div
                                            key={unit.id}
                                            className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-background"
                                        >
                                            <div className="font-semibold mb-1">{unit.name}</div>
                                            <div className="flex flex-wrap gap-1 text-xs mb-2">
                                                <span className="px-2 py-0.5 bg-muted rounded">
                                                    {unit.rarity}
                                                </span>
                                                <span className="px-2 py-0.5 bg-muted rounded">
                                                    {unit.element}
                                                </span>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Max DPS:{' '}
                                                <span className="font-bold text-foreground">
                                                    {Math.round(unit.upgrades[unit.upgrades.length - 1]?.dps || 0).toLocaleString('en-US')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-4">
                                    No units in this tier
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* SEO Content */}
            <section className="mt-12 prose dark:prose-invert max-w-none">
                <h2>About This Tier List</h2>
                <p>
                    This tier list ranks all Anime Last Stand units based on their maximum DPS
                    (Damage Per Second) output at max level. The rankings help you identify the
                    strongest units for your team composition.
                </p>

                <h3>Tier Explanations</h3>
                <ul>
                    <li>
                        <strong>S+ Tier</strong> - The absolute best units in the game. Top 5% by DPS.
                        These units should be prioritized for upgrades if you have them.
                    </li>
                    <li>
                        <strong>S Tier</strong> - Excellent units that perform very well. Top 15% overall.
                        Great additions to any team.
                    </li>
                    <li>
                        <strong>A Tier</strong> - Strong units that are viable for most content.
                        Solid choices for your main team.
                    </li>
                    <li>
                        <strong>B Tier</strong> - Decent units that can work with proper support.
                        Good for early-mid game or specific strategies.
                    </li>
                    <li>
                        <strong>C Tier</strong> - Below average units. Better options usually available.
                        Can still be used early game or for fun.
                    </li>
                </ul>

                <h3>How to Use This Tier List</h3>
                <p>
                    While DPS is important, remember that team composition matters more than individual
                    unit strength. Consider factors like:
                </p>
                <ul>
                    <li>Unit cost vs. DPS efficiency</li>
                    <li>Range and area coverage</li>
                    <li>Element advantages for specific stages</li>
                    <li>Special abilities and crowd control</li>
                </ul>
                <p>
                    Use our <a href="/" className="text-primary hover:underline">DPS Calculator</a> to
                    find the optimal team for your specific units and upgrade levels.
                </p>

                <h3>Frequently Asked Questions</h3>

                <h4>Is this tier list updated regularly?</h4>
                <p>
                    Yes! We update this tier list whenever new units are released or balance changes
                    occur. The rankings are based on data from the official wiki and community testing.
                </p>

                <h4>Should I only use S+ tier units?</h4>
                <p>
                    Not necessarily! Team synergy and cost efficiency matter a lot. Sometimes a well-upgraded
                    A-tier unit can outperform an under-leveled S+ unit. Focus on units you actually own
                    and can afford to upgrade.
                </p>

                <h4>How does rarity affect tier placement?</h4>
                <p>
                    While higher rarity units (Godly, Ultimate) tend to rank higher, some Mythic and
                    Legendary units can compete in A-tier or even S-tier due to excellent stats or
                    special abilities. Rarity isn&apos;t everything!
                </p>
            </section>

            {/* CTA */}
            <div className="mt-12 text-center p-8 bg-primary/10 rounded-lg border-2 border-primary">
                <h3 className="text-2xl font-bold mb-2">Ready to Build Your Best Team?</h3>
                <p className="text-muted-foreground mb-4">
                    Use our calculator to optimize your lineup based on the units you actually own
                </p>
                <a
                    href="/"
                    className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
                >
                    Try Team Calculator →
                </a>
            </div>
        </div>
    );
}
