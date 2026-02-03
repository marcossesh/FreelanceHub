// web/src/components/ui/toast.tsx
"use client";

import { useEffect, useState } from "react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

export function Toast({ message, type = "info", duration = 5000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        info: <Info size={20} />,
    };

    const styles = {
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
    };

    return (
        <div
            className={`fixed top-4 right-4 z-[60] transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                }`}
        >
            <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-md ${styles[type]}`}
            >
                <div className="flex-shrink-0">{icons[type]}</div>
                <p className="flex-1 text-sm font-medium">{message}</p>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}

// Hook for managing toasts
export function useToast() {
    const [toast, setToast] = useState<{
        message: string;
        type: ToastType;
    } | null>(null);

    const showToast = (message: string, type: ToastType = "info") => {
        setToast({ message, type });
    };

    const hideToast = () => {
        setToast(null);
    };

    return { toast, showToast, hideToast };
}
