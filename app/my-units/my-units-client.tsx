
'use client';

import { useState, useEffect } from 'react';
import { Unit, UserUnit } from '@/lib/types';
import { UserUnitService } from '@/lib/services/user-unit-service';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface MyUnitsClientProps {
    allUnits: Unit[];
}

export default function MyUnitsClient({ allUnits }: MyUnitsClientProps) {
    const [userUnits, setUserUnits] = useState<UserUnit[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editLevel, setEditLevel] = useState<number>(0);

    useEffect(() => {
        // Load initial data
        setUserUnits(UserUnitService.getAll());

        // Listen for updates (if changed from other tabs/components)
        const handleUpdate = () => setUserUnits(UserUnitService.getAll());
        window.addEventListener('user-units-updated', handleUpdate);
        return () => window.removeEventListener('user-units-updated', handleUpdate);
    }, []);

    const handleAddUnit = (unitId: string) => {
        UserUnitService.add(unitId, 1);
        setUserUnits(UserUnitService.getAll());
        setIsAddDialogOpen(false);
        setSearchQuery('');
    };

    const handleRemoveUnit = (instanceId: string) => {
        if (confirm('Are you sure you want to remove this unit from your pool?')) {
            UserUnitService.remove(instanceId);
            setUserUnits(UserUnitService.getAll());
        }
    };

    const startEditing = (unit: UserUnit) => {
        setEditingId(unit.instanceId);
        setEditLevel(unit.level);
    };

    const saveEdit = (instanceId: string) => {
        UserUnitService.update(instanceId, { level: editLevel });
        setUserUnits(UserUnitService.getAll());
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    // Filter units for the "Add" dialog
    const filteredAddUnits = allUnits.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.element.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 20); // Limit to 20 results for performance

    // Helper to get unit details
    const getUnitDetails = (unitId: string) => allUnits.find(u => u.id === unitId);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="text-xl font-semibold">
                    Collection: <span className="text-primary">{userUnits.length}</span> Units
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Add Unit
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Unit to Collection</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search units..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                                {filteredAddUnits.length > 0 ? (
                                    filteredAddUnits.map(unit => (
                                        <div
                                            key={unit.id}
                                            className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer transition-colors border border-transparent hover:border-border"
                                            onClick={() => handleAddUnit(unit.id)}
                                        >
                                            <div className="h-10 w-10 bg-black/20 rounded overflow-hidden flex-shrink-0">
                                                {unit.imageUrl && (
                                                    <img src={unit.imageUrl} alt={unit.name} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate">{unit.name}</div>
                                                <div className="text-xs text-muted-foreground">{unit.rarity}</div>
                                            </div>
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground text-sm">
                                        No units found matching "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {userUnits.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                    <div className="text-muted-foreground mb-4">You haven't added any units yet.</div>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
                        Start Building Your Pool
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {userUnits.map(userUnit => {
                        const details = getUnitDetails(userUnit.unitId);
                        if (!details) return null;

                        const isEditing = editingId === userUnit.instanceId;

                        return (
                            <Card key={userUnit.instanceId} className="overflow-hidden group hover:border-primary/50 transition-colors">
                                <div className="aspect-[3/2] relative bg-black/40 border-b border-border">
                                    {details.imageUrl && (
                                        <>
                                            <div
                                                className="absolute inset-0 bg-cover bg-center opacity-30 blur-md"
                                                style={{ backgroundImage: `url(${details.imageUrl})` }}
                                            />
                                            <img
                                                src={details.imageUrl}
                                                alt={details.name}
                                                className="absolute inset-0 h-full w-full object-contain p-2 z-10"
                                            />
                                        </>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-20" />
                                    <div className="absolute bottom-3 left-3 z-30 right-3">
                                        <div className="text-xs font-bold text-muted-foreground mb-0.5 uppercase tracking-wider">
                                            {details.rarity}
                                        </div>
                                        <div className="font-bold text-white truncate text-lg leading-tight">
                                            {details.name}
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground font-medium uppercase min-w-[32px]">Level</span>
                                            {isEditing ? (
                                                <Input
                                                    type="number"
                                                    className="h-7 w-20 text-center"
                                                    value={editLevel}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLevel(Number(e.target.value))}
                                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                        if (e.key === 'Enter') saveEdit(userUnit.instanceId);
                                                        if (e.key === 'Escape') cancelEdit();
                                                    }}
                                                    autoFocus
                                                    min={1}
                                                    max={details.upgrades.length + 1}
                                                />
                                            ) : (
                                                <span className="font-mono font-bold text-lg">{userUnit.level}</span>
                                            )}
                                        </div>
                                        {isEditing ? (
                                            <div className="flex gap-1">
                                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-green-500 hover:text-green-400" onClick={() => saveEdit(userUnit.instanceId)}>
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-400" onClick={cancelEdit}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => startEditing(userUnit)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1">
                                        <div className="text-xs text-muted-foreground">
                                            {details.upgrades.length} Levels Max
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 -mr-2"
                                            onClick={() => handleRemoveUnit(userUnit.instanceId)}
                                        >
                                            <Trash2 className="h-3 w-3 mr-1" /> Remove
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
