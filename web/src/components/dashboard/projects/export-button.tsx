"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, FileText, Table, Download, Check } from "lucide-react";
import { downloadProjectsPDF } from "@/utils/export-pdf";
import { toast } from "sonner";

interface ExportButtonProps {
    projects: any[];
}

const AVAILABLE_FIELDS = [
    { id: "name", label: "Projeto" },
    { id: "client", label: "Cliente" },
    { id: "status", label: "Status" },
    { id: "value", label: "Valor" },
    { id: "description", label: "Descrição" },
    { id: "createdAt", label: "Data" },
];

export function ExportButton({ projects }: ExportButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFields, setSelectedFields] = useState(["name", "client", "status", "value"]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleField = (id: string) => {
        setSelectedFields(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const handleExportCSV = () => {
        if (projects.length === 0) return toast.error("Sem dados para exportar");
        if (selectedFields.length === 0) return toast.error("Selecione ao menos um campo");

        // Headers dinâmicos baseados na seleção
        const activeHeaders = AVAILABLE_FIELDS.filter(f => selectedFields.includes(f.id));
        const headerRow = activeHeaders.map(h => h.label).join(",") + "\n";

        const rows = projects.map(p => {
            return activeHeaders.map(h => {
                if (h.id === 'client') return `"${p.client.name}"`;
                if (h.id === 'createdAt') return `"${new Date(p.createdAt).toLocaleDateString()}"`;
                if (h.id === 'value') return p.value;
                return `"${p[h.id] || ''}"`;
            }).join(",");
        }).join("\n");

        const blob = new Blob(["\ufeff" + headerRow + rows], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `projetos-${Date.now()}.csv`);
        link.click();
        toast.success("CSV gerado com sucesso!");
    };

    const handleExportPDF = () => {
        if (projects.length === 0) return toast.error("Sem dados para exportar");
        if (selectedFields.length === 0) return toast.error("Selecione ao menos um campo");
        try {

            downloadProjectsPDF(projects, selectedFields);
            toast.success("PDF gerado com sucesso!");
        } catch (error) {
            toast.error("Erro ao gerar PDF");
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all font-bold shadow-sm active:scale-95"
            >
                <Download size={18} />
                Exportar
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in zoom-in duration-200">
                    <div className="px-4 pb-2 mb-2 border-b border-gray-50">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Selecionar Campos</span>
                    </div>

                    {/* Lista de Checkboxes Customizada */}
                    <div className="px-2 space-y-1 mb-3">
                        {AVAILABLE_FIELDS.map((field) => (
                            <div
                                key={field.id}
                                onClick={() => toggleField(field.id)}
                                className="flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <span className="text-sm text-gray-600">{field.label}</span>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedFields.includes(field.id) ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                                    {selectedFields.includes(field.id) && <Check size={14} className="text-white" />}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="px-2 pt-2 border-t border-gray-50 space-y-1">
                        <button
                            onClick={handleExportPDF}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-all"
                        >
                            <FileText size={18} className="text-red-500" />
                            Relatório PDF
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-md transition-all"
                        >
                            <Table size={18} className="text-green-600" />
                            Planilha CSV
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
