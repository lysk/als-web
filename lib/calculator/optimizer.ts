import { Unit, Technique } from '../types';
import { calculateTeamDPS, calculateTeamCost, calculateUnitEfficiency } from './dps';

export interface TeamMember {
    unit: Unit;
    level: number;
    technique?: Technique;
}

export interface OptimizationResult {
    team: TeamMember[];
    totalDPS: number;
    totalCost: number;
    avgEfficiency: number;
    score: number;
}

/**
 * 阵容优化器 - 贪婪算法（快速推荐）
 * 基于单位性价比选择最优阵容
 */
export function optimizeTeamGreedy(
    availableUnits: Unit[],
    teamSize: number = 6,
    maxTotalCost?: number
): OptimizationResult {
    // 计算每个单位的性价比
    const unitsWithEfficiency = availableUnits.map(unit => ({
        unit,
        level: Math.min(unit.upgrades.length, 50), // 默认50级
        efficiency: calculateUnitEfficiency(unit, Math.min(unit.upgrades.length, 50))
    }));

    // 按性价比排序
    unitsWithEfficiency.sort((a, b) => b.efficiency - a.efficiency);

    // 贪婪选择
    const team: TeamMember[] = [];
    let currentCost = 0;

    for (const item of unitsWithEfficiency) {
        if (team.length >= teamSize) break;

        const unitCost = item.unit.deploymentCost +
            item.unit.upgrades.slice(0, item.level - 1)
                .reduce((sum, u) => sum + u.upgradeCost, 0);

        if (maxTotalCost && currentCost + unitCost > maxTotalCost) {
            continue;
        }

        team.push({
            unit: item.unit,
            level: item.level,
        });

        currentCost += unitCost;
    }

    // 计算结果
    const totalDPS = calculateTeamDPS(team);
    const totalCost = calculateTeamCost(team);
    const avgEfficiency = team.length > 0 ? totalDPS / totalCost : 0;
    const score = totalDPS * 0.7 + avgEfficiency * 1000 * 0.3;

    return {
        team,
        totalDPS,
        totalCost,
        avgEfficiency,
        score
    };
}

/**
 * 按稀有度筛选和推荐
 * 确保阵容包含不同稀有度的平衡
 */
export function optimizeTeamBalanced(
    availableUnits: Unit[],
    teamSize: number = 6
): OptimizationResult {
    const rarityPriority = ['Godly', 'Extreme Boosted', 'Ultimate', 'Exotic', 'Celestial', 'Mythic', 'Legendary'];

    const team: TeamMember[] = [];
    const usedUnits = new Set<string>();

    // 按稀有度优先级选择
    for (const rarity of rarityPriority) {
        if (team.length >= teamSize) break;

        const unitsOfRarity = availableUnits
            .filter(u => u.rarity === rarity && !usedUnits.has(u.id))
            .map(unit => ({
                unit,
                level: Math.min(unit.upgrades.length, 50),
                efficiency: calculateUnitEfficiency(unit, Math.min(unit.upgrades.length, 50))
            }))
            .sort((a, b) => b.efficiency - a.efficiency);

        // 选择该稀有度的最佳单位
        const bestUnit = unitsOfRarity[0];
        if (bestUnit) {
            team.push({
                unit: bestUnit.unit,
                level: bestUnit.level
            });
            usedUnits.add(bestUnit.unit.id);
        }
    }

    // 如果还没满，用剩余最佳单位补充
    if (team.length < teamSize) {
        const remaining = availableUnits
            .filter(u => !usedUnits.has(u.id))
            .map(unit => ({
                unit,
                level: Math.min(unit.upgrades.length, 50),
                efficiency: calculateUnitEfficiency(unit, Math.min(unit.upgrades.length, 50))
            }))
            .sort((a, b) => b.efficiency - a.efficiency);

        for (const item of remaining) {
            if (team.length >= teamSize) break;
            team.push({
                unit: item.unit,
                level: item.level
            });
        }
    }

    const totalDPS = calculateTeamDPS(team);
    const totalCost = calculateTeamCost(team);
    const avgEfficiency = team.length > 0 ? totalDPS / totalCost : 0;
    const score = totalDPS * 0.7 + avgEfficiency * 1000 * 0.3;

    return {
        team,
        totalDPS,
        totalCost,
        avgEfficiency,
        score
    };
}

/**
 * 获取多个阵容推荐
 */
export function getMultipleRecommendations(
    availableUnits: Unit[],
    teamSize: number = 6
): OptimizationResult[] {
    const results: OptimizationResult[] = [];

    // 推荐1: 最高DPS（贪婪算法）
    results.push(optimizeTeamGreedy(availableUnits, teamSize));

    // 推荐2: 平衡阵容
    results.push(optimizeTeamBalanced(availableUnits, teamSize));

    // 推荐3: 低成本高效
    results.push(optimizeTeamGreedy(availableUnits, teamSize, 30000));

    // 按综合得分排序
    results.sort((a, b) => b.score - a.score);

    return results;
}
