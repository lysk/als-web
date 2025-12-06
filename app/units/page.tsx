import { getUnits } from '@/lib/services/unit-service';
import UnitsClient from './units-client';



export default async function UnitsPage() {
    const units = await getUnits();

    return <UnitsClient initialUnits={units} />;
}
