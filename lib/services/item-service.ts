import { supabase } from '@/lib/supabase';
import { Item } from '@/lib/types';

export async function getItems(): Promise<Item[]> {
    const { data, error } = await supabase
        .from('items')
        .select('*');

    if (error) {
        console.error('Error fetching items:', error);
        return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        imageUrl: item.image_url,
        wikiUrl: item.wiki_url,
        obtainMethod: item.obtain_method,
        scrapedAt: item.scraped_at,
    } as Item));
}
