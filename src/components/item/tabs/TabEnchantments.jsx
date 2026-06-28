import React, { useState } from 'react';
import { ENCHANTMENTS } from '../../../constants/enchantments';
import Toggle from '../../ui/Toggle';
import { Plus, Trash, AlertTriangle } from 'lucide-react';

export default function TabEnchantments({ item, updateItem }) {
  const [enchSearch, setEnchSearch] = useState('');
  const [enchLevel, setEnchLevel] = useState(1);
  const [selectedEnchId, setSelectedEnchId] = useState(ENCHANTMENTS[0]?.id || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAddEnchantment = () => {
    if (!selectedEnchId) return;
    
    const currentEnch = [...(item.enchantments || [])];
    
    // Check if enchantment is already added
    if (currentEnch.some(e => e.id === selectedEnchId)) {
      // update level
      const updated = currentEnch.map(e => 
        e.id === selectedEnchId ? { ...e, level: parseInt(enchLevel, 10) || 1 } : e
      );
      updateItem(item.slot, { enchantments: updated });
    } else {
      currentEnch.push({
        id: selectedEnchId,
        level: parseInt(enchLevel, 10) || 1
      });
      updateItem(item.slot, { enchantments: currentEnch });
    }

    setEnchSearch('');
    setIsDropdownOpen(false);
  };

  const handleRemoveEnchantment = (enchId) => {
    const updated = (item.enchantments || []).filter(e => e.id !== enchId);
    updateItem(item.slot, { enchantments: updated });
  };

  // Filter enchantments list
  const filteredEnchantments = ENCHANTMENTS.filter(e => 
    e.label.toLowerCase().includes(enchSearch.toLowerCase()) || 
    e.id.toLowerCase().includes(enchSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* Adding Section */}
      <div className="bg-zinc-900/30 p-3 rounded border border-zinc-800/40 flex flex-col gap-3">
        <span className="font-semibold text-zinc-400 uppercase tracking-wide text-[10px]">Add Enchantment</span>
        
        <div className="flex gap-2">
          {/* Custom Autocomplete Dropdown Searcher */}
          <div className="flex-1 relative">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full h-8 px-2.5 rounded border border-zinc-800 bg-zinc-800 text-zinc-200 flex items-center justify-between cursor-pointer font-mono"
            >
              <span className="truncate">
                {ENCHANTMENTS.find(e => e.id === selectedEnchId)?.label || 'Select enchantment...'}
              </span>
              <span className="text-zinc-500 text-[10px]">▼</span>
            </div>

            {isDropdownOpen && (
              <div className="absolute z-30 left-0 right-0 mt-1 border border-zinc-800 bg-zinc-900 rounded shadow-xl max-h-40 overflow-y-auto">
                <input
                  type="text"
                  placeholder="Search enchant..."
                  value={enchSearch}
                  onChange={(e) => setEnchSearch(e.target.value)}
                  className="w-full h-8 px-3 border-b border-zinc-800 bg-zinc-950 text-zinc-200 outline-none text-[10px] font-mono"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
                {filteredEnchantments.map(e => (
                  <div
                    key={e.id}
                    onClick={() => {
                      setSelectedEnchId(e.id);
                      setIsDropdownOpen(false);
                      setEnchSearch('');
                    }}
                    className="px-3 py-1.5 hover:bg-zinc-800 cursor-pointer text-[10px] text-zinc-300 hover:text-zinc-100 flex justify-between"
                  >
                    <span>{e.label}</span>
                    <span className="text-zinc-650 text-[9px] font-mono">{e.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Level Selector */}
          <input
            type="number"
            min="1"
            max="255"
            value={enchLevel}
            onChange={(e) => setEnchLevel(parseInt(e.target.value, 10) || 1)}
            className="w-16 h-8 px-2 rounded border border-zinc-800 bg-zinc-800 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-center"
            title="Enchantment Level"
          />

          {/* Add Action button */}
          <button
            type="button"
            onClick={handleAddEnchantment}
            className="px-3 h-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded flex items-center justify-center shrink-0 font-medium transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Enchantment Lists */}
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-zinc-400 uppercase tracking-wide">Placed Enchantments</span>
        
        {item.enchantments && item.enchantments.length > 0 ? (
          <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
            {item.enchantments.map(ench => {
              const label = ENCHANTMENTS.find(e => e.id === ench.id)?.label || ench.id;
              return (
                <div key={ench.id} className="flex justify-between items-center bg-zinc-900/40 px-3 py-2 border border-zinc-850 rounded">
                  <div className="flex gap-2 items-center font-mono">
                    <span className="text-zinc-250 font-medium">{label}</span>
                    <span className="text-zinc-500 text-[10px]">lvl {ench.level}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveEnchantment(ench.id)}
                    className="p-1 rounded hover:bg-red-950/40 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-[10px] text-zinc-500 italic py-2 text-center border border-zinc-900 rounded">
            No enchantments added yet.
          </div>
        )}
      </div>

      {/* Toggles and Warnings */}
      <div className="flex flex-col gap-3.5 border-t border-zinc-800/60 pt-4 mt-2">
        {/* glint override (1.20.5+) */}
        <Toggle
          checked={item.enchantment_glint_override || false}
          onChange={(val) => updateItem(item.slot, { enchantment_glint_override: val })}
          label="Enchantment Glint Override"
          description="Gives the item a glowing enchantment look (requires Minecraft 1.20.5+)."
        />

        {/* hide_enchantments (deprecated warning shown) */}
        <div className="flex flex-col gap-2">
          <Toggle
            checked={item.hide_enchantments || false}
            onChange={(val) => updateItem(item.slot, { hide_enchantments: val })}
            label="Hide Enchantments (Legacy)"
            description="Use hide_enchantments parameter (Deprecated)."
          />
          {item.hide_enchantments && (
            <div className="flex gap-2 p-2.5 rounded bg-amber-950/20 border border-amber-900/30 text-[10px] text-amber-300 leading-relaxed items-start">
              <AlertTriangle size={14} className="shrink-0 text-amber-500 mt-0.5" />
              <span>
                <strong>Warning:</strong> <code>hide_enchantments</code> is legacy and deprecated in DeluxeMenus. 
                Instead, check the <code>HIDE_ENCHANTS</code> option under the **Flags** tab.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
