import { getItems } from '@/lib/services/item-service';
import ItemsClient from './items-client';



export default async function ItemsPage() {
    const items = await getItems();

    return <ItemsClient initialItems={items} />;
}
