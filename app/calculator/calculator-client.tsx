'use client';

import { useState, useMemo } from 'react';
import { Unit, Technique } from '@/lib/types';
import { optimizeTeamBalanced, OptimizationResult } from '@/lib/calculator/optimizer';
import { calculateEffectiveDPS } from '@/lib/calculator/dps';
import { getUpgradeRecommendations, determineUnitRole, getRecommendedLevel } from '@/lib/calculator/recommendations';
import { DPSBarChart, DPSPieChart } from '@/components/calculator/DPSCharts';

interface CalculatorClientProps {
    initialUnits: Unit[];
    initialTechniques: Technique[];
}

export default function CalculatorClient({ initialUnits }: CalculatorClientProps) {
    const units = initialUnits;

    // 状态管理
    const [selectedUnits, setSelectedUnits] = useState<Map<string, number>>(new Map());
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRarity, setFilterRarity] = useState<string>('all');
    const [result, setResult] = useState<OptimizationResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // 筛选单位
    const filteredUnits = useMemo(() => {
        return units.filter(unit => {
            const matchesSearch = unit.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRarity = filterRarity === 'all' || unit.rarity === filterRarity;
            return matchesSearch && matchesRarity && unit.upgrades.length > 0;
        });
    }, [units, searchQuery, filterRarity]);

    // 稀有度列表
    const rarities = useMemo(() => {
        return Array.from(new Set(units.map(u => u.rarity))).sort();
    }, [units]);

    // 切换单位选择
    const toggleUnit = (unitId: string) => {
        const newSelected = new Map(selectedUnits);
        if (newSelected.has(unitId)) {
            newSelected.delete(unitId);
        } else {
            const unit = units.find(u => u.id === unitId);
            if (unit) {
                const recommendedLevel = getRecommendedLevel(unit);
                newSelected.set(unitId, recommendedLevel);
            }
        }
        setSelectedUnits(newSelected);
    };

    // 更新单位等级
    const updateUnitLevel = (unitId: string, level: number) => {
        const newSelected = new Map(selectedUnits);
        newSelected.set(unitId, level);
        setSelectedUnits(newSelected);
    };

    // 计算最优阵容
    const calculateOptimalTeam = () => {
        setIsCalculating(true);

        setTimeout(() => {
            const availableUnits = Array.from(selectedUnits.entries()).map(([id, level]) => {
                const unit = units.find(u => u.id === id)!;
                return { unit, level };
            });

            const optimization = optimizeTeamBalanced(availableUnits.map(i => i.unit), 6);

            // 更新等级为用户设置的等级
            optimization.team = optimization.team.map(member => {
                const userLevel = selectedUnits.get(member.unit.id);
                return {
                    ...member,
                    level: userLevel || member.level
                };
            });

            setResult(optimization);
            setIsCalculating(false);
        }, 500);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">🎮 Team DPS Calculator</h1>
                <p className="text-lg text-muted-foreground">
                    Select your units, set their levels, and get personalized team recommendations
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Unit Selection */}
                <div className="lg:col-span-2">
                    <div className="border rounded-lg p-6 bg-card">
                        <h2 className="text-2xl font-bold mb-4">Step 1: Select Your Units</h2>

                        {/* Filters */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Search units..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="px-4 py-2 border rounded-lg"
                            />
                            <select
                                value={filterRarity}
                                onChange={(e) => setFilterRarity(e.target.value)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                <option value="all">All Rarities</option>
                                {rarities.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        <div className="text-sm text-muted-foreground mb-4">
                            Selected: {selectedUnits.size} units
                        </div>

                        {/* Units Grid */}
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {filteredUnits.slice(0, 30).map(unit => {
                                const isSelected = selectedUnits.has(unit.id);
                                const level = selectedUnits.get(unit.id) || getRecommendedLevel(unit);
                                const maxLevel = unit.upgrades.length;

                                return (
                                    <div
                                        key={unit.id}
                                        className={`border rounded-lg p-4 transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleUnit(unit.id)}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="font-semibold">{unit.name}</span>
                                                </div>
                                                <div className="flex gap-2 mt-1 ml-6">
                                                    <span className="px-2 py-0.5 bg-muted rounded text-xs">
                                                        {unit.rarity}
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-muted rounded text-xs">
                                                        {unit.element}
                                                    </span>
                                                </div>
                                            </div>
                                            {unit.upgrades[level - 1] && (
                                                <div className="text-right text-sm">
                                                    <div className="font-bold">
                                                        {Math.round(unit.upgrades[level - 1].dps).toLocaleString('en-US')}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">DPS</div>
                                                </div>
                                            )}
                                        </div>

                                        {isSelected && (
                                            <div className="ml-6 mt-3 pt-3 border-t">
                                                <label className="block text-sm font-medium mb-2">
                                                    Level: {level} / {maxLevel}
                                                </label>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max={maxLevel}
                                                    value={level}
                                                    onChange={(e) => updateUnitLevel(unit.id, parseInt(e.target.value))}
                                                    className="w-full"
                                                />
                                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                                    <span>1</span>
                                                    <span>{maxLevel}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right: Summary & Calculate */}
                <div>
                    <div className="border rounded-lg p-6 bg-card sticky top-4">
                        <h3 className="text-xl font-bold mb-4">Selected Units</h3>

                        {selectedUnits.size === 0 ? (
                            <p className="text-muted-foreground text-sm">
                                No units selected yet. Select at least 6 units to calculate.
                            </p>
                        ) : (
                            <div className="space-y-2 mb-6">
                                {Array.from(selectedUnits.entries()).slice(0, 10).map(([id, level]) => {
                                    const unit = units.find(u => u.id === id);
                                    if (!unit) return null;

                                    return (
                                        <div key={id} className="text-sm flex justify-between">
                                            <span className="truncate">{unit.name}</span>
                                            <span className="text-muted-foreground ml-2">Lv.{level}</span>
                                        </div>
                                    );
                                })}
                                {selectedUnits.size > 10 && (
                                    <div className="text-xs text-muted-foreground">
                                        +{selectedUnits.size - 10} more...
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={calculateOptimalTeam}
                            disabled={selectedUnits.size < 6 || isCalculating}
                            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCalculating ? 'Calculating...' : `Calculate Best Team (${selectedUnits.size})`}
                        </button>

                        {selectedUnits.size < 6 && selectedUnits.size > 0 && (
                            <p className="text-sm text-muted-foreground mt-2 text-center">
                                Select at least {6 - selectedUnits.size} more units
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Results */}
            {result && (
                <ResultDisplay result={result} selectedUnits={selectedUnits} />
            )}
        </div>
    );
}

// Result Display Component
function ResultDisplay({
    result,
    selectedUnits
}: {
    result: OptimizationResult;
    selectedUnits: Map<string, number>;
}) {
    const teamArray = result.team.map(member => ({
        unit: member.unit,
        level: selectedUnits.get(member.unit.id) || member.level
    }));

    const upgradeRecommendations = getUpgradeRecommendations(teamArray, 5);

    return (
        <div className="mt-8 space-y-6">
            {/* Team Summary */}
            <div className="border rounded-lg p-6 bg-card">
                <h2 className="text-2xl font-bold mb-4">✨ Recommended Team</h2>

                <div className="grid md:grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                    <div>
                        <div className="text-sm text-muted-foreground">Total DPS</div>
                        <div className="text-2xl font-bold">
                            {Math.round(result.totalDPS).toLocaleString('en-US')}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Total Cost</div>
                        <div className="text-2xl font-bold">
                            ${result.totalCost.toLocaleString('en-US')}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Efficiency</div>
                        <div className="text-2xl font-bold">
                            {result.avgEfficiency.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Team Members */}
                <div className="space-y-3">
                    {teamArray.map((member, idx) => {
                        const currentStats = member.unit.upgrades[member.level - 1];
                        const role = determineUnitRole(member.unit);

                        return (
                            <div key={member.unit.id} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold">
                                                {idx + 1}. {member.unit.name}
                                            </span>
                                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded text-xs font-medium">
                                                {role}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 mt-1">
                                            <span className="px-2 py-0.5 bg-muted rounded text-xs">
                                                {member.unit.rarity}
                                            </span>
                                            <span className="px-2 py-0.5 bg-muted rounded text-xs">
                                                Level {member.level}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-lg">
                                            {Math.round(calculateEffectiveDPS(member.unit, member.level)).toLocaleString('en-US')}
                                        </div>
                                        <div className="text-xs text-muted-foreground">DPS</div>
                                    </div>
                                </div>

                                {currentStats && (
                                    <div className="grid grid-cols-4 gap-2 text-sm mt-3 pt-3 border-t">
                                        <div>
                                            <span className="text-muted-foreground">Dmg: </span>
                                            <span className="font-semibold">{currentStats.damage.toLocaleString('en-US')}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Range: </span>
                                            <span className="font-semibold">{currentStats.range}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">SPA: </span>
                                            <span className="font-semibold">{currentStats.spa}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Cost: </span>
                                            <span className="font-semibold">${currentStats.upgradeCost.toLocaleString('en-US')}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Upgrade Recommendations */}
            {upgradeRecommendations.length > 0 && (
                <div className="border rounded-lg p-6 bg-card">
                    <h3 className="text-2xl font-bold mb-4">📈 Upgrade Recommendations</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Best upgrades ranked by efficiency (DPS gain per cost)
                    </p>

                    <div className="space-y-3">
                        {upgradeRecommendations.map((rec, idx) => (
                            <div key={`${rec.unit.id}-${rec.targetLevel}`} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="font-bold text-lg">
                                            {idx + 1}. {rec.unit.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Level {rec.currentLevel} → {rec.targetLevel}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-lg text-green-600 dark:text-green-400">
                                            +{Math.round(rec.dpsGain).toLocaleString('en-US')}
                                        </div>
                                        <div className="text-xs text-muted-foreground">DPS</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-sm mt-3 pt-3 border-t">
                                    <div>
                                        <div className="text-muted-foreground">Upgrade Cost</div>
                                        <div className="font-semibold">${rec.cost.toLocaleString('en-US')}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">DPS Gain</div>
                                        <div className="font-semibold">+{rec.dpsGainPercent.toFixed(1)}%</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Efficiency</div>
                                        <div className="font-semibold flex items-center gap-1">
                                            {rec.efficiency.toFixed(2)}
                                            {rec.efficiency > 2 && <span className="text-yellow-500">⭐</span>}
                                            {rec.efficiency > 3 && <span className="text-yellow-500">⭐</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Data Visualization */}
            <div className="border rounded-lg p-6 bg-card">
                <h3 className="text-2xl font-bold mb-4">📊 Team Analysis</h3>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-3">DPS Distribution</h4>
                        <DPSBarChart
                            team={teamArray.map(m => ({
                                unit: m.unit,
                                dps: calculateEffectiveDPS(m.unit, m.level)
                            }))}
                        />
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">DPS Contribution</h4>
                        <DPSPieChart
                            team={teamArray.map(m => ({
                                unit: m.unit,
                                dps: calculateEffectiveDPS(m.unit, m.level)
                            }))}
                        />
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="border rounded-lg p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold mb-3">💡 Optimization Tips</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Place high-DPS units in strategic positions with good map coverage</li>
                    <li>• Prioritize upgrades with efficiency rating ⭐⭐ or higher</li>
                    <li>• Balance your team with different roles (Main DPS, AoE, Support)</li>
                    <li>• Consider unit placement cost vs. upgrade cost for early waves</li>
                </ul>
            </div>
        </div>
    );
}
