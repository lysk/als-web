'use client';

import { useState } from 'react';
import { Code } from '@/lib/types';

interface CodesClientProps {
    activeCodes: Code[];
    expiredCodes: Code[];
    lastUpdated: string;
}

export default function CodesClient({ activeCodes, expiredCodes, lastUpdated }: CodesClientProps) {
    const [showExpired, setShowExpired] = useState(false);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Anime Last Stand Active Codes
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-semibold">
                        🔥 Last Updated: {lastUpdated}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {activeCodes.length} codes currently active
                    </span>
                </div>
                <p className="text-lg text-muted-foreground">
                    Get free gems, shards, pearls, and more! All codes are tested and working.
                </p>
            </div>

            {/* Active Codes */}
            <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-3xl font-bold">Active Codes List</h2>
                </div>

                {activeCodes.length > 0 ? (
                    <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4 w-1/3">Code</th>
                                        <th className="px-6 py-4">Rewards</th>
                                        <th className="px-6 py-4 w-[100px] text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {activeCodes.map((code) => (
                                        <tr key={code.id} className="group hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-mono font-black text-xl tracking-wider text-primary break-all">
                                                    {code.code}
                                                </div>
                                                <div className="text-xs text-green-600 dark:text-green-400 font-bold mt-1.5 flex items-center gap-1.5">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                    </span>
                                                    Active
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {code.rewards.map((reward, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center px-2.5 py-1 rounded-md bg-background border border-border/50 shadow-sm text-sm font-medium"
                                                        >
                                                            <span className="text-primary mr-1.5 font-bold">{reward.quantity}x</span>
                                                            <span className="text-foreground/80">{reward.itemType}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => copyToClipboard(code.code)}
                                                    className={`h-10 px-6 rounded-lg font-bold text-sm transition-all duration-200 shadow-sm hover:shadow-md ${copiedCode === code.code
                                                        ? 'bg-green-600 text-white scale-105'
                                                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                                        }`}
                                                >
                                                    {copiedCode === code.code ? 'COPIED!' : 'COPY'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 border rounded-xl bg-muted/30 border-dashed">
                        <p className="text-lg text-muted-foreground">
                            No active codes available at the moment. Check back soon!
                        </p>
                    </div>
                )}
            </section>

            {/* Expired Codes */}
            <section className="mb-12">
                <div className="border rounded-xl bg-card overflow-hidden">
                    <button
                        onClick={() => setShowExpired(!showExpired)}
                        className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors text-left"
                    >
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-muted-foreground">Expired Codes</h2>
                            <span className="px-2.5 py-0.5 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                                {expiredCodes.length}
                            </span>
                        </div>
                        <span className={`text-muted-foreground transition-transform duration-200 ${showExpired ? 'rotate-180' : ''}`}>
                            ▼
                        </span>
                    </button>

                    {showExpired && (
                        <div className="border-t bg-muted/10">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-3 w-1/3">Code</th>
                                            <th className="px-6 py-3">Rewards</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {expiredCodes.slice(0, 30).map((code) => (
                                            <tr key={code.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-6 py-3 font-mono text-muted-foreground line-through decoration-muted-foreground/50">
                                                    {code.code}
                                                </td>
                                                <td className="px-6 py-3 text-muted-foreground/80">
                                                    {code.rewards.map(r => `${r.quantity}x ${r.itemType}`).join(', ')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {expiredCodes.length > 30 && (
                                <div className="p-4 text-center text-xs text-muted-foreground bg-muted/20 border-t">
                                    Showing recent 30 expired codes
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* How to Redeem Codes */}
            <section className="mb-12 max-w-none" id="how-to-redeem">
                <div className="bg-card border rounded-xl p-8 shadow-sm">
                    <h2 className="text-3xl font-bold mb-6">📝 How to Redeem Anime Last Stand Codes</h2>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <p className="mb-4 text-muted-foreground">Follow these simple steps to claim your rewards instantly:</p>
                            <ol className="space-y-4">
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">1</span>
                                    <div>
                                        <strong className="block text-foreground">Launch the Game</strong>
                                        <span className="text-sm text-muted-foreground">Open Anime Last Stand on Roblox.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">2</span>
                                    <div>
                                        <strong className="block text-foreground">Open Codes Menu</strong>
                                        <span className="text-sm text-muted-foreground">Click the "Codes" button (bird icon) on the left side of the screen.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">3</span>
                                    <div>
                                        <strong className="block text-foreground">Enter Code</strong>
                                        <span className="text-sm text-muted-foreground">Copy a valid code from our list and paste it into the box.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">4</span>
                                    <div>
                                        <strong className="block text-foreground">Redeem</strong>
                                        <span className="text-sm text-muted-foreground">Click "Redeem" to get your Gems and other rewards!</span>
                                    </div>
                                </li>
                            </ol>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-6 border border-dashed flex items-center justify-center text-center">
                            <div className="space-y-2">
                                <div className="text-4xl">💡</div>
                                <h4 className="font-bold">Pro Tip</h4>
                                <p className="text-sm text-muted-foreground">
                                    Codes are case-sensitive. Always copy and paste directly from our list to avoid typos!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section>
                <h2 className="text-3xl font-bold mb-6">❓ Frequently Asked Questions</h2>

                <div className="space-y-4">
                    <details className="border rounded-lg p-4 bg-card">
                        <summary className="font-semibold cursor-pointer text-lg">
                            Where can I find new Anime Last Stand codes?
                        </summary>
                        <p className="mt-3 text-muted-foreground">
                            New codes are typically announced on the game's official social media
                            channels (Twitter, Discord, YouTube) and during game updates. We monitor
                            all these sources and update this page daily, so bookmark this page to
                            never miss a code!
                        </p>
                    </details>

                    <details className="border rounded-lg p-4 bg-card">
                        <summary className="font-semibold cursor-pointer text-lg">
                            How often are new codes released?
                        </summary>
                        <p className="mt-3 text-muted-foreground">
                            The developers release new codes during major game updates (usually every
                            1-2 weeks), special events, holidays, and when the game reaches follower
                            milestones on social media. Creator codes are also released occasionally
                            by partnered YouTubers.
                        </p>
                    </details>

                    <details className="border rounded-lg p-4 bg-card">
                        <summary className="font-semibold cursor-pointer text-lg">
                            Do codes expire in Anime Last Stand?
                        </summary>
                        <p className="mt-3 text-muted-foreground">
                            Yes, most codes expire after a certain period or when a new update is
                            released. Event codes typically expire when the event ends. That's why
                            it's important to redeem codes as soon as you see them. We mark expired
                            codes on this page so you always know which ones still work.
                        </p>
                    </details>

                    <details className="border rounded-lg p-4 bg-card">
                        <summary className="font-semibold cursor-pointer text-lg">
                            Why isn't my code working?
                        </summary>
                        <p className="mt-3 text-muted-foreground">
                            If a code isn't working, check these common issues:
                        </p>
                        <ul className="mt-2 ml-6 space-y-1 text-muted-foreground">
                            <li>Make sure you're copying the code exactly (they're case-sensitive)</li>
                            <li>The code may have expired - check our Active Codes section</li>
                            <li>You may have already redeemed this code (each code works only once per account)</li>
                            <li>Ensure you're in the game lobby, not in a match</li>
                        </ul>
                    </details>

                    <details className="border rounded-lg p-4 bg-card">
                        <summary className="font-semibold cursor-pointer text-lg">
                            What rewards can I get from codes?
                        </summary>
                        <p className="mt-3 text-muted-foreground">
                            Anime Last Stand codes typically reward you with:
                        </p>
                        <ul className="mt-2 ml-6 space-y-1 text-muted-foreground">
                            <li><strong>Technique Shards</strong> - Used to roll for unit techniques</li>
                            <li><strong>Pearls</strong> - Premium currency for summoning</li>
                            <li><strong>Reroll Locks</strong> - Lock traits when rerolling</li>
                            <li><strong>Gems</strong> - In-game currency</li>
                            <li><strong>Spirit Shards</strong> - Special upgrade materials</li>
                        </ul>
                    </details>
                </div>
            </section>

            {/* CTA */}
            <div className="mt-12 text-center p-8 bg-primary/10 rounded-lg border-2 border-primary">
                <h3 className="text-2xl font-bold mb-2">Want More Free Rewards?</h3>
                <p className="text-muted-foreground mb-4">
                    Check out our team optimizer to maximize your DPS and dominate every stage!
                </p>
                <a
                    href="/"
                    className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
                >
                    Try DPS Calculator →
                </a>
            </div>

            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "Where can I find new Anime Last Stand codes?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "New codes are typically announced on the game's official social media channels (Twitter, Discord, YouTube) and during game updates. We monitor all these sources and update this page daily."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How often are new codes released?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "The developers release new codes during major game updates (usually every 1-2 weeks), special events, holidays, and when the game reaches follower milestones on social media."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Do codes expire in Anime Last Stand?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes, most codes expire after a certain period or when a new update is released. Event codes typically expire when the event ends."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Why isn't my code working?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "If a code isn't working, ensure you are copying it exactly (case-sensitive), check if it has expired in our expired codes list, or verify you haven't already redeemed it."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What rewards can I get from codes?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Codes typically reward players with Technique Shards, Pearls, Reroll Locks, Gems, and Spirit Shards which are essential for summoning and upgrading units."
                                }
                            }
                        ]
                    })
                }}
            />
        </div>
    );
}
