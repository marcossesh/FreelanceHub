"use client";

import { useState } from "react";
import { Plus, CheckCircle, Circle, Trash2, Link as LinkIcon, ExternalLink } from "lucide-react";
import { addProjectStep, toggleStepStatus, deleteProjectStep } from "./actions";

type Step = {
    id: string;
    title: string;
    isCompleted: boolean;
};

export function ProjectSteps({ steps, projectId, canEdit = true }: { steps: Step[], projectId: string, canEdit?: boolean }) {
    const [newStep, setNewStep] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (!newStep.trim()) return;
        setIsAdding(true);
        await addProjectStep(projectId, newStep);
        setNewStep("");
        setIsAdding(false);
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase flex items-center gap-2">
                <CheckCircle size={16} /> Etapas do Projeto
            </h3>

            {/* Lista de Etapas */}
            <ul className="space-y-2">
                {steps.map((step) => (
                    <li key={step.id} className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => toggleStepStatus(step.id, !step.isCompleted)}
                                disabled={!canEdit}
                                className={`transition-colors ${step.isCompleted ? "text-green-500" : "text-gray-300 hover:text-blue-500"}`}
                            >
                                {step.isCompleted ? <CheckCircle size={20} className="fill-current" /> : <Circle size={20} />}
                            </button>
                            <span className={`${step.isCompleted ? "text-gray-400 line-through" : "text-gray-700 font-medium"}`}>
                                {step.title}
                            </span>
                        </div>

                        {canEdit && (
                            <button
                                onClick={() => deleteProjectStep(step.id)}
                                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </li>
                ))}

                {steps.length === 0 && (
                    <li className="text-sm text-gray-400 italic">Nenhuma etapa definida ainda.</li>
                )}
            </ul>

            {/* Adicionar Nova Etapa */}
            {canEdit && (
                <form onSubmit={handleAdd} className="flex gap-2 mt-4">
                    <input
                        type="text"
                        value={newStep}
                        onChange={(e) => setNewStep(e.target.value)}
                        placeholder="Adicionar nova etapa..."
                        className="flex-1 text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={isAdding || !newStep.trim()}
                        className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-black disabled:opacity-50 transition-colors"
                    >
                        <Plus size={18} />
                    </button>
                </form>
            )}
        </div>
    );
}
