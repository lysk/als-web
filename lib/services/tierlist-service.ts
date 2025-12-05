import { supabase } from '@/lib/supabase';
import { TierListEntry } from '@/lib/types';

export async function getTierList(): Promise<TierListEntry[]> {
    const { data, error } = await supabase
        .from('tier_list')
        .select('*');

    if (error) {
        console.error('Error fetching tier list:', error);
        return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((entry: any) => ({
        id: entry.id,
        unitName: entry.unit_name,
        category: entry.category,
        tier: entry.tier,
        subcategory: entry.subcategory,
        notes: entry.notes,
    } as TierListEntry));
}
