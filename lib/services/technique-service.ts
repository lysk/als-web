import { supabase } from '@/lib/supabase';
import { Technique } from '@/lib/types';

export async function getTechniques(): Promise<Technique[]> {
    const { data, error } = await supabase
        .from('techniques')
        .select('*');

    if (error) {
        console.error('Error fetching techniques:', error);
        return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((tech: any) => ({
        id: tech.id,
        name: tech.name,
        tier: tech.tier,
        rarity: tech.rarity,
        probability: tech.probability,
        effects: tech.effects,
        description: tech.description,
    } as Technique));
}
