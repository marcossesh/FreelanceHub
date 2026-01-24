"use client";

import { useState } from "react";
import { Link as LinkIcon, Check, Copy } from "lucide-react";
import { generateShareLink } from "./actions";

export function ShareLink({ projectId, initialToken }: { projectId: string, initialToken?: string | null }) {
    const [token, setToken] = useState(initialToken);
    const [copied, setCopied] = useState(false);

    const shareUrl = token ? `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${token}` : null;

    async function handleGenerate() {
        const res = await generateShareLink(projectId);
        if (res.success && res.token) {
            setToken(res.token);
        }
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
                <div className="flex gap-2">
                    <input
                        readOnly
                        value={shareUrl || ""}
                        className="flex-1 text-xs bg-white border border-blue-200 text-gray-600 px-3 rounded-lg focus:outline-none"
                    />
                    <button
                        onClick={handleCopy}
                        className="p-2 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Copiar Link"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>
            )}
            <p className="text-[10px] text-blue-400">
                O cliente poderá ver o status, etapas e faturas sem precisar fazer login.
            </p>
        </div>
    );
}
