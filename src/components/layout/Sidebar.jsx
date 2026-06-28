import React, { useState } from 'react';
import { useMenuStore } from '../../store/useMenuStore';
import { ChevronDown, ChevronRight, Settings, Grid3X3, CircleDot } from 'lucide-react';
import MenuSettings from '../menu/MenuSettings';
import { MinecraftText } from '../../utils/colorPreview';

export default function Sidebar({ style }) {
  const { items, selectedItemId, selectItem } = useMenuStore();
  const [menuConfigOpen, setMenuConfigOpen] = useState(true);
  const [itemListOpen, setItemListOpen] = useState(true);

  // Get all unique items sorted by their primary slot index
  const placedItems = Object.values(items).sort((a, b) => a.slot - b.slot);

  return (
    <div 
      style={style}
      className="w-full lg:w-auto border-r-0 lg:border-r border-zinc-800/80 bg-zinc-900/80 flex flex-col lg:h-full max-h-[42vh] sm:max-h-[46vh] lg:max-h-none overflow-hidden select-none backdrop-blur-xl animate-fadeIn"
    >
      {/* Header Info */}
      <div className="px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/50 flex items-center gap-2">
        <Settings size={14} className="text-zinc-400" />
        <span className="text-xs font-bold tracking-wider uppercase text-zinc-400">Settings & Hierarchy</span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Accordion 1: Menu Config */}
        <div className="border-b border-zinc-800/60">
          <button
            onClick={() => setMenuConfigOpen(!menuConfigOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 hover:bg-zinc-850 transition-colors text-zinc-300 hover:text-zinc-200"
          >
            <div className="flex items-center gap-2">
              <Grid3X3 size={14} className="text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Menu Config</span>
            </div>
            {menuConfigOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          
          {menuConfigOpen && (
            <div className="bg-zinc-900/20 border-t border-zinc-800/30">
              <MenuSettings />
            </div>
          )}
        </div>

        {/* Accordion 2: Item List */}
        <div>
          <button
            onClick={() => setItemListOpen(!itemListOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 hover:bg-zinc-850 transition-colors text-zinc-300 hover:text-zinc-200"
          >
            <div className="flex items-center gap-2">
              <CircleDot size={14} className="text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Items List ({placedItems.length})</span>
            </div>
            {itemListOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          
          {itemListOpen && (
            <div className="p-2 flex flex-col gap-1 max-h-[150px] sm:max-h-[180px] lg:max-h-[300px] overflow-y-auto">
              {placedItems.length === 0 ? (
                <div className="text-[11px] text-zinc-500 text-center py-6">
                  No items placed yet. Click grid to add.
                </div>
              ) : (
                placedItems.map((item) => {
                  const isSelected = selectedItemId === item.id;
                  // Slot text: can be single slot or multiple
                  const slotLabel = item.slots && item.slots.length > 0
                    ? `Slots ${item.slots.join(',')}`
                    : `Slot ${item.slot}`;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => selectItem(item.id)}
                      className={`w-full flex items-start gap-2.5 px-3 py-2 rounded text-left transition-colors text-xs font-mono group ${
                        isSelected 
                          ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-200' 
                          : 'bg-zinc-850/30 border border-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-2 w-full text-[10px]">
                          <span className="font-semibold truncate text-zinc-300 uppercase tracking-wide">
                            {item.id}
                          </span>
                          <span className="text-[9px] text-zinc-500 shrink-0 font-medium font-sans">
                            {slotLabel} p:{item.priority || 0}
                          </span>
                        </div>
                        <div className="truncate text-xs font-sans text-zinc-400">
                          {item.display_name ? (
                            <MinecraftText text={item.display_name} />
                          ) : (
                            <span className="italic text-zinc-650">{item.material}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
