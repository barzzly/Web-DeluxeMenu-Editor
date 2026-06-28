import React, { useState } from 'react';
import { useMenuStore, getItemAtSlot, getItemsAtSlot } from '../../store/useMenuStore';
import TabGeneral from './tabs/TabGeneral';
import TabCommands from './tabs/TabCommands';
import TabRequirements from './tabs/TabRequirements';
import TabEnchantments from './tabs/TabEnchantments';
import TabFlags from './tabs/TabFlags';
import TabNBT from './tabs/TabNBT';
import TabAdvanced from './tabs/TabAdvanced';
import { X, Trash2, Box } from 'lucide-react';

export default function ItemEditor() {
  const { selectedSlot, selectedItemId, items, updateItem, removeItem, addItemAtSlot, setSelectedSlot, selectItem, showToast } = useMenuStore();
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'commands' | 'requirements' | 'enchantments' | 'flags' | 'nbt' | 'advanced'

  const slotItems = getItemsAtSlot(items, selectedSlot);
  const currentItem = getItemAtSlot(items, selectedSlot, selectedItemId);

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'commands', label: 'Actions' },
    { id: 'requirements', label: 'Reqs' },
    { id: 'enchantments', label: 'Enchants' },
    { id: 'flags', label: 'Flags' },
    { id: 'nbt', label: 'NBT / Model' },
    { id: 'advanced', label: 'Advanced' }
  ];

  const handleCreateItem = () => {
    if (selectedSlot !== null) {
      addItemAtSlot(selectedSlot);
      showToast(`Created new item at slot ${selectedSlot}`, 'success');
    }
  };

  const handleClearConfirm = () => {
    if (window.confirm(`Are you sure you want to clear the item configuration for slot ${selectedSlot}?`)) {
      removeItem(selectedSlot);
      showToast(`Cleared slot ${selectedSlot}`, 'info');
    }
  };

  if (selectedSlot === null) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-zinc-900 border-l border-zinc-800 select-none">
      {/* Editor Panel Header */}
      <div className="h-14 px-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Editor Panel</span>
          <span className="text-xs font-semibold text-zinc-200">Slot Index #{selectedSlot}</span>
        </div>
        <button
          onClick={() => setSelectedSlot(null)}
          className="p-1 rounded text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          title="Deselect slot (Esc)"
        >
          <X size={16} />
        </button>
      </div>

      {/* If slot is empty, show initialization screen */}
      {!currentItem ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none bg-zinc-950/20">
          <Box size={36} className="text-zinc-600 mb-3 animate-pulse" />
          <h4 className="text-sm font-semibold text-zinc-300">Empty Slot</h4>
          <p className="text-[11px] text-zinc-500 max-w-[200px] mt-1 leading-relaxed">
            There is no item configuration set in this chest coordinate yet.
          </p>
          <button
            onClick={handleCreateItem}
            className="mt-4 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded shadow-md shadow-indigo-600/10 transition-colors"
          >
            Create Item Configuration
          </button>
        </div>
      ) : (
        <>
          {slotItems.length > 1 && (
            <div className="px-3 py-2 border-b border-zinc-800 bg-zinc-950/30 flex gap-1.5 overflow-x-auto shrink-0">
              {slotItems.map((slotItem) => (
                <button
                  key={slotItem.id}
                  type="button"
                  onClick={() => selectItem(slotItem.id)}
                  className={`px-2 py-1 rounded border text-[10px] font-mono whitespace-nowrap ${
                    currentItem?.id === slotItem.id
                      ? 'border-indigo-500/50 bg-indigo-600/15 text-indigo-300'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                  title={`priority ${slotItem.priority || 0}`}
                >
                  {slotItem.id} p:{slotItem.priority || 0}
                </button>
              ))}
            </div>
          )}
          {/* Tabs Navigation Row */}
          <div className="h-10 border-b border-zinc-800 bg-zinc-900/30 flex overflow-x-auto scrollbar-none shrink-0">
            {tabs.map(t => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 text-[10px] font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'border-indigo-500 text-indigo-400 bg-zinc-850/50'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-850/20'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Form Work Area (Scrollable text fields) */}
          <div className="flex-1 overflow-y-auto p-4 select-text">
            {activeTab === 'general' && (
              <TabGeneral item={currentItem} updateItem={updateItem} />
            )}
            {activeTab === 'commands' && (
              <TabCommands item={currentItem} updateItem={updateItem} />
            )}
            {activeTab === 'requirements' && (
              <TabRequirements item={currentItem} updateItem={updateItem} />
            )}
            {activeTab === 'enchantments' && (
              <TabEnchantments item={currentItem} updateItem={updateItem} />
            )}
            {activeTab === 'flags' && (
              <TabFlags item={currentItem} updateItem={updateItem} />
            )}
            {activeTab === 'nbt' && (
              <TabNBT item={currentItem} updateItem={updateItem} />
            )}
            {activeTab === 'advanced' && (
              <TabAdvanced item={currentItem} updateItem={updateItem} />
            )}
          </div>

          {/* Bottom Actions Footer */}
          <div className="p-3 border-t border-zinc-800 bg-zinc-900/50 shrink-0 flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 font-mono">
              ID: {currentItem.id}
            </span>
            <button
              onClick={handleClearConfirm}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 rounded transition-all shadow-sm shadow-red-950/10"
            >
              <Trash2 size={12} />
              <span>Clear Config</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
