import { supabase } from '@/lib/supabase';
import { Code } from '@/lib/types';

export async function getCodes(): Promise<Code[]> {
    const { data, error } = await supabase
        .from('codes')
        .select('*');

    if (error) {
        console.error('Error fetching codes:', error);
        return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((code: any) => ({
        id: code.id,
        code: code.code,
        name: code.name,
        scrapedAt: code.scraped_at,
        status: code.status as 'Active' | 'Expired',
        rewards: code.rewards,
        source: code.source,
        description: code.description,
    } as Code));
}
