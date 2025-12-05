import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface UnitUpgrade {
    level: number;
    upgradeCost: number;
    damage: number;
    range: number;
    spa: number;
    dps: number;
}

interface Unit {
    id: string;
    name: string;
    wikiUrl: string;
    scrapedAt: string;
    rarity: string;
    element: string;
    type: string;
    deploymentCost: number;
    totalCost: number;
    canEvolve: boolean;
    isEvolved: boolean;
    imageUrl?: string;
    upgrades: UnitUpgrade[];
}

async function importUnitUpgrades() {
    console.log('Starting unit upgrades import...');

    // Read units.json
    const unitsPath = path.join(__dirname, '../lib/data/units.json');
    const unitsData: Unit[] = JSON.parse(fs.readFileSync(unitsPath, 'utf-8'));

    console.log(`Loaded ${unitsData.length} units from JSON file`);

    // Prepare upgrade records for batch insert
    const upgradeRecords: any[] = [];

    for (const unit of unitsData) {
        if (!unit.upgrades || unit.upgrades.length === 0) {
            console.log(`Skipping ${unit.name} - no upgrades`);
            continue;
        }

        for (const upgrade of unit.upgrades) {
            upgradeRecords.push({
                unit_id: unit.id,
                level: upgrade.level,
                upgrade_cost: upgrade.upgradeCost,
                damage: upgrade.damage,
                range: upgrade.range,
                spa: upgrade.spa,
                dps: upgrade.dps,
            });
        }
    }

    console.log(`Prepared ${upgradeRecords.length} upgrade records`);

    // Check if table already has data
    const { count } = await supabase
        .from('unit_upgrades')
        .select('*', { count: 'exact', head: true });

    if (count && count > 0) {
        console.log(`unit_upgrades table already has ${count} records`);
        console.log('Skipping import - table already has data');
        return;
    }

    // Batch insert in chunks of 1000
    const BATCH_SIZE = 1000;
    let imported = 0;

    for (let i = 0; i < upgradeRecords.length; i += BATCH_SIZE) {
        const batch = upgradeRecords.slice(i, i + BATCH_SIZE);

        const { error } = await supabase
            .from('unit_upgrades')
            .insert(batch);

        if (error) {
            console.error(`Error inserting batch ${i / BATCH_SIZE + 1}:`, error);
            throw error;
        }

        imported += batch.length;
        console.log(`Imported ${imported} / ${upgradeRecords.length} upgrades...`);
    }

    console.log('Import completed successfully!');
    console.log(`Total upgrades imported: ${imported}`);
}

// Run the import
importUnitUpgrades()
    .then(() => {
        console.log('Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Import failed:', error);
        process.exit(1);
    });
