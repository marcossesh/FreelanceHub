"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function RevenueBarChart({ data }: { data: { name: string; total: number }[] }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[300px]">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Volume Financeiro (R$)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#000000", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                        cursor={{ fill: "#f9fafb" }}
                        contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}
                        labelStyle={{ color: "#000000", marginBottom: "4px" }}
                    />
                    <Bar dataKey="total" name="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
