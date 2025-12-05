import { Unit, Technique } from '../types';

/**
 * 计算单位的有效DPS
 */
export function calculateEffectiveDPS(
    unit: Unit,
    level: number,
    technique?: Technique
): number {
    // 获取指定等级的stats
    const levelStats = unit.upgrades.find(u => u.level === level);
    if (!levelStats) {
        return 0;
    }

    let baseDPS = levelStats.dps;

    // 应用技能加成
    if (technique && technique.effects) {
        // 伤害倍率
        if (technique.effects.damageMultiplier) {
            baseDPS *= technique.effects.damageMultiplier;
        }

        // 攻速加成会影响DPS
        if (technique.effects.spaMultiplier) {
            baseDPS /= technique.effects.spaMultiplier;
        }

        // 暴击加成（简化计算）
        if (technique.effects.critChanceBonus && technique.effects.critDamageMultiplier) {
            const critChance = Math.min(technique.effects.critChanceBonus / 100, 1);
            const critDamage = technique.effects.critDamageMultiplier || 1;
            baseDPS *= (1 + critChance * (critDamage - 1));
        }
    }

    return baseDPS;
}

/**
 * 计算阵容总DPS
 */
export function calculateTeamDPS(
    team: Array<{ unit: Unit; level: number; technique?: Technique }>
): number {
    let totalDPS = 0;

    for (const member of team) {
        totalDPS += calculateEffectiveDPS(member.unit, member.level, member.technique);
    }

    return totalDPS;
}

/**
 * 计算阵容总成本
 */
export function calculateTeamCost(
    team: Array<{ unit: Unit; level: number }>
): number {
    let totalCost = 0;

    for (const member of team) {
        // 部署成本
        totalCost += member.unit.deploymentCost;

        // 升级成本
        for (let i = 0; i < member.level - 1; i++) {
            if (member.unit.upgrades[i]) {
                totalCost += member.unit.upgrades[i].upgradeCost;
            }
        }
    }

    return totalCost;
}

/**
 * 计算单位性价比
 */
export function calculateUnitEfficiency(
    unit: Unit,
    level: number,
    technique?: Technique
): number {
    const dps = calculateEffectiveDPS(unit, level, technique);

    // 计算到该等级的总成本
    let cost = unit.deploymentCost;
    for (let i = 0; i < level - 1; i++) {
        if (unit.upgrades[i]) {
            cost += unit.upgrades[i].upgradeCost;
        }
    }

    return cost > 0 ? dps / cost : 0;
}

/**
 * 获取单位的推荐等级
 * 基于性价比曲线，找到最优升级点
 */
export function getRecommendedLevel(unit: Unit): number {
    let bestLevel = 1;
    let bestEfficiency = 0;

    for (let level = 1; level <= unit.upgrades.length; level++) {
        const efficiency = calculateUnitEfficiency(unit, level);
        if (efficiency > bestEfficiency) {
            bestEfficiency = efficiency;
            bestLevel = level;
        }
    }

    return bestLevel;
}
