
import { UserUnit } from '@/lib/types';

const STORAGE_KEY = 'als_user_units';

export class UserUnitService {
    static getAll(): UserUnit[] {
        if (typeof window === 'undefined') return [];

        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading user units:', error);
            return [];
        }
    }

    static add(unitId: string, level: number = 1): UserUnit {
        const units = this.getAll();
        const newUnit: UserUnit = {
            instanceId: crypto.randomUUID(),
            unitId,
            level
        };

        units.push(newUnit);
        this.save(units);
        return newUnit;
    }

    static update(instanceId: string, updates: Partial<UserUnit>): UserUnit | null {
        const units = this.getAll();
        const index = units.findIndex(u => u.instanceId === instanceId);

        if (index === -1) return null;

        units[index] = { ...units[index], ...updates };
        this.save(units);
        return units[index];
    }

    static remove(instanceId: string): boolean {
        const units = this.getAll();
        const initialLength = units.length;
        const filtered = units.filter(u => u.instanceId !== instanceId);

        if (filtered.length === initialLength) return false;

        this.save(filtered);
        return true;
    }

    private static save(units: UserUnit[]): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(units));
            // Dispatch event for cross-component updates
            window.dispatchEvent(new Event('user-units-updated'));
        } catch (error) {
            console.error('Error saving user units:', error);
        }
    }
}
