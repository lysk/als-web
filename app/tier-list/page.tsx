import { getUnits } from '@/lib/services/unit-service';
import TierListClient from './tier-list-client';



export default async function TierListPage() {
    const units = await getUnits();

    return <TierListClient initialUnits={units} />;
}
