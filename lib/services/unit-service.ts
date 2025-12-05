import { supabase } from '@/lib/supabase';
import { Unit, UnitUpgrade } from '@/lib/types';

export async function getUnits(): Promise<Unit[]> {
    const { data: unitsData, error: unitsError } = await supabase
        .from('units')
        .select('*');

    if (unitsError) {
        console.error('Error fetching units:', unitsError);
        return [];
    }

    console.log('[DEBUG] Fetched units from database:', unitsData?.length || 0);

    const { data: upgradesData, error: upgradesError } = await supabase
        .from('unit_upgrades')
        .select('*');

    if (upgradesError) {
        console.error('Error fetching unit upgrades:', upgradesError);
        return [];
    }

    console.log('[DEBUG] Fetched upgrades from database:', upgradesData?.length || 0);

    // Map upgrades to units
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const units: Unit[] = unitsData.map((unit: any) => {
        const unitUpgrades = upgradesData
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((upgrade: any) => upgrade.unit_id === unit.id)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((upgrade: any) => ({
                level: upgrade.level,
                upgradeCost: upgrade.upgrade_cost,
                damage: upgrade.damage,
                range: upgrade.range,
                spa: upgrade.spa,
                dps: upgrade.dps,
            } as UnitUpgrade))
            .sort((a, b) => a.level - b.level);

        return {
            id: unit.id,
            name: unit.name,
            wikiUrl: unit.wiki_url,
            scrapedAt: unit.scraped_at,
            rarity: unit.rarity,
            element: unit.element,
            type: unit.type,
            deploymentCost: unit.deployment_cost,
            totalCost: unit.total_cost,
            canEvolve: unit.can_evolve,
            isEvolved: unit.is_evolved,
            imageUrl: unit.image_url,
            upgrades: unitUpgrades,
        } as Unit;
    });

    console.log('[DEBUG] Returning units:', units.length);
    console.log('[DEBUG] Sample unit:', units[0]?.name, 'with', units[0]?.upgrades?.length, 'upgrades');

    return units;
}

export async function getUnitById(id: string): Promise<Unit | null> {
    const { data: unit, error } = await supabase
        .from('units')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !unit) {
        console.error('Error fetching unit:', error);
        return null;
    }

    const { data: upgradesData, error: upgradesError } = await supabase
        .from('unit_upgrades')
        .select('*')
        .eq('unit_id', id);

    if (upgradesError) {
        console.error('Error fetching unit upgrades:', upgradesError);
        return null;
    }

    const unitUpgrades = upgradesData
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((upgrade: any) => ({
            level: upgrade.level,
            upgradeCost: upgrade.upgrade_cost,
            damage: upgrade.damage,
            range: upgrade.range,
            spa: upgrade.spa,
            dps: upgrade.dps,
        } as UnitUpgrade))
        .sort((a, b) => a.level - b.level);

    return {
        id: unit.id,
        name: unit.name,
        wikiUrl: unit.wiki_url,
        scrapedAt: unit.scraped_at,
        rarity: unit.rarity,
        element: unit.element,
        type: unit.type,
        deploymentCost: unit.deployment_cost,
        totalCost: unit.total_cost,
        canEvolve: unit.can_evolve,
        isEvolved: unit.is_evolved,
        imageUrl: unit.image_url,
        upgrades: unitUpgrades,
    } as Unit;
}
