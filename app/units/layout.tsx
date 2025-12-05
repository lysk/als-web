import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Anime Last Stand Units Database - Stats & Abilities',
    description: 'Complete database of all Anime Last Stand units with detailed stats, upgrade costs, and abilities. Find the best units for your team.',
    keywords: 'anime last stand units, als units, unit stats, all characters, godly units, best units',
    openGraph: {
        title: 'Anime Last Stand Units Database',
        description: 'All units with stats and abilities',
        type: 'website',
    },
};

export default function UnitsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
