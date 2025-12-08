import { getCodes } from '@/lib/services/code-service';
import CodesClient from './codes-client';
import { Metadata } from 'next';

export const revalidate = 60; // Revalidate every minute to ensure fresh codes

export async function generateMetadata(): Promise<Metadata> {
    const date = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const dateString = `${date.getDate()} ${month} ${year}`;

    return {
        title: `[LATEST] Anime Last Stand Codes ${month} ${year} - Active Redeem Codes`,
        description: `Get the latest working Anime Last Stand codes for ${month} ${year}. Redeem now for free Emeralds, Rerolls, and other exclusive rewards. Updated daily!`,
        keywords: [`Anime Last Stand Codes`, `ALS Codes`, `Anime Last Stand Redeem Codes`, `Anime Last Stand working codes`, `Anime Last Stand codes ${month} ${year}`],
        openGraph: {
            title: `[LATEST] Anime Last Stand Codes ${month} ${year} - Active Redeem Codes`,
            description: `Get the latest working Anime Last Stand codes for ${month} ${year}. Redeem now for free Emeralds, Rerolls, and other exclusive rewards. Updated daily!`,
            type: 'article',
            publishedTime: date.toISOString(),
            modifiedTime: date.toISOString(),
        }
    };
}

export default async function CodesPage() {
    const allCodes = await getCodes();

    const activeCodes = allCodes.filter(code => code.status === 'Active');
    const expiredCodes = allCodes.filter(code => code.status === 'Expired');

    const date = new Date();
    const lastUpdated = `${date.getDate()} ${date.toLocaleString('en-US', { month: 'long' })} ${date.getFullYear()}`;

    return <CodesClient activeCodes={activeCodes} expiredCodes={expiredCodes} lastUpdated={lastUpdated} />;
}
