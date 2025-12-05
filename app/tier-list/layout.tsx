import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Anime Last Stand Tier List - Best Units Ranked [2025]',
    description: 'Complete tier list ranking the best units in Anime Last Stand. Find S-tier, A-tier units and optimize your team composition.',
    keywords: 'anime last stand tier list, best units, S tier, godly tier list, unit rankings',
    openGraph: {
        title: 'Anime Last Stand Tier List 2025',
        description: 'Best units ranked by tier',
        type: 'article',
    },
};

export default function TierListLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
