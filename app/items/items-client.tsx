'use client';

import { useState, useMemo } from 'react';
import { Item } from '@/lib/types';
import { Search, Filter, ExternalLink, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ItemsClientProps {
    initialItems: Item[];
}

export default function ItemsClient({ initialItems }: ItemsClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(initialItems.map(i => i.category || 'Uncategorized')));
        return uniqueCategories.sort();
    }, [initialItems]);

    const filteredItems = useMemo(() => {
        return initialItems.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [initialItems, searchQuery, selectedCategory]);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="relative mb-12 p-8 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-r from-blue-500/10 via-background to-background">
                <div className="relative z-10">
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-500/10 rounded-full border border-blue-500/20">
                        Collection
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-glow">
                        Items & Materials
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Discover items, evolution materials, and techniques.
                    </p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-blue-500/5 blur-3xl rounded-full translate-x-1/2" />
            </div>

            {/* Filters */}
            <div className="sticky top-20 z-40 mb-8 p-4 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-lg">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 items-center">
                    <div className="lg:col-span-6 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                    <div className="lg:col-span-4 relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="lg:col-span-2 text-right text-xs text-muted-foreground">
                        Found {filteredItems.length} items
                    </div>
                </div>
            </div>

            {/* Items Grid */}
            {filteredItems.length > 0 ? (
                <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="group glass-card rounded-xl overflow-hidden hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Item Image */}
                            <div className="aspect-square relative bg-white/5 p-4 flex items-center justify-center border-b border-white/5 group-hover:bg-white/10 transition-colors">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-full h-full object-contain drop-shadow-lg transition-transform group-hover:scale-110"
                                        style={{ imageRendering: 'pixelated' }} // Fix for blurry pixel art
                                        loading="lazy"
                                    />
                                ) : (
                                    <Package className="h-16 w-16 text-muted-foreground/30" />
                                )}
                            </div>

                            {/* Item Info */}
                            <div className="p-4">
                                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">
                                    {item.category}
                                </div>
                                <h3 className="text-sm font-bold text-foreground mb-2 line-clamp-2 min-h-[2.5em]">
                                    {item.name}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                                    {item.description || 'No description available.'}
                                </p>
                                {item.obtainMethod && (
                                    <div className="text-[10px] text-muted-foreground bg-white/5 p-1.5 rounded mb-2">
                                        <span className="font-semibold text-foreground">How to get:</span> {item.obtainMethod}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {item.wikiUrl && (
                                <div className="px-4 py-2 border-t border-white/5 bg-white/5 text-[10px]">
                                    <a
                                        href={item.wikiUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-400 hover:underline"
                                    >
                                        Wiki <ExternalLink className="h-2.5 w-2.5" />
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 glass-card rounded-2xl">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-bold">No items found</h3>
                    <p className="text-muted-foreground">Try adjusting your search filters.</p>
                </div>
            )}
        </div>
    );
}
