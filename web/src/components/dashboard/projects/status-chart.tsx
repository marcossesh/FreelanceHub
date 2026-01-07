"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#3b82f6", "#f59e0b", "#10b981"];

export function StatusPieChart({ data }: { data: { name: string; value: number }[] }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[300px] flex flex-col">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Distribuição de Status</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: "10px", border: "none" }} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
