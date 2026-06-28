import React, { useEffect, useId } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  const titleId = useId();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh] sm:pt-[10vh]">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative w-full ${maxWidth} overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-2xl transition-all max-h-[82vh] flex flex-col animate-panelIn`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 bg-zinc-900/50">
          <h3 id={titleId} className="text-base font-semibold text-zinc-100">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 text-sm text-zinc-300">
          {children}
        </div>
      </div>
    </div>
  );
}