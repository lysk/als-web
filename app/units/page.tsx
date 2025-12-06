import { getUnits } from '@/lib/services/unit-service';
import UnitsClient from './units-client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function UnitsPage() {
    const units = await getUnits();

    return <UnitsClient initialUnits={units} />;
}
