'use client';

import { useState, useMemo } from 'react';
import { Unit } from '@/lib/types';
import { Search, Filter, Shield, Zap, DollarSign, BarChart3, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

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

    // Get rarity style
    const getRarityStyle = (rarity: string) => {
        const styles: Record<string, string> = {
            'Godly': 'border-purple-500/50 shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_-3px_rgba(168,85,247,0.5)]',
            'Extreme Boosted': 'border-pink-500/50 shadow-[0_0_15px_-3px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_-3px_rgba(236,72,153,0.5)]',
            'Ultimate': 'border-red-500/50 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_-3px_rgba(239,68,68,0.5)]',
            'Exotic': 'border-orange-500/50 shadow-[0_0_15px_-3px_rgba(249,115,22,0.3)] hover:shadow-[0_0_20px_-3px_rgba(249,115,22,0.5)]',
            'Celestial': 'border-yellow-500/50 shadow-[0_0_15px_-3px_rgba(234,179,8,0.3)] hover:shadow-[0_0_20px_-3px_rgba(234,179,8,0.5)]',
            'Mythic': 'border-indigo-500/50',
            'Legendary': 'border-amber-500/30',
            'Epic': 'border-violet-500/30',
            'Rare': 'border-blue-500/30',
        };
        return styles[rarity] || 'border-white/10';
    };

    const getRarityBadgeColor = (rarity: string) => {
        const colors: Record<string, string> = {
            'Godly': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
            'Extreme Boosted': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
            'Ultimate': 'bg-red-500/20 text-red-300 border-red-500/30',
            'Exotic': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
            'Celestial': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
            'Mythic': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
            'Legendary': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
            'Epic': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
            'Rare': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        };
        return colors[rarity] || 'bg-white/10 text-muted-foreground border-white/10';
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="relative mb-12 p-8 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-r from-primary/10 via-background to-background">
                <div className="relative z-10">
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                        Database
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-glow">
                        Unit Database
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Explore complete stats, upgrade costs, and abilities for all {units.length} units in Anime Last Stand.
                    </p>
                </div>
                {/* Decorative background element */}
                <div className="absolute right-0 top-0 h-full w-1/3 bg-primary/5 blur-3xl rounded-full translate-x-1/2" />
            </div>

            {/* Filters Area */}
            <div className="sticky top-20 z-40 mb-8 p-4 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-lg">
                <div className="grid gap-4 md:grid-cols-12 items-center">
                    {/* Search */}
                    <div className="md:col-span-6 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search units by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>

                    {/* Filters */}
                    <div className="md:col-span-3">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <select
                                value={selectedRarity}
                                onChange={(e) => setSelectedRarity(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                            >
                                <option value="all">All Rarities</option>
                                {rarities.map(rarity => (
                                    <option key={rarity} value={rarity}>{rarity}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <div className="relative">
                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <select
                                value={selectedElement}
                                onChange={(e) => setSelectedElement(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                            >
                                <option value="all">All Elements</option>
                                {elements.map(element => (
                                    <option key={element} value={element}>{element}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mt-3 px-1 text-xs text-muted-foreground font-medium flex items-center justify-between">
                    <span>Found {filteredUnits.length} units</span>
                    {(searchQuery || selectedRarity !== 'all' || selectedElement !== 'all') && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedRarity('all');
                                setSelectedElement('all');
                            }}
                            className="text-primary hover:underline transition-all"
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Units Grid */}
            {filteredUnits.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredUnits.map((unit) => (
                        <div
                            key={unit.id}
                            className={cn(
                                "group glass-card rounded-xl p-0 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1",
                                getRarityStyle(unit.rarity)
                            )}
                        >
                            {/* Card Header with Image */}
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40 border-b border-white/5 group-hover:border-primary/20 transition-colors">
                                {unit.imageUrl ? (
                                    <>
                                        {/* Blurred Background Layer for "Fill" effect */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center opacity-30 blur-xl scale-125"
                                            style={{ backgroundImage: `url(${unit.imageUrl})` }}
                                        />

                                        {/* Main Image Layer - Contained to show full unit */}
                                        <div className="absolute inset-0 z-10 p-2 flex items-center justify-center">
                                            <img
                                                src={unit.imageUrl}
                                                alt={unit.name}
                                                className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Gradient Overlay for Text Readability */}
                                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-white/5 z-0">
                                        <Zap className="h-12 w-12 mb-2 opacity-20" />
                                        <span className="text-xs uppercase tracking-widest opacity-50">No Image</span>
                                    </div>
                                )}

                                {/* Overlay Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
                                    <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-primary transition-colors text-shadow-sm">
                                        {unit.name}
                                    </h3>

                                    <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
                                        <span className={cn("px-2 py-0.5 rounded backdrop-blur-md shadow-sm border", getRarityBadgeColor(unit.rarity))}>
                                            {unit.rarity}
                                        </span>
                                        <span className="px-2 py-0.5 bg-black/50 text-white/90 rounded backdrop-blur-md border border-white/10">
                                            {unit.element}
                                        </span>
                                    </div>
                                </div>

                                {/* Top Rarity Indicator line */}
                                <div className={cn("absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity",
                                    unit.rarity === 'Godly' ? 'via-purple-500' :
                                        unit.rarity === 'Ultimate' ? 'via-red-500' : 'via-primary')}
                                />
                            </div>

                            {/* Card Body */}
                            <div className="p-4 space-y-3">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="bg-white/5 p-2 rounded border border-white/5">
                                        <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" /> DEPLOY
                                        </div>
                                        <div className="font-mono font-semibold text-xs">${unit.deploymentCost.toLocaleString('en-US')}</div>
                                    </div>
                                    <div className="bg-white/5 p-2 rounded border border-white/5">
                                        <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
                                            <BarChart3 className="h-3 w-3" /> UPGRADES
                                        </div>
                                        <div className="font-mono font-semibold text-xs">{unit.upgrades.length} Levels</div>
                                    </div>
                                </div>

                                {/* Max Stats Preview */}
                                {unit.upgrades.length > 0 && (
                                    <div className="bg-primary/5 rounded border border-primary/10 p-2">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-muted-foreground font-medium text-[10px] uppercase">Max Potential</span>
                                            <span className="font-bold text-primary font-mono">
                                                {Math.round(unit.upgrades[unit.upgrades.length - 1].dps).toLocaleString('en-US')} DPS
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                            <div className="flex justify-between text-[10px]">
                                                <span className="text-muted-foreground">DMG</span>
                                                <span className="font-mono">{unit.upgrades[unit.upgrades.length - 1].damage.toLocaleString('en-US')}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px]">
                                                <span className="text-muted-foreground">SPA</span>
                                                <span className="font-mono">{unit.upgrades[unit.upgrades.length - 1].spa}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card Footer */}
                            <div className="px-4 py-2 border-t border-white/5 bg-white/5 flex items-center justify-between text-[10px]">
                                <span className="text-muted-foreground">Total: ${unit.totalCost.toLocaleString('en-US')}</span>
                                <a
                                    href={unit.wikiUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-primary hover:text-primary-foreground transition-colors font-medium group/link"
                                >
                                    Wiki <ExternalLink className="h-2.5 w-2.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 glass-card rounded-2xl">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 mb-6">
                        <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No units found</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                        We couldn't find any units matching your search filters. Try adjusting your criteria.
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedRarity('all');
                            setSelectedElement('all');
                        }}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}


            {/* SEO Content Footer */}
            <section className="mt-24 px-4 py-12 border-t border-white/10 text-muted-foreground">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Master Every Unit</h2>
                        <p>Understanding unit mechanics is crucial for building the best team in Anime Last Stand.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" /> Rarity Tiers
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-purple-500" /> <strong>Godly</strong> - The rarest and most powerful units</li>
                                <li className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-red-500" /> <strong>Ultimate</strong> - Very rare and exceptionally strong</li>
                                <li className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-yellow-500" /> <strong>Celestial</strong> - High-tier core team units</li>
                                <li className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-indigo-500" /> <strong>Mythic</strong> - Essential mid-to-high tier units</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-primary" /> Database Features
                            </h3>
                            <p className="text-sm leading-relaxed mb-4">
                                Our database provides real-time data on every unit in the game. Use the filters above to sort by:
                            </p>
                            <ul className="grid grid-cols-2 gap-2 text-sm">
                                <li className="px-3 py-2 bg-white/5 rounded border border-white/5">Deployment Cost</li>
                                <li className="px-3 py-2 bg-white/5 rounded border border-white/5">Total Upgrade Cost</li>
                                <li className="px-3 py-2 bg-white/5 rounded border border-white/5">Max Level DPS</li>
                                <li className="px-3 py-2 bg-white/5 rounded border border-white/5">Attack Range & Speed</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div >
    );
}
