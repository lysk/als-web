'use client';

import { useState, useMemo, useEffect } from 'react';
import { Unit, Technique, UserUnit } from '@/lib/types';
import { UserUnitService } from '@/lib/services/user-unit-service';
import { optimizeTeamBalanced, OptimizationResult } from '@/lib/calculator/optimizer';
import { calculateEffectiveDPS } from '@/lib/calculator/dps';
import { getUpgradeRecommendations, determineUnitRole, getRecommendedLevel } from '@/lib/calculator/recommendations';
import { DPSBarChart, DPSPieChart } from '@/components/calculator/DPSCharts';
import { User } from 'lucide-react';

interface CalculatorClientProps {
    initialUnits: Unit[];
    initialTechniques: Technique[];
}

type UnitSource = 'database' | 'my-units';

export default function CalculatorClient({ initialUnits }: CalculatorClientProps) {
    const units = initialUnits;

    // 状态管理
    const [selectedUnits, setSelectedUnits] = useState<Map<string, number>>(new Map());
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRarity, setFilterRarity] = useState<string>('all');
    const [result, setResult] = useState<OptimizationResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // User Pool Integration
    const [unitSource, setUnitSource] = useState<UnitSource>('database');
    const [userUnits, setUserUnits] = useState<UserUnit[]>([]);

    useEffect(() => {
        // Load user units
        setUserUnits(UserUnitService.getAll());

        // Listen for updates
        const handleUpdate = () => setUserUnits(UserUnitService.getAll());
        window.addEventListener('user-units-updated', handleUpdate);
        return () => window.removeEventListener('user-units-updated', handleUpdate);
    }, []);

    // 筛选单位
    const filteredUnits = useMemo(() => {
        let sourceList = units;

        // If sorting by "My Units", filter the master list to only includes ones we have
        if (unitSource === 'my-units') {
            const userUnitIds = new Set(userUnits.map(u => u.unitId));
            sourceList = units.filter(u => userUnitIds.has(u.id));
        }

        return sourceList.filter(unit => {
            const matchesSearch = unit.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRarity = filterRarity === 'all' || unit.rarity === filterRarity;
            return matchesSearch && matchesRarity && unit.upgrades.length > 0;
        });
    }, [units, searchQuery, filterRarity, unitSource, userUnits]);

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
                let initialLevel = getRecommendedLevel(unit);

                // If adding from "My Units", use the saved level
                if (unitSource === 'my-units') {
                    const userUnit = userUnits.find(u => u.unitId === unitId);
                    if (userUnit) {
                        initialLevel = userUnit.level;
                    }
                }

                newSelected.set(unitId, initialLevel);
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
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">Step 1: Select Your Units</h2>

                            <div className="flex p-1 bg-muted rounded-lg w-[240px]">
                                <button
                                    onClick={() => setUnitSource('database')}
                                    className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all ${unitSource === 'database'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                                        }`}
                                >
                                    Database
                                </button>
                                <button
                                    onClick={() => setUnitSource('my-units')}
                                    className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all flex items-center justify-center gap-2 ${unitSource === 'my-units'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                                        }`}
                                >
                                    <User className="h-4 w-4" /> My Units
                                </button>
                            </div>
                        </div>

                        {unitSource === 'my-units' && userUnits.length === 0 && (
                            <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-dashed text-center">
                                <p className="text-sm text-muted-foreground mb-2">You haven't added any units to your pool yet.</p>
                                <a href="/my-units" className="text-primary hover:underline text-sm font-medium">Go to My Units &rarr;</a>
                            </div>
                        )}

                        {/* Filters */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Search units..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="px-4 py-2 border rounded-lg bg-background"
                            />
                            <select
                                value={filterRarity}
                                onChange={(e) => setFilterRarity(e.target.value)}
                                className="px-4 py-2 border rounded-lg bg-background"
                            >
                                <option value="all">All Rarities</option>
                                {rarities.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        <div className="text-sm text-muted-foreground mb-4">
                            Showing: {filteredUnits.length} units
                        </div>

                        {/* Units Grid */}
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {filteredUnits.slice(0, 30).map(unit => {
                                const isSelected = selectedUnits.has(unit.id);
                                const level = selectedUnits.get(unit.id) || getRecommendedLevel(unit);
                                const maxLevel = unit.upgrades.length;

                                // Check if this unit is in user's pool for visual indicator
                                const inUserPool = userUnits.some(u => u.unitId === unit.id);

                                return (
                                    <div
                                        key={unit.id}
                                        className={`border rounded-lg p-4 transition-all duration-200 ${isSelected
                                            ? 'border-primary bg-primary/5 shadow-sm'
                                            : 'hover:bg-muted/50 hover:border-primary/20'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleUnit(unit.id)}
                                                        className="w-4 h-4 rounded border-primary text-primary focus:ring-primary"
                                                    />
                                                    <span className="font-semibold">{unit.name}</span>
                                                    {inUserPool && unitSource === 'database' && (
                                                        <span className="ml-1 px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded text-[10px] font-bold uppercase">
                                                            Owned
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 mt-1 ml-6">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${unit.rarity === 'Godly' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                                        unit.rarity === 'Mythic' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                            'bg-muted text-muted-foreground border-transparent'
                                                        }`}>
                                                        {unit.rarity}
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground">
                                                        {unit.element}
                                                    </span>
                                                </div>
                                            </div>
                                            {unit.upgrades[level - 1] && (
                                                <div className="text-right text-sm">
                                                    <div className="font-bold font-mono text-primary">
                                                        {Math.round(unit.upgrades[level - 1].dps).toLocaleString('en-US')}
                                                    </div>
                                                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">DPS</div>
                                                </div>
                                            )}
                                        </div>

                                        {isSelected && (
                                            <div className="ml-6 mt-3 pt-3 border-t border-dashed">
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                        Level Configuration
                                                    </label>
                                                    <span className="font-mono font-bold text-sm">
                                                        {level} <span className="text-muted-foreground font-normal">/ {maxLevel}</span>
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max={maxLevel}
                                                    value={level}
                                                    onChange={(e) => updateUnitLevel(unit.id, parseInt(e.target.value))}
                                                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                                />
                                                <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
                                                    <span>MIN</span>
                                                    <span>MAX</span>
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
                    <div className="border rounded-lg p-6 bg-card sticky top-4 shadow-sm">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>Selected Units</span>
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                                {selectedUnits.size}
                            </span>
                        </h3>

                        {selectedUnits.size === 0 ? (
                            <div className="text-center py-8 px-4 border border-dashed rounded-lg bg-muted/20">
                                <p className="text-muted-foreground text-sm">
                                    No units selected yet.
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Select at least 6 units to simulate a full team.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                {Array.from(selectedUnits.entries()).map(([id, level]) => {
                                    const unit = units.find(u => u.id === id);
                                    if (!unit) return null;

                                    return (
                                        <div key={id} className="text-sm flex justify-between items-center p-2 bg-muted/40 rounded border border-transparent hover:border-border transition-colors">
                                            <span className="truncate font-medium">{unit.name}</span>
                                            <span className="text-xs font-mono bg-background px-1.5 py-0.5 rounded border shadow-sm">Lv.{level}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <button
                            onClick={calculateOptimalTeam}
                            disabled={selectedUnits.size < 6 || isCalculating}
                            className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            {isCalculating ? (
                                <>
                                    <span className="animate-spin text-xl">⟳</span> Calculating...
                                </>
                            ) : (
                                `Calculate Best Team`
                            )}
                        </button>

                        {selectedUnits.size < 6 && selectedUnits.size > 0 && (
                            <p className="text-xs text-destructive mt-3 text-center font-medium bg-destructive/10 p-2 rounded">
                                Select {6 - selectedUnits.size} more unit{6 - selectedUnits.size !== 1 ? 's' : ''} to calculate
                            </p>
                        )}
                    </div>
                </div>
            </div >

            {/* Results */}
            {
                result && (
                    <ResultDisplay result={result} selectedUnits={selectedUnits} />
                )
            }
        </div >
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
        <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Team Summary */}
            <div className="border rounded-xl p-8 bg-card shadow-lg">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    <span>✨ Recommended Team</span>
                </h2>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-center">
                        <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-1">Total DPS</div>
                        <div className="text-4xl font-black text-primary font-mono tracking-tight">
                            {Math.round(result.totalDPS).toLocaleString('en-US')}
                        </div>
                    </div>
                    <div className="bg-muted/30 border border-border rounded-xl p-6 text-center">
                        <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-1">Total Cost</div>
                        <div className="text-4xl font-black font-mono tracking-tight">
                            ${result.totalCost.toLocaleString('en-US')}
                        </div>
                    </div>
                    <div className="bg-muted/30 border border-border rounded-xl p-6 text-center">
                        <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-1">Efficiency Score</div>
                        <div className="text-4xl font-black font-mono tracking-tight">
                            {result.avgEfficiency.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Team Members Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamArray.map((member, idx) => {
                        const currentStats = member.unit.upgrades[member.level - 1];
                        const role = determineUnitRole(member.unit);
                        const roleColor =
                            role === 'Support' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                role === 'AoE' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';

                        return (
                            <div key={member.unit.id} className="border rounded-lg overflow-hidden bg-card hover:border-primary/50 transition-colors group">
                                <div className="p-4 border-b bg-muted/30">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs">
                                                {idx + 1}
                                            </div>
                                            <span className="font-bold truncate max-w-[120px]" title={member.unit.name}>
                                                {member.unit.name}
                                            </span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${roleColor}`}>
                                            {role}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="text-xs font-mono bg-background px-1.5 py-0.5 rounded border">
                                            Lv.{member.level}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold font-mono text-lg leading-none">
                                                {Math.round(calculateEffectiveDPS(member.unit, member.level)).toLocaleString('en-US')}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground font-bold uppercase">DPS</div>
                                        </div>
                                    </div>
                                </div>

                                {currentStats && (
                                    <div className="grid grid-cols-2 gap-px bg-border p-px">
                                        <div className="bg-card p-2">
                                            <div className="text-[10px] text-muted-foreground uppercase">Range</div>
                                            <div className="font-mono text-sm font-medium">{currentStats.range}</div>
                                        </div>
                                        <div className="bg-card p-2">
                                            <div className="text-[10px] text-muted-foreground uppercase">SPA</div>
                                            <div className="font-mono text-sm font-medium">{currentStats.spa}s</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Upgrade Recommendations */}
                {upgradeRecommendations.length > 0 && (
                    <div className="border rounded-xl p-6 bg-card h-full flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold mb-1">📈 Upgrade Path</h3>
                            <p className="text-sm text-muted-foreground">
                                Prioritized upgrades based on DPS/Cost efficiency
                            </p>
                        </div>

                        <div className="space-y-4 flex-1">
                            {upgradeRecommendations.map((rec, idx) => (
                                <div key={`${rec.unit.id}-${rec.targetLevel}`} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="font-bold flex items-center gap-2">
                                                <span className="text-muted-foreground text-sm font-normal">#{idx + 1}</span>
                                                {rec.unit.name}
                                            </div>
                                            <div className="text-sm text-muted-foreground ml-6 mt-0.5">
                                                Level {rec.currentLevel} → <span className="text-primary font-bold">{rec.targetLevel}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-lg text-green-600 dark:text-green-400 font-mono">
                                                +{Math.round(rec.dpsGain).toLocaleString('en-US')}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground uppercase font-bold">DPS Gain</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t">
                                        <div>
                                            <span className="text-muted-foreground block mb-0.5">Cost</span>
                                            <span className="font-mono font-medium">${rec.cost.toLocaleString('en-US')}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block mb-0.5">Improvement</span>
                                            <span className="font-mono font-medium text-green-600">+{rec.dpsGainPercent.toFixed(1)}%</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block mb-0.5">Efficiency Star</span>
                                            <span className="flex text-yellow-500 text-xs">
                                                {Array.from({ length: Math.min(3, Math.floor(rec.efficiency)) }).map((_, i) => (
                                                    <span key={i}>⭐</span>
                                                ))}
                                                {rec.efficiency < 1 && <span className="text-muted-foreground opacity-30">⭐</span>}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Data Visualization */}
                <div className="border rounded-xl p-6 bg-card h-full flex flex-col">
                    <h3 className="text-2xl font-bold mb-6">📊 Performance Analysis</h3>

                    <div className="space-y-8 flex-1">
                        <div>
                            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">DPS Distribution</h4>
                            <div className="h-[200px] w-full">
                                <DPSBarChart
                                    team={teamArray.map(m => ({
                                        unit: m.unit,
                                        dps: calculateEffectiveDPS(m.unit, m.level)
                                    }))}
                                />
                            </div>
                        </div>
                        <div className="pt-6 border-t">
                            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">Damage Contribution</h4>
                            <div className="h-[200px] w-full flex justify-center">
                                <DPSPieChart
                                    team={teamArray.map(m => ({
                                        unit: m.unit,
                                        dps: calculateEffectiveDPS(m.unit, m.level)
                                    }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="border rounded-xl p-6 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                    💡 Optimization Tips
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                        Place high-DPS units in strategic positions with good map coverage (corners, U-turns).
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                        Prioritize upgrades with higher Efficiency Stars (⭐) first as they give more damage per dollar spent.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                        Balance your team with different roles. You typically want 1-2 Support units, 1 AoE Clearer, and 3-4 DPS units.
                    </li>
                </ul>
            </div>
        </div>
    );
}
