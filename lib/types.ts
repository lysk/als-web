// Type definitions from scraper project
export interface UnitUpgrade {
    level: number;
    upgradeCost: number;
    damage: number;
    range: number;
    spa: number;
    dps: number;
}

export interface Unit {
    id: string;
    name: string;
    wikiUrl: string;
    scrapedAt: string;
    rarity: string;
    element: string;
    type: string;
    deploymentCost: number;
    totalCost: number;
    canEvolve: boolean;
    isEvolved: boolean;
    upgrades: UnitUpgrade[];
}

export interface Technique {
    id: string;
    name: string;
    tier: number;
    rarity: string;
    probability: number;
    effects: {
        damageMultiplier?: number;
        rangeMultiplier?: number;
        spaMultiplier?: number;
        moneyMultiplier?: number;
        critChanceBonus?: number;
        critDamageMultiplier?: number;
    };
    description: string;
}

export interface CodeReward {
    itemType: string;
    quantity: number;
}

export interface Code {
    id: string;
    code: string;
    name: string;
    scrapedAt: string;
    status: 'Active' | 'Expired';
    rewards: CodeReward[];
    source?: {
        type: string;
        creator?: string;
        url?: string;
    };
    description?: string;
}

export interface Item {
    id: string;
    name: string;
    category: string;
    description: string;
    imageUrl?: string;
    wikiUrl?: string;
    obtainMethod?: string;
    scrapedAt?: string;
}

export interface TierListEntry {
    id: number;
    unitName: string;
    category: string;
    tier: string;
    subcategory?: string;
    notes?: string;
}
