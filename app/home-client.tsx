'use client';

import { Code } from '@/lib/types';
import Link from 'next/link';
import { DPSBarChart, DPSPieChart } from '@/components/calculator/DPSCharts';

interface HomeClientProps {
    activeCodes: Code[];
}

export default function HomeClient({ activeCodes }: HomeClientProps) {
    const displayCodes = activeCodes.slice(0, 5); // Show first 5 codes

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section with DPS Calculator */}
            <section className="text-center py-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Anime Last Stand Team Optimizer & Active Codes
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                    Build the perfect team in Anime Last Stand with our advanced{' '}
                    <strong>DPS calculator</strong>. Get the latest{' '}
                    <strong>active codes</strong> and <strong>tier lists</strong> to
                    dominate every stage.
                </p>

                {/* DPS Calculator Tool */}
                <div className="bg-card border rounded-lg p-8 max-w-6xl mx-auto mb-12">
                    <h2 className="text-2xl font-bold mb-4">🎮 Team DPS Calculator</h2>
                    <p className="text-muted-foreground mb-6">
                        Build the optimal team based on your units and get personalized upgrade recommendations
                    </p>
                    <div className="text-center">
                        <Link
                            href="/calculator"
                            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 text-lg"
                        >
                            Open Team Calculator →
                        </Link>
                        <p className="text-sm text-muted-foreground mt-4">
                            Select your units, set their levels, and get AI-powered team recommendations
                        </p>
                    </div>
                </div>
            </section>

            {/* Active Codes Section */}
            <section className="py-8">
                <h2 className="text-3xl font-bold mb-6">🎁 Active Codes (December 2025)</h2>

                {displayCodes.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {displayCodes.map((code) => (
                            <div
                                key={code.id}
                                className="border rounded-lg p-4 bg-green-50 dark:bg-green-950"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-mono font-bold text-lg">{code.code}</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(code.code);
                                            alert('Code copied!');
                                        }}
                                        className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {code.rewards.map((reward, idx) => (
                                        <span key={idx}>
                                            {reward.quantity}x {reward.itemType}
                                            {idx < code.rewards.length - 1 ? ' + ' : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No active codes available at the moment.</p>
                )}

                <div className="mt-6 text-center">
                    <Link
                        href="/codes"
                        className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
                    >
                        View All Codes →
                    </Link>
                </div>
            </section>

            {/* Quick Stats & Features */}
            <section className="py-12 grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-2">200+</div>
                    <div className="text-lg font-semibold">Units Database</div>
                    <p className="text-sm text-muted-foreground mt-2">
                        Complete stats for all units
                    </p>
                </div>
                <div className="text-center p-6 border rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-2">Real-time</div>
                    <div className="text-lg font-semibold">DPS Calculator</div>
                    <p className="text-sm text-muted-foreground mt-2">
                        Optimize your team composition
                    </p>
                </div>
                <div className="text-center p-6 border rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-2">Daily</div>
                    <div className="text-lg font-semibold">Updated Codes</div>
                    <p className="text-sm text-muted-foreground mt-2">
                        Never miss a reward
                    </p>
                </div>
            </section>

            {/* Game Introduction */}
            <section className="py-12 prose dark:prose-invert max-w-none">
                <h2>📖 About Anime Last Stand</h2>
                <p>
                    <strong>Anime Last Stand</strong> is a popular tower defense game on Roblox featuring
                    characters from various anime series. Players must strategically place and upgrade
                    units to defend against waves of enemies across multiple challenging stages.
                </p>
                <p>
                    The game features over <strong>200 unique units</strong> with different rarities,
                    abilities, and elements. Success requires careful team composition, understanding
                    unit synergies, and optimal resource management.
                </p>
            </section>

            {/* FAQ Section */}
            <section className="py-12">
                <h2 className="text-3xl font-bold mb-8">❓ Frequently Asked Questions</h2>

                <div className="space-y-4">
                    <details className="border rounded-lg p-4">
                        <summary className="font-semibold cursor-pointer">
                            How do I use the DPS calculator?
                        </summary>
                        <p className="mt-2 text-muted-foreground">
                            Select the units you own, specify their levels and techniques, then click
                            &quot;Calculate&quot; to see the optimal team composition based on total DPS output.
                        </p>
                    </details>

                    <details className="border rounded-lg p-4">
                        <summary className="font-semibold cursor-pointer">
                            What are the best units in Anime Last Stand?
                        </summary>
                        <p className="mt-2 text-muted-foreground">
                            The best units vary by game mode and stage. Check our{' '}
                            <Link href="/tier-list" className="text-primary hover:underline">
                                Tier List
                            </Link>{' '}
                            for rankings by category, or use our calculator to find the optimal team
                            for your specific units.
                        </p>
                    </details>

                    <details className="border rounded-lg p-4">
                        <summary className="font-semibold cursor-pointer">
                            How do I redeem codes in Anime Last Stand?
                        </summary>
                        <p className="mt-2 text-muted-foreground">
                            Click the &quot;Codes&quot; button in the game lobby, enter the code exactly as shown
                            (case-sensitive), and click &quot;Redeem&quot;. Visit our{' '}
                            <Link href="/codes" className="text-primary hover:underline">
                                Codes page
                            </Link>{' '}
                            for all active codes.
                        </p>
                    </details>

                    <details className="border rounded-lg p-4">
                        <summary className="font-semibold cursor-pointer">
                            How often are codes released?
                        </summary>
                        <p className="mt-2 text-muted-foreground">
                            New codes are typically released during game updates, special events, and
                            when the game reaches follower milestones. We update our codes page daily
                            to ensure you never miss a reward.
                        </p>
                    </details>
                </div>
            </section>
        </div>
    );
}
