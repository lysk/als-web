
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function updateDeploymentCosts() {
    console.log('Fetching all units...');
    const { data: units, error: unitsError } = await supabase.from('units').select('id, name');

    if (unitsError) {
        console.error('Error fetching units:', unitsError);
        return;
    }

    console.log(`Found ${units.length} units. Processing...`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const unit of units) {
        // Find the Level 1 upgrade for this unit
        const { data: upgrade, error: upgradeError } = await supabase
            .from('unit_upgrades')
            .select('upgrade_cost')
            .eq('unit_id', unit.id)
            .eq('level', 1)
            .single();

        if (upgradeError) {
            console.warn(`Could not find Level 1 upgrade for unit ${unit.name} (${unit.id})`);
            continue;
        }

        if (upgrade) {
            // Update the unit's deployment_cost
            const { error: updateError } = await supabase
                .from('units')
                .update({ deployment_cost: upgrade.upgrade_cost })
                .eq('id', unit.id);

            if (updateError) {
                console.error(`Error updating unit ${unit.name}:`, updateError);
                errorCount++;
            } else {
                console.log(`Updated ${unit.name}: Deployment Cost = ${upgrade.upgrade_cost}`);
                updatedCount++;
            }
        }
    }

    console.log(`Finished! Updated: ${updatedCount}, Errors: ${errorCount}`);
}

updateDeploymentCosts();
