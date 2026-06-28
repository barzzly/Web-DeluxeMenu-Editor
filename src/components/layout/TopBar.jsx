import React, { useRef, useState } from 'react';
import { useMenuStore } from '../../store/useMenuStore';
import { Undo2, Redo2, Upload, Download, RotateCcw, Edit2 } from 'lucide-react';
import Modal from '../ui/Modal';
import { generateYaml } from '../../utils/yamlGenerator';

export default function TopBar() {
  const {
    menuName,
    setMenuField,
    undo,
    redo,
    past,
    future,
    resetMenu,
    importYaml,
    showToast
  } = useMenuStore();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importFileName, setImportFileName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const fileInputRef = useRef(null);
  const [tempName, setTempName] = useState(menuName);

  const handleSaveName = () => {
    const cleanName = tempName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (cleanName) {
      setMenuField('menuName', cleanName);
    } else {
      setTempName(menuName);
    }
    setIsEditingName(false);
  };

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!/\.(ya?ml)$/i.test(file.name)) {
      showToast('Please choose a .yml or .yaml file.', 'error');
      event.target.value = '';
      return;
    }

    try {
      const text = await file.text();
      setImportText(text);
      setImportFileName(file.name);
      const cleanName = file.name.replace(/\.ya?ml$/i, '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
      if (cleanName) setTempName(cleanName);
    } catch (error) {
      showToast(`Could not read file: ${error.message}`, 'error');
    }
  };

  const handleImport = () => {
    if (!importText.trim()) {
      showToast('Choose a YAML file or paste config text first.', 'error');
      return;
    }
    const success = importYaml(importText);
    if (success) {
      if (tempName && tempName !== menuName) {
        setMenuField('menuName', tempName);
      }
      setIsImportModalOpen(false);
      setImportText('');
      setImportFileName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExport = () => {
    const storeState = useMenuStore.getState();
    const yamlString = generateYaml(storeState);
    
    // Create download link
    const blob = new Blob([yamlString], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${menuName || 'menu'}.yml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('YAML config downloaded!', 'success');
  };

  const handleResetConfirm = () => {
    if (window.confirm('Are you sure you want to reset this menu? All items and settings will be cleared.')) {
      resetMenu();
    }
  };

  return (
    <div className="min-h-14 border-b border-zinc-800 bg-zinc-900 px-3 sm:px-6 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 select-none">
      {/* Left: Brand & Editable File Name */}
      <div className="flex items-center gap-3 sm:gap-6 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-white tracking-wider text-sm shadow shadow-indigo-500/20">
            Bz
          </div>
          <span className="text-sm font-bold tracking-wide uppercase text-zinc-200 hidden sm:inline">Barzz.ly</span>
        </div>

        <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

        {/* Editable Menu Name */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline">dmenu.barzzly.com/</span>
          {isEditingName ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              autoFocus
              className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-100 rounded focus:outline-none focus:border-indigo-500"
            />
          ) : (
            <div 
              className="flex items-center gap-1.5 cursor-pointer group"
              onClick={() => {
                setTempName(menuName);
                setIsEditingName(true);
              }}
            >
              <span className="text-xs font-mono font-medium text-zinc-200 hover:text-zinc-150 transition-colors">
                {menuName}.yml
              </span>
              <Edit2 size={10} className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions and History */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        {/* History controls */}
        <div className="flex items-center border border-zinc-800 rounded bg-zinc-950 p-0.5">
          <button
            onClick={undo}
            disabled={past.length === 0}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={14} />
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 size={14} />
          </button>
        </div>

        <div className="h-4 w-px bg-zinc-800" />

        {/* Operational buttons */}
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="flex items-center gap-1.5 px-3 h-8 text-xs font-medium text-zinc-300 hover:text-zinc-100 border border-zinc-800 bg-zinc-900 rounded hover:bg-zinc-850 transition-colors"
        >
          <Upload size={13} />
          <span>Import</span>
        </button>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 h-8 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded shadow-sm shadow-indigo-600/10 transition-colors"
        >
          <Download size={13} />
          <span>Download</span>
        </button>

        <button
          onClick={handleResetConfirm}
          className="flex items-center gap-1.5 px-3 h-8 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 rounded transition-colors"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>

      {/* Import YAML Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import DeluxeMenus YAML"
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-zinc-400">
            Choose a DeluxeMenus .yml file or paste config text below. Importing replaces the current editor state.
          </p>
          <div className="rounded border border-zinc-800 bg-zinc-950/70 p-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".yml,.yaml,text/yaml,application/x-yaml"
              onChange={handleImportFile}
              className="block w-full text-xs text-zinc-400 file:mr-3 file:rounded file:border-0 file:bg-indigo-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-indigo-500"
            />
            {importFileName && (
              <div className="mt-2 text-[11px] text-emerald-400 font-mono">Loaded {importFileName}</div>
            )}
          </div>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={10}
            placeholder="menu_title: '&8My Menu'&#10;open_command: mymenu&#10;size: 27&#10;items:&#10;  'item_0':&#10;    material: STONE&#10;    slot: 0"
            className="w-full p-3 font-mono text-xs text-zinc-200 bg-zinc-950 border border-zinc-850 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none resize-y"
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsImportModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-750 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
            >
              Import Configuration
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
