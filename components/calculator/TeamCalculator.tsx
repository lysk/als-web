'use client';

import { useState, useMemo } from 'react';
import { Unit } from '@/lib/types';
import { optimizeTeamBalanced, OptimizationResult } from '@/lib/calculator/optimizer';
import { calculateEffectiveDPS } from '@/lib/calculator/dps';

interface TeamCalculatorProps {
    units: Unit[];
}

export function TeamCalculator({ units }: TeamCalculatorProps) {
    const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [result, setResult] = useState<OptimizationResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // 筛选单位
    const filteredUnits = useMemo(() => {
        return units.filter(unit =>
            unit.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [units, searchQuery]);

    // 切换单位选择
    const toggleUnit = (unitId: string) => {
        const newSelected = new Set(selectedUnits);
        if (newSelected.has(unitId)) {
            newSelected.delete(unitId);
        } else {
            newSelected.add(unitId);
        }
        setSelectedUnits(newSelected);
    };

    // 计算最优阵容
    const calculateOptimalTeam = () => {
        setIsCalculating(true);

        // 模拟异步计算
        setTimeout(() => {
            const availableUnits = units.filter(u => selectedUnits.has(u.id));
            const optimization = optimizeTeamBalanced(availableUnits, 6);
            setResult(optimization);
            setIsCalculating(false);
        }, 500);
    };

    return (
        <div className="space-y-6">
            {/* 步骤1: 选择拥有的单位 */}
            <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Step 1: Select Your Units</h3>

                <input
                    type="text"
                    placeholder="Search units..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg mb-4"
                />

                <div className="text-sm text-muted-foreground mb-3">
                    Selected: {selectedUnits.size} units
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
                    {filteredUnits.slice(0, 50).map(unit => (
                        <div
                            key={unit.id}
                            onClick={() => toggleUnit(unit.id)}
                            className={`p-3 border rounded cursor-pointer transition-colors ${selectedUnits.has(unit.id)
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'hover:bg-muted'
                                }`}
                        >
                            <div className="font-medium text-sm">{unit.name}</div>
                            <div className="text-xs opacity-80">{unit.rarity}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 计算按钮 */}
            <div className="text-center">
                <button
                    onClick={calculateOptimalTeam}
                    disabled={selectedUnits.size < 6 || isCalculating}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isCalculating ? 'Calculating...' : 'Calculate Best Team'}
                </button>

                {selectedUnits.size < 6 && (
                    <p className="text-sm text-muted-foreground mt-2">
                        Please select at least 6 units
                    </p>
                )}
            </div>

            {/* 结果展示 */}
            {result && (
                <div className="border rounded-lg p-6 bg-card">
                    <h3 className="text-2xl font-bold mb-4">✨ Recommended Team</h3>

                    {/* 团队统计 */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
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

                    {/* 单位列表 */}
                    <div className="space-y-3">
                        {result.team.map((member, idx) => {
                            const currentLevel = member.unit.upgrades[member.level - 1];

                            return (
                                <div key={member.unit.id} className="border rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <span className="font-bold text-lg">
                                                {idx + 1}. {member.unit.name}
                                            </span>
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

                                    {currentLevel && (
                                        <div className="grid grid-cols-3 gap-2 text-sm mt-3 pt-3 border-t">
                                            <div>
                                                <span className="text-muted-foreground">Damage: </span>
                                                <span className="font-semibold">{currentLevel.damage.toLocaleString('en-US')}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Range: </span>
                                                <span className="font-semibold">{currentLevel.range}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">SPA: </span>
                                                <span className="font-semibold">{currentLevel.spa}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* 建议 */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold mb-2">💡 Tips</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• This team is optimized for balanced performance</li>
                            <li>• Place units in order of importance (top to bottom)</li>
                            <li>• Upgrade high-DPS units first for better returns</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
