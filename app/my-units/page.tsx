
import { getUnits } from '@/lib/services/unit-service';
import MyUnitsClient from './my-units-client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function MyUnitsPage() {
    // Fetch all available units to allow the user to select and add them to their pool
    const allUnits = await getUnits();

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-4xl font-bold mb-2 tracking-tight">My Unit Pool</h1>
            <p className="text-muted-foreground mb-8">
                Manage your personal collection of units. Set their levels to fetch accurate DPS calculations.
            </p>

            <MyUnitsClient allUnits={allUnits} />
        </div>
    );
}
