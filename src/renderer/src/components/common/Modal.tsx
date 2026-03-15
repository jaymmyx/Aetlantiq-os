import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            {/* Modal Content Box */}
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/60">
                    <h2 className="text-lg font-medium text-zinc-100">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
};