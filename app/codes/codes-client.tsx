'use client';

import { useState } from 'react';
import { Code } from '@/lib/types';

interface CodesClientProps {
    activeCodes: Code[];
    expiredCodes: Code[];
}

export default function CodesClient({ activeCodes, expiredCodes }: CodesClientProps) {
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
                    Anime Last Stand Active Codes (December 2025)
                </h1>
                <p className="text-lg text-muted-foreground">
                    Get free gems, shards, pearls, and more! All codes are tested and working.
                </p>

            </div>

            {/* Active Codes */}
            <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-3xl font-bold">Active Codes</h2>
                    <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-sm font-bold border border-green-500/20">
                        {activeCodes.length} Available
                    </span>
                </div>

                {activeCodes.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {activeCodes.map((code) => (
                            <div
                                key={code.id}
                                className="group relative border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                            >
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="p-5 relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                                                Code
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-mono font-black text-2xl tracking-tight text-primary">
                                                    {code.code}
                                                </h3>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(code.code)}
                                            className={`h-9 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${copiedCode === code.code
                                                ? 'bg-green-500 text-white shadow-green-500/20 shadow-lg'
                                                : 'bg-secondary hover:bg-primary hover:text-primary-foreground'
                                                }`}
                                        >
                                            {copiedCode === code.code ? (
                                                <>✓ Copied</>
                                            ) : (
                                                <>Copy</>
                                            )}
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                            Rewards
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {code.rewards.map((reward, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-background border shadow-sm text-sm font-medium"
                                                >
                                                    <span className="text-primary mr-1.5 font-bold">{reward.quantity}x</span>
                                                    <span className="text-foreground/80">{reward.itemType}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
            <section className="mb-12 prose dark:prose-invert max-w-none">
                <h2>📝 How to Redeem Codes in Anime Last Stand</h2>
                <p>Follow these simple steps to redeem your codes:</p>
                <ol>
                    <li>
                        <strong>Launch Anime Last Stand</strong> on Roblox and wait for the game
                        to load completely
                    </li>
                    <li>
                        <strong>Find the Codes button</strong> - Look for the "Codes" icon on the
                        left side of your screen in the lobby
                    </li>
                    <li>
                        <strong>Enter the code</strong> - Copy the code from above and paste it
                        into the text field (codes are case-sensitive!)
                    </li>
                    <li>
                        <strong>Click Redeem</strong> - Hit the redeem button and your rewards
                        will be added to your account instantly
                    </li>
                </ol>
                <p className="bg-yellow-50 dark:bg-yellow-950/40 border-l-4 border-yellow-500 p-4 my-4 text-yellow-800 dark:text-yellow-200 shadow-sm">
                    <strong>⚠️ Important:</strong> Codes are case-sensitive and must be entered
                    exactly as shown. Make sure to copy and paste to avoid typos!
                </p>
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
        </div>
    );
}
