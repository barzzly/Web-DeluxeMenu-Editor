import React, { useEffect } from 'react';
import PanelLayout from './components/layout/PanelLayout';
import { useMenuStore } from './store/useMenuStore';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import ConfirmDialog from './components/ui/ConfirmDialog';

function App() {
  const {
    toast,
    clearToast,
    undo,
    redo,
    selectedSlot,
    removeItem,
    setSelectedSlot
  } = useMenuStore();
  const [slotToClear, setSlotToClear] = React.useState(null);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.isContentEditable
      );

      // Escape key to deselect
      if (e.key === 'Escape') {
        if (!isInput) {
          setSelectedSlot(null);
        } else {
          activeEl.blur();
        }
      }

      // Delete key to clear slot
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput && selectedSlot !== null) {
        e.preventDefault();
        setSlotToClear(selectedSlot);
      }

      // Ctrl + Z (Undo) / Ctrl + Shift + Z (Redo)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (!isInput) {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        }
      }

      // Ctrl + Y (Redo fallback)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        if (!isInput) {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSlot, undo, redo, removeItem, setSelectedSlot]);

  // Toast Auto-dismiss Timer
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  return (
    <div className="app-shell relative w-screen min-h-screen lg:h-screen overflow-x-hidden lg:overflow-hidden">
      {/* Primary Dashboard Panel Layout */}
      <PanelLayout />

      <ConfirmDialog
        isOpen={slotToClear !== null}
        onClose={() => setSlotToClear(null)}
        onConfirm={() => {
          removeItem(slotToClear);
          setSlotToClear(null);
        }}
        title="Clear slot config?"
        message={slotToClear !== null ? `This removes the item configuration for slot ${slotToClear}.` : ''}
        confirmLabel="Clear Config"
        tone="danger"
      />

      {/* Custom Toast Alert Banner */}
      {toast && (
        <div className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-5 sm:right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-lg border border-zinc-800/80 bg-zinc-900/95 shadow-2xl shadow-black/30 text-xs font-medium animate-slideIn backdrop-blur">
          {toast.type === 'success' && (
            <>
              <CheckCircle size={15} className="text-emerald-400" />
              <span className="text-zinc-200">{toast.message}</span>
            </>
          )}
          {toast.type === 'error' && (
            <>
              <AlertCircle size={15} className="text-red-400" />
              <span className="text-red-300 font-mono">{toast.message}</span>
            </>
          )}
          {toast.type === 'info' && (
            <>
              <Info size={15} className="text-sky-400" />
              <span className="text-zinc-300">{toast.message}</span>
            </>
          )}
          <button 
            onClick={clearToast}
            className="ml-2 text-zinc-500 hover:text-zinc-300 transition-colors scale-110"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
