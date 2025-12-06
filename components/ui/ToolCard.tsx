import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface ToolCardProps {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    stats?: string;
    className?: string;
}

export function ToolCard({ title, description, href, icon, stats, className }: ToolCardProps) {
    return (
        <Link
            href={href}
            className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20",
                className
            )}
        >
            <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-3 text-primary ring-1 ring-white/10 group-hover:bg-primary/20 group-hover:text-primary-foreground transition-colors">
                    {icon}
                </div>
                {stats && (
                    <span className="text-xs font-semibold text-muted-foreground bg-white/5 px-2 py-1 rounded-full border border-white/10">
                        {stats}
                    </span>
                )}
            </div>

            <div>
                <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                Open Tool <ArrowRight className="ml-1 h-4 w-4" />
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute -right-10 -top-10 h-32 w-32 bg-primary/20 blur-3xl rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
    );
}
