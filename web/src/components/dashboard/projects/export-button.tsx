"use client";

import { sanitizeDataForExport } from "@/lib/utils/export-helpers";

interface ExportButtonProps {
    projects: any[];
}

export function ExportButton({ projects }: ExportButtonProps) {
    const handleExportCSV = () => {
        const sanitized = sanitizeDataForExport(projects);

        if (sanitized.length === 0) {
            alert("Não há dados para exportar.");
            return;
        }

        const headers = Object.keys(sanitized[0]).join(",");
        const rows = sanitized.map(item => Object.values(item).join(",")).join("\n");
        const csvContent = `${headers}\n${rows}`;

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", `projetos-freelancehub-${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all font-medium shadow-sm"
        >
            Exportar CSV
        </button>
    );
}
