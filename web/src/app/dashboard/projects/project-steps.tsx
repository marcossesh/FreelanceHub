"use client";

import { useState } from "react";
import {
    Plus, CheckCircle, Circle, Trash2, Link as LinkIcon, ChevronDown,
    ChevronUp, Calendar, FileText, Paperclip, ExternalLink
} from "lucide-react";
import { addProjectStep, toggleStepStatus, deleteProjectStep } from "./actions";

type Step = {
    id: string;
    title: string;
    description?: string | null;
    attachmentUrl?: string | null;
    isCompleted: boolean;
    createdAt: Date;
    completedAt?: Date | null;
};

export function ProjectSteps({ steps, projectId, canEdit = true }: { steps: Step[], projectId: string, canEdit?: boolean }) {
    const [newStepTitle, setNewStepTitle] = useState("");
    const [newStepDesc, setNewStepDesc] = useState("");
    const [newStepLink, setNewStepLink] = useState("");
    const [isFormExpanded, setIsFormExpanded] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (!newStepTitle.trim()) return;

        setIsAdding(true);
        await addProjectStep(projectId, newStepTitle, newStepDesc, newStepLink);

        setNewStepTitle("");
        setNewStepDesc("");
        setNewStepLink("");
        setIsFormExpanded(false);
        setIsAdding(false);
    }

    const toggleExpand = (id: string) => {
        setExpandedStepId(expandedStepId === id ? null : id);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase flex items-center gap-2">
                <CheckCircle size={16} /> Etapas e Entregas
            </h3>

            {/* Lista de Etapas */}
            <ul className="space-y-3">
                {steps.map((step) => {
                    const isExpanded = expandedStepId === step.id;

                    return (
                        <li key={step.id} className={`group rounded-xl border transition-all overflow-hidden ${step.isCompleted
                            ? "bg-gray-50 border-gray-100"
                            : "bg-white border-gray-200 shadow-sm hover:border-blue-200"
                            }`}>
                            {/* Cabeçalho da Etapa (Sempre visível) */}
                            <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleExpand(step.id)}>
                                <div className="flex items-center gap-4 flex-1">
                                    {/* Checkbox (Não propaga o click para o expand) */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleStepStatus(step.id, !step.isCompleted);
                                        }}
                                        disabled={!canEdit}
                                        className={`transition-colors flex-shrink-0 ${step.isCompleted ? "text-green-500" : "text-gray-300 hover:text-blue-500"}`}
                                    >
                                        {step.isCompleted ? <CheckCircle size={22} className="fill-current" /> : <Circle size={22} />}
                                    </button>

                                    <div className="flex-1">
                                        <p className={`font-medium text-sm transition-colors ${step.isCompleted ? "text-gray-400 line-through" : "text-gray-900"}`}>
                                            {step.title}
                                        </p>
                                        {/* Meta info resumida */}
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <Calendar size={10} />
                                                {new Date(step.createdAt).toLocaleDateString('pt-BR')}
                                            </span>
                                            {(step.description || step.attachmentUrl) && (
                                                <span className="text-[10px] text-blue-500 font-medium flex items-center gap-1">
                                                    Ver detalhes
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {canEdit && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteProjectStep(step.id);
                                            }}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Excluir etapa"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                    <div className={`transform transition-transform duration-200 text-gray-400 ${isExpanded ? 'rotate-180' : ''}`}>
                                        <ChevronDown size={18} />
                                    </div>
                                </div>
                            </div>

                            {/* Área de Detalhes (Acordeão) */}
                            {isExpanded && (
                                <div className="px-4 pb-4 pt-0 pl-12 space-y-3 text-sm border-t border-gray-50 bg-gray-50/50">
                                    <div className="mt-3 grid gap-3">
                                        {/* Descrição */}
                                        {step.description ? (
                                            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                                {step.description}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">Sem descrição adicional.</span>
                                        )}

                                        {/* Anexo */}
                                        {step.attachmentUrl && (
                                            <a
                                                href={step.attachmentUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:underline w-fit p-2 bg-blue-50 rounded-lg border border-blue-100"
                                            >
                                                <Paperclip size={14} />
                                                <span className="text-xs font-bold">Abrir Anexo / Link</span>
                                                <ExternalLink size={10} />
                                            </a>
                                        )}

                                        {/* Datas Detalhadas */}
                                        <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100">
                                            <span>Criado em: {new Date(step.createdAt).toLocaleString('pt-BR')}</span>
                                            {step.isCompleted && step.completedAt && (
                                                <span className="text-green-600 font-medium">
                                                    Concluído em: {new Date(step.completedAt).toLocaleString('pt-BR')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>
                    )
                })}

                {steps.length === 0 && (
                    <li className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-sm">Nenhuma etapa definida ainda.</p>
                        <p className="text-gray-400 text-xs mt-1">Adicione tarefas para organizar o progresso.</p>
                    </li>
                )}
            </ul>

            {/* Formulário de Adição */}
            {canEdit && (
                <div className={`bg-gray-50 rounded-xl border transition-all duration-300 ${isFormExpanded ? 'border-blue-200 shadow-md p-4' : 'border-transparent p-0'}`}>
                    <form onSubmit={handleAdd} className="space-y-3">
                        {/* Input Principal */}
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={newStepTitle}
                                onChange={(e) => setNewStepTitle(e.target.value)}
                                onFocus={() => setIsFormExpanded(true)}
                                placeholder="Adicionar nova etapa..."
                                className="flex-1 text-sm px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={isAdding || !newStepTitle.trim()}
                                className={`px-4 py-2 rounded-lg font-medium flex items-center transition-all shadow-sm
                                    ${!newStepTitle.trim()
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                    }
                                `}
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        {/* Campos Extras (Só aparecem ao focar/expandir) */}
                        {isFormExpanded && (
                            <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block ml-1">Descrição (Opcional)</label>
                                    <textarea
                                        value={newStepDesc}
                                        onChange={(e) => setNewStepDesc(e.target.value)}
                                        placeholder="Detalhes técnicos, requisitos ou observações..."
                                        rows={3}
                                        className="w-full text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block ml-1">Link / Anexo (Opcional)</label>
                                    <div className="relative">
                                        <LinkIcon size={14} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="url"
                                            value={newStepLink}
                                            onChange={(e) => setNewStepLink(e.target.value)}
                                            placeholder="https://figma.com/..."
                                            className="w-full text-sm pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormExpanded(false)}
                                        className="text-xs text-gray-500 hover:text-gray-800 underline mr-4"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
}
