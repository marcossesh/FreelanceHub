"use client";

import { useState } from "react";
import { Link as LinkIcon, Check, Copy, RefreshCw } from "lucide-react";
import { generateShareLink } from "./actions";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export function ShareLink({ projectId, initialToken }: { projectId: string, initialToken?: string | null }) {
    const [token, setToken] = useState(initialToken);
    const [copied, setCopied] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);

    const shareUrl = token ? `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${token}` : null;

    async function handleGenerate() {
        const res = await generateShareLink(projectId);
        if (res.success && res.token) {
            setToken(res.token);
        }
    }

    async function handleRegenerate() {
        setIsRegenerating(true);
        const res = await generateShareLink(projectId);
        if (res.success && res.token) {
            setToken(res.token);
            setCopied(false);
        }
        setIsRegenerating(false);
    }

    function handleCopy() {
        if (shareUrl) {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    return (
        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                <LinkIcon size={16} /> Link Público para Cliente
            </div>

            {!token ? (
                <button
                    onClick={handleGenerate}
                    className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
                >
                    Gerar Link de Acompanhamento
                </button>
            ) : (
                <div className="flex items-center gap-1 w-full">
                    <div className="relative flex-1">
                        <input
                            readOnly
                            value={shareUrl || ""}
                            className="w-full text-xs bg-white border border-blue-200 text-gray-600 pl-3 pr-3 py-2 rounded-lg focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={handleCopy}
                        className="p-2 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex-shrink-0"
                        title="Copiar Link"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>

                    <ConfirmationModal
                        trigger={
                            <button
                                className="p-2 bg-white border border-blue-200 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors flex-shrink-0"
                                title="Gerar novo link (invalida o atual)"
                            >
                                <RefreshCw size={14} />
                            </button>
                        }
                        title="Revogar Link Atual?"
                        description="Ao gerar um novo link, o link antigo deixará de funcionar imediatamente. O cliente perderá o acesso."
                        confirmLabel="Gerar Novo Link"
                        loadingLabel="Gerando..."
                        isLoading={isRegenerating}
                        onConfirm={handleRegenerate}
                        variant="warning"
                    />
                </div>
            )}
            <p className="text-[10px] text-blue-400">
                O cliente poderá ver o status, etapas e faturas sem precisar fazer login.
            </p>
        </div>
    );
}
