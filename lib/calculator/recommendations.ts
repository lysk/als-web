import { Unit } from '@/lib/types';

/**
 * 计算升级建议
 */
export interface UpgradeRecommendation {
    unit: Unit;
    currentLevel: number;
    targetLevel: number;
    cost: number;
    dpsGain: number;
    dpsGainPercent: number;
    efficiency: number; // DPS gain per 1000 cost
}

export function getUpgradeRecommendations(
    team: Array<{ unit: Unit; level: number }>,
    maxRecommendations: number = 5
): UpgradeRecommendation[] {
    const recommendations: UpgradeRecommendation[] = [];

    for (const member of team) {
        const currentLevel = member.level;
        const maxLevel = member.unit.upgrades.length;

        // 尝试升5级
        for (let targetLevel = currentLevel + 5; targetLevel <= Math.min(currentLevel + 15, maxLevel); targetLevel += 5) {
            const currentStats = member.unit.upgrades[currentLevel - 1];
            const targetStats = member.unit.upgrades[targetLevel - 1];

            if (!currentStats || !targetStats) continue;

            // 计算升级成本
            let cost = 0;
            for (let i = currentLevel - 1; i < targetLevel - 1; i++) {
                if (member.unit.upgrades[i]) {
                    cost += member.unit.upgrades[i].upgradeCost;
                }
            }

            // 计算DPS提升
            const dpsGain = targetStats.dps - currentStats.dps;
            const dpsGainPercent = (dpsGain / currentStats.dps) * 100;
            const efficiency = cost > 0 ? (dpsGain / cost) * 1000 : 0;

            recommendations.push({
                unit: member.unit,
                currentLevel,
                targetLevel,
                cost,
                dpsGain,
                dpsGainPercent,
                efficiency
            });
        }
    }

    // 按性价比排序
    recommendations.sort((a, b) => b.efficiency - a.efficiency);

    return recommendations.slice(0, maxRecommendations);
}

/**
 * 确定单位角色
 */
export function determineUnitRole(unit: Unit): string {
    const maxUpgrade = unit.upgrades[unit.upgrades.length - 1];
    if (!maxUpgrade) return 'Support';

    const dps = maxUpgrade.dps;
    const range = maxUpgrade.range;

    // 简单的角色判定逻辑
    if (dps > 10000) {
        return 'Main DPS';
    } else if (dps > 5000) {
        if (range > 30) {
            return 'AoE Damage';
        }
        return 'Sub DPS';
    } else if (range > 35) {
        return 'Range Support';
    } else {
        return 'Support';
    }
}

/**
 * 获取单位推荐等级
 */
export function getRecommendedLevel(unit: Unit): number {
    // 基于性价比找到最佳等级
    let bestLevel = 1;
    let bestEfficiency = 0;

    for (let level = 10; level <= Math.min(unit.upgrades.length, 100); level += 10) {
        const stats = unit.upgrades[level - 1];
        if (!stats) continue;

        // 计算到该等级的成本
        let totalCost = unit.deploymentCost;
        for (let i = 0; i < level - 1; i++) {
            if (unit.upgrades[i]) {
                totalCost += unit.upgrades[i].upgradeCost;
            }
        }

        const efficiency = totalCost > 0 ? stats.dps / totalCost : 0;

        if (efficiency > bestEfficiency) {
            bestEfficiency = efficiency;
            bestLevel = level;
        }
    }

    return bestLevel;
}
