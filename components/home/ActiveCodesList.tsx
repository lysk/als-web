'use client';

import { Code } from '@/lib/types';
import { Gift } from 'lucide-react';
import Link from 'next/link';

interface ActiveCodesListProps {
    activeCodes: Code[];
}

export function ActiveCodesList({ activeCodes }: ActiveCodesListProps) {
    const displayCodes = activeCodes.slice(0, 3); // Show top 3 codes

    return (
        <section>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Gift className="text-primary" /> Latest Codes
                </h2>
                <Link href="/codes" className="text-sm text-primary hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
                {displayCodes.map((code) => (
                    <div key={code.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg hover:border-primary/50 transition-colors">
                        <div>
                            <div className="font-mono font-bold text-lg text-primary">{code.code}</div>
                            <div className="text-xs text-muted-foreground flex gap-2 mt-1">
                                {code.rewards.slice(0, 2).map((r, i) => (
                                    <span key={i} className="bg-white/5 px-2 py-0.5 rounded">{r.quantity}x {r.itemType}</span>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(code.code);
                            }}
                            className="px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 rounded transition-colors"
                        >
                            Copy
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
