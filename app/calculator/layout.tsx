import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Team DPS Calculator - Anime Last Stand Optimizer',
    description: 'Optimize your Anime Last Stand team with our advanced DPS calculator. Get personalized team recommendations and upgrade suggestions.',
    keywords: 'anime last stand calculator, team optimizer, dps calculator, best team builder',
};

export default function CalculatorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
