'use client';

import { useState } from 'react';
import { Code } from '@/lib/types';
import codesData from '@/lib/data/codes.json';

export default function CodesPage() {
    const { active: activeCodes, expired: expiredCodes } = codesData as {
        active: Code[];
        expired: Code[];
    };

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
                <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-3xl font-bold">✅ Active Codes</h2>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm font-medium">
                        {activeCodes.length} codes
                    </span>
                </div>

                {activeCodes.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {activeCodes.map((code) => (
                            <div
                                key={code.id}
                                className="border-2 border-green-500 rounded-lg p-5 bg-green-50 dark:bg-green-950 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-mono font-bold text-xl text-green-700 dark:text-green-300">
                                            {code.code}
                                        </h3>
                                        {code.source?.type && (
                                            <span className="text-xs text-muted-foreground">
                                                {code.source.type}
                                                {code.source.creator && ` - ${code.source.creator}`}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(code.code)}
                                        className={`px-4 py-2 rounded font-medium transition-colors ${copiedCode === code.code
                                            ? 'bg-green-600 text-white'
                                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                            }`}
                                    >
                                        {copiedCode === code.code ? '✓ Copied!' : 'Copy'}
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <div className="font-semibold text-sm">Rewards:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {code.rewards.map((reward, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-white dark:bg-gray-800 border rounded-full text-sm"
                                            >
                                                {reward.quantity}x {reward.itemType}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border rounded-lg bg-muted/50">
                        <p className="text-lg text-muted-foreground">
                            No active codes available at the moment. Check back soon!
                        </p>
                    </div>
                )}
            </section>

            {/* Expired Codes */}
            <section className="mb-12">
                <button
                    onClick={() => setShowExpired(!showExpired)}
                    className="flex items-center gap-2 text-2xl font-bold mb-4 hover:text-primary transition-colors"
                >
                    <span>{showExpired ? '▼' : '▶'}</span>
                    <h2>Expired Codes</h2>
                    <span className="text-base text-muted-foreground">
                        ({expiredCodes.length})
                    </span>
                </button>

                {showExpired && (
                    <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
                        {expiredCodes.slice(0, 20).map((code) => (
                            <div
                                key={code.id}
                                className="border rounded p-3 bg-muted/30 opacity-60"
                            >
                                <div className="font-mono font-semibold text-sm line-through">
                                    {code.code}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {code.rewards[0]?.itemType || 'Various rewards'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
                <p className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-500 p-4 my-4">
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
