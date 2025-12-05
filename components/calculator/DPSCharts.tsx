'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DPSChartProps {
    team: Array<{ unit: { name: string }; dps: number }>;
}

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#6366f1'];

export function DPSBarChart({ team }: DPSChartProps) {
    const data = team.map((member, idx) => ({
        name: member.unit.name.length > 15
            ? member.unit.name.substring(0, 12) + '...'
            : member.unit.name,
        DPS: Math.round(member.dps),
        fill: COLORS[idx % COLORS.length]
    }));

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="DPS" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function DPSPieChart({ team }: DPSChartProps) {
    const totalDPS = team.reduce((sum, m) => sum + m.dps, 0);

    const data = team.map((member) => ({
        name: member.unit.name,
        value: Math.round(member.dps),
        percentage: ((member.dps / totalDPS) * 100).toFixed(1)
    }));

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, payload }: any) => `${name}: ${payload.percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
