import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Anime Last Stand Codes - Active & Expired [Updated Dec 2025]',
    description: 'Get the latest Anime Last Stand codes for free gems, shards, and pearls. Updated daily with working codes.',
    keywords: 'anime last stand codes, als codes, active codes, free gems, roblox codes, working codes december 2025',
    openGraph: {
        title: 'Anime Last Stand Active Codes - December 2025',
        description: 'Latest working codes for free rewards. Updated daily!',
        type: 'article',
    },
    alternates: {
        canonical: 'https://als-tools.com/codes'
    }
};

export default function CodesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
