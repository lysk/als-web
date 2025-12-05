'use client';

import { useState, useMemo } from 'react';
import { Unit } from '@/lib/types';

interface UnitsClientProps {
    initialUnits: Unit[];
}

export default function UnitsClient({ initialUnits }: UnitsClientProps) {
    const units = initialUnits;


    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRarity, setSelectedRarity] = useState<string>('all');
    const [selectedElement, setSelectedElement] = useState<string>('all');

    // Get unique rarities and elements
    const rarities = useMemo(() => {
        const uniqueRarities = Array.from(new Set(units.map(u => u.rarity)));
        return uniqueRarities.sort();
    }, [units]);

    const elements = useMemo(() => {
        const uniqueElements = Array.from(new Set(units.map(u => u.element)));
        return uniqueElements.sort();
    }, [units]);

    // Filter units
    const filteredUnits = useMemo(() => {
        return units.filter(unit => {
            const matchesSearch = unit.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRarity = selectedRarity === 'all' || unit.rarity === selectedRarity;
            const matchesElement = selectedElement === 'all' || unit.element === selectedElement;

            return matchesSearch && matchesRarity && matchesElement;
        });
    }, [units, searchQuery, selectedRarity, selectedElement]);

    // Get rarity color
    const getRarityColor = (rarity: string) => {
        const colors: Record<string, string> = {
            'Godly': 'border-purple-500 bg-purple-50 dark:bg-purple-950',
            'Extreme Boosted': 'border-pink-500 bg-pink-50 dark:bg-pink-950',
            'Ultimate': 'border-red-500 bg-red-50 dark:bg-red-950',
            'Exotic': 'border-orange-500 bg-orange-50 dark:bg-orange-950',
            'Celestial': 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950',
            'Mythic': 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950',
            'Legendary': 'border-amber-500 bg-amber-50 dark:bg-amber-950',
            'Epic': 'border-violet-500 bg-violet-50 dark:bg-violet-950',
            'Rare': 'border-blue-500 bg-blue-50 dark:bg-blue-950',
        };
        return colors[rarity] || 'border-gray-500 bg-gray-50 dark:bg-gray-950';
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    All Anime Last Stand Units
                </h1>
                <p className="text-lg text-muted-foreground">
                    Complete database of {units.length} units with stats, upgrade costs, and abilities
                </p>
            </div>

            {/* Filters */}
            <div className="mb-8 space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Search Units</label>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Rarity Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Rarity</label>
                        <select
                            value={selectedRarity}
                            onChange={(e) => setSelectedRarity(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Rarities</option>
                            {rarities.map(rarity => (
                                <option key={rarity} value={rarity}>{rarity}</option>
                            ))}
                        </select>
                    </div>

                    {/* Element Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Element</label>
                        <select
                            value={selectedElement}
                            onChange={(e) => setSelectedElement(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Elements</option>
                            {elements.map(element => (
                                <option key={element} value={element}>{element}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="text-sm text-muted-foreground">
                    Showing {filteredUnits.length} of {units.length} units
                </div>
            </div>

            {/* Units Grid */}
            {filteredUnits.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredUnits.map((unit) => (
                        <div
                            key={unit.id}
                            className={`border-2 rounded-lg p-5 hover:shadow-lg transition-shadow ${getRarityColor(unit.rarity)}`}
                        >
                            {/* Unit Header */}
                            <div className="mb-4">
                                <h3 className="text-xl font-bold mb-1">{unit.name}</h3>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded border">
                                        {unit.rarity}
                                    </span>
                                    <span className="px-2 py-1 bg-white dark:bg-gray-800 rounded border">
                                        {unit.element}
                                    </span>
                                    {unit.isEvolved && (
                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded border border-green-500">
                                            Evolved
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Base Stats */}
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Deployment Cost:</span>
                                    <span className="font-semibold">$ {unit.deploymentCost.toLocaleString('en-US')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Cost:</span>
                                    <span className="font-semibold">$ {unit.totalCost.toLocaleString('en-US')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Max Upgrade:</span>
                                    <span className="font-semibold">Level {unit.upgrades.length}</span>
                                </div>
                            </div>

                            {/* Max Level Stats */}
                            {unit.upgrades.length > 0 && (
                                <div className="pt-4 border-t">
                                    <div className="text-xs font-semibold mb-2 text-muted-foreground">
                                        MAX LEVEL STATS
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <div className="text-xs text-muted-foreground">Damage</div>
                                            <div className="font-bold">{unit.upgrades[unit.upgrades.length - 1].damage.toLocaleString('en-US')}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">DPS</div>
                                            <div className="font-bold">{Math.round(unit.upgrades[unit.upgrades.length - 1].dps).toLocaleString('en-US')}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">Range</div>
                                            <div className="font-bold">{unit.upgrades[unit.upgrades.length - 1].range}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">SPA</div>
                                            <div className="font-bold">{unit.upgrades[unit.upgrades.length - 1].spa}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* View Details Link */}
                            <div className="mt-4 pt-4 border-t">
                                <a
                                    href={unit.wikiUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline"
                                >
                                    View on Wiki →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/50">
                    <p className="text-lg text-muted-foreground">
                        No units found matching your filters.
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedRarity('all');
                            setSelectedElement('all');
                        }}
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* SEO Content */}
            <section className="mt-12 prose dark:prose-invert max-w-none">
                <h2>About Units in Anime Last Stand</h2>
                <p>
                    Units are the core of your defense in Anime Last Stand. Each unit has
                    unique stats, abilities, and upgrade paths that determine their effectiveness
                    in battle. Understanding unit mechanics is crucial for building the best team.
                </p>

                <h3>Unit Rarities</h3>
                <p>
                    Units come in different rarities, from Rare to Godly. Higher rarity units
                    generally have better stats and more powerful abilities, but deployment and
                    upgrade costs also increase. The rarity tiers are:
                </p>
                <ul>
                    <li><strong>Godly</strong> - The rarest and most powerful units</li>
                    <li><strong>Extreme Boosted</strong> - Limited-time boosted units</li>
                    <li><strong>Ultimate</strong> - Very rare and strong</li>
                    <li><strong>Exotic</strong> - Special units with unique abilities</li>
                    <li><strong>Celestial</strong> - High-tier units</li>
                    <li><strong>Mythic</strong> - Mid-to-high tier units</li>
                    <li><strong>Legendary</strong> - Mid-tier units</li>
                    <li><strong>Epic</strong> - Common mid-tier units</li>
                    <li><strong>Rare</strong> - Entry-level units</li>
                </ul>

                <h3>How to Use This Database</h3>
                <p>
                    Use the filters above to find units by rarity, element, or search by name.
                    Each unit card shows key stats including deployment cost, total upgrade cost,
                    and maximum level stats. Click through to the Wiki for detailed upgrade paths
                    and ability descriptions.
                </p>
            </section>
        </div>
    );
}
