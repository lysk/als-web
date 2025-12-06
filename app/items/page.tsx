import { getItems } from '@/lib/services/item-service';
import ItemsClient from './items-client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function ItemsPage() {
    const items = await getItems();

    return <ItemsClient initialItems={items} />;
}
