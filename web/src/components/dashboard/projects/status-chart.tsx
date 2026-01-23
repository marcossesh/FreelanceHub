"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";



export function StatusPieChart({ data }: { data: { name: string; value: number; fill: string }[] }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[300px] flex flex-col">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Distribuição de Status</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: "10px", border: "none" }} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
