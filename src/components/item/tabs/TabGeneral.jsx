import React, { useState } from 'react';
import { MATERIALS } from '../../../constants/materials';
import ColorCodeInput from '../../ui/ColorCodeInput';
import Toggle from '../../ui/Toggle';
import TagInput from '../../ui/TagInput';
import { MinecraftText } from '../../../utils/colorPreview';

export default function TabGeneral({ item, updateItem }) {
  const [customMaterial, setCustomMaterial] = useState(
    !MATERIALS.includes(item.material) && item.material !== ''
  );
  const [matSearch, setMatSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Material prefix state helpers
  const prefixes = ['head-', 'basehead-', 'hdb-', 'texture-', 'itemsadder-', 'oraxen-', 'nexo-', 'mmoitems-', 'mythicmobs-', 'ecoarmor-', 'executableitems-'];
  
  // Find current prefix if any
  const getActivePrefix = () => {
    const active = prefixes.find(p => item.material && item.material.startsWith(p));
    return active || '';
  };

  const getCleanMaterialName = () => {
    const activePrefix = getActivePrefix();
    if (activePrefix && item.material) {
      return item.material.replace(activePrefix, '');
    }
    return item.material || '';
  };

  const handlePrefixChange = (prefix) => {
    const clean = getCleanMaterialName();
    updateItem(item.slot, { material: prefix + clean });
  };

  const handleMaterialNameChange = (val) => {
    const prefix = getActivePrefix();
    const nextValue = prefix ? val : val.toUpperCase();
    updateItem(item.slot, { material: prefix + nextValue });
  };

  // Filter materials list
  const filteredMaterials = MATERIALS.filter(m => 
    m.toLowerCase().includes(matSearch.toLowerCase())
  ).slice(0, 100);

  // Lore management: textarea, one line per lore entry
  const handleLoreTextChange = (text) => {
    updateItem(item.slot, { lore: text.split('\n') });
  };

  // Color Swatch parser for rgb (format: "R, G, B" or "R,G,B")
  const getRgbStyle = () => {
    if (!item.rgb) return null;
    const parts = item.rgb.split(',').map(p => parseInt(p.trim(), 10));
    if (parts.length === 3 && parts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
      return `rgb(${parts[0]}, ${parts[1]}, ${parts[2]})`;
    }
    return null;
  };

  const rgbBackground = getRgbStyle();

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* Item ID */}
      <div className="flex flex-col gap-1.5">
        <span className="font-semibold text-zinc-400 uppercase tracking-wide">Item ID (YAML key)</span>
        <input
          type="text"
          value={item.id}
          onChange={(e) => updateItem(item.slot, { id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
          placeholder="item_0"
          className="w-full h-8 px-3 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono"
        />
      </div>

      {/* Material */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-zinc-400 uppercase tracking-wide">Material</span>
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={customMaterial}
              onChange={(e) => {
                setCustomMaterial(e.target.checked);
                setIsDropdownOpen(false);
              }}
              className="accent-indigo-500 rounded border-zinc-700 bg-zinc-850"
            />
            <span className="text-[10px] text-zinc-500">Custom / extension item</span>
          </label>
        </div>

        {/* Material Prefix options */}
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => handlePrefixChange('')}
            className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
              getActivePrefix() === ''
                ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400'
                : 'bg-zinc-800 border-transparent text-zinc-400 hover:bg-zinc-750'
            }`}
          >
            none
          </button>
          {prefixes.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => handlePrefixChange(p)}
              className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                getActivePrefix() === p
                  ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400'
                  : 'bg-zinc-800 border-transparent text-zinc-400 hover:bg-zinc-750'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {customMaterial ? (
          <input
            type="text"
            value={getCleanMaterialName()}
            onChange={(e) => handleMaterialNameChange(e.target.value)}
            placeholder={getActivePrefix() ? 'namespace:item_id or item_id' : 'CUSTOM_ITEM_ID'}
            className="w-full h-8 px-3 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono"
          />
        ) : (
          <div className="relative">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full h-8 px-3 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 flex items-center justify-between cursor-pointer font-mono"
            >
              <span className="truncate">{getCleanMaterialName() || 'Select material...'}</span>
              <span className="text-zinc-500 text-[10px]">▼</span>
            </div>

            {isDropdownOpen && (
              <div className="absolute z-30 left-0 right-0 mt-1 border border-zinc-800 bg-zinc-900 rounded shadow-xl max-h-48 overflow-y-auto">
                <input
                  type="text"
                  placeholder="Search material..."
                  value={matSearch}
                  onChange={(e) => setMatSearch(e.target.value)}
                  className="w-full h-8 px-3 border-b border-zinc-800 bg-zinc-950 text-zinc-200 outline-none text-xs font-mono"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
                {filteredMaterials.map(m => (
                  <div
                    key={m}
                    onClick={() => {
                      handleMaterialNameChange(m);
                      setIsDropdownOpen(false);
                      setMatSearch('');
                    }}
                    className="px-3 py-1.5 hover:bg-zinc-800 cursor-pointer font-mono text-[11px] text-zinc-300 hover:text-zinc-100"
                  >
                    {m}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Display Name */}
      <ColorCodeInput
        label="Display Name"
        value={item.display_name}
        onChange={(val) => updateItem(item.slot, { display_name: val })}
        placeholder="e.g. &e&lEpic Sword"
      />

      {/* Lore Lines */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between border-b border-zinc-800/40 pb-1">
          <span className="font-semibold text-zinc-400 uppercase tracking-wide">Lore Lines</span>
          <span className="text-[10px] text-zinc-500">One line per row (Enter = new line)</span>
        </div>

        <textarea
          value={(item.lore || []).join('\n')}
          onChange={(e) => handleLoreTextChange(e.target.value)}
          placeholder={`e.g. &7A powerful weapon\n&eDamage: &c+10`}
          rows={5}
          className="w-full px-3 py-2 text-xs rounded border border-zinc-800 bg-zinc-800/50 text-zinc-200 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all resize-y font-mono leading-relaxed"
        />

        {/* Live preview */}
        {item.lore && item.lore.length > 0 && item.lore.some((l) => l !== '') && (
          <div className="mt-1 px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-xs font-medium flex flex-col gap-0.5 leading-relaxed">
            {item.lore.map((line, idx) => (
              <MinecraftText key={idx} text={line} />
            ))}
          </div>
        )}
      </div>

      {/* Grid: Coordinates & Priority */}
      <div className="grid grid-cols-2 gap-3 mt-1">
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-zinc-400 uppercase tracking-wide">Main Slot</span>
          <input
            type="number"
            min="0"
            value={item.slot}
            onChange={(e) => updateItem(item.slot, { slot: e.target.value ? parseInt(e.target.value, 10) : 0 })}
            className="w-full h-8 px-3 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-zinc-400 uppercase tracking-wide">Priority</span>
          <input
            type="number"
            min="0"
            value={item.priority || 0}
            onChange={(e) => updateItem(item.slot, { priority: parseInt(e.target.value, 10) || 0 })}
            className="w-full h-8 px-3 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      </div>

      {/* Multi slot tag input */}
      <div className="flex flex-col gap-1.5">
        <span className="font-semibold text-zinc-400 uppercase tracking-wide">Multi-slots</span>
        <TagInput
          tags={item.slots || []}
          onChange={(newTags) => updateItem(item.slot, { slots: newTags })}
          placeholder="e.g. 0, 1-8"
          numeric={true}
        />
        <span className="text-[10px] text-zinc-500">Allows placing item in multiple coordinates (e.g. 0-8).</span>
      </div>

      {/* Grid: Amount & Damage */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5 col-span-1">
          <span className="font-semibold text-zinc-400 uppercase tracking-wide">Amount</span>
          <input
            type="number"
            min="1"
            max="64"
            value={item.amount || 1}
            onChange={(e) => updateItem(item.slot, { amount: parseInt(e.target.value, 10) || 1 })}
            className="w-full h-8 px-3 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="flex flex-col gap-1.5 col-span-2">
          <span className="font-semibold text-zinc-400 uppercase tracking-wide">Dynamic Amount</span>
          <input
            type="text"
            value={item.dynamic_amount || ''}
            onChange={(e) => updateItem(item.slot, { dynamic_amount: e.target.value })}
            placeholder="%placeholder%"
            className="w-full h-8 px-3 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-zinc-400 uppercase tracking-wide">Damage (Durability)</span>
          <input
            type="number"
            min="0"
            value={item.damage || 0}
            onChange={(e) => updateItem(item.slot, { damage: parseInt(e.target.value, 10) || 0 })}
            className="w-full h-8 px-3 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-zinc-400 uppercase tracking-wide">Rarity Accent</span>
          <select
            value={item.rarity || ''}
            onChange={(e) => updateItem(item.slot, { rarity: e.target.value })}
            className="w-full h-8 px-3 rounded border border-zinc-800 bg-zinc-800 text-zinc-200 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">None</option>
            <option value="COMMON">Common</option>
            <option value="UNCOMMON">Uncommon</option>
            <option value="RARE">Rare</option>
            <option value="EPIC">Epic</option>
          </select>
        </div>
      </div>

      {/* Leather armor RGB format input */}
      <div className="flex flex-col gap-1.5">
        <span className="font-semibold text-zinc-400 uppercase tracking-wide">Leather RGB Color</span>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={item.rgb || ''}
            onChange={(e) => updateItem(item.slot, { rgb: e.target.value })}
            placeholder="e.g. 255, 0, 128"
            className="w-full h-8 px-3 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono flex-1"
          />
          {rgbBackground && (
            <div 
              style={{ backgroundColor: rgbBackground }} 
              className="w-8 h-8 rounded border border-zinc-800 shrink-0 shadow-sm"
              title={item.rgb}
            />
          )}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-2.5 border-t border-zinc-800/60 pt-4 mt-2">
        <Toggle
          checked={item.update}
          onChange={(val) => updateItem(item.slot, { update: val })}
          label="Auto Update Placeholders"
          description="Updates placeholders dynamically in name/lore on tick."
        />
        <Toggle
          checked={item.unbreakable}
          onChange={(val) => updateItem(item.slot, { unbreakable: val })}
          label="Unbreakable Item"
          description="Makes weapons/armor unbreakable."
        />
      </div>
    </div>
  );
}
