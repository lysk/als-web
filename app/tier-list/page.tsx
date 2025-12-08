import { getUnits } from '@/lib/services/unit-service';
import TierListClient from './tier-list-client';
import { Metadata } from 'next';

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata(): Promise<Metadata> {
    const date = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return {
        title: `[UPDATED] Anime Last Stand Tier List ${month} ${year} - Best Units Ranked`,
        description: `Find the best units in Anime Last Stand with our updated ${month} ${year} Tier List. See who ranks S+ for Story, Infinite, and Raid modes.`,
        keywords: [`ALS Tier List`, `Anime Last Stand Best Units`, `ALS Best Characters`, `Anime Last Stand Tier List S+`, `Anime Last Stand Meta`],
        openGraph: {
            title: `[UPDATED] Anime Last Stand Tier List ${month} ${year} - Best Units Ranked`,
            description: `Find the best units in Anime Last Stand with our updated ${month} ${year} Tier List. See who ranks S+ for Story, Infinite, and Raid modes.`,
            type: 'article',
            publishedTime: date.toISOString(),
            modifiedTime: date.toISOString(),
        }
    };
}

export default async function TierListPage() {
    const units = await getUnits();

    const date = new Date();
    const lastUpdated = `${date.getDate()} ${date.toLocaleString('en-US', { month: 'long' })} ${date.getFullYear()}`;

    return <TierListClient initialUnits={units} lastUpdated={lastUpdated} />;
}
