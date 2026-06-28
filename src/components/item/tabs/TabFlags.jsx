import React from 'react';
import { ITEM_FLAGS } from '../../../constants/itemFlags';
import Toggle from '../../ui/Toggle';

export default function TabFlags({ item, updateItem }) {
  const currentFlags = item.item_flags || [];

  const handleFlagToggle = (flagId, checked) => {
    let updatedFlags = [...currentFlags];
    if (checked) {
      if (!updatedFlags.includes(flagId)) {
        updatedFlags.push(flagId);
      }
    } else {
      updatedFlags = updatedFlags.filter(f => f !== flagId);
    }
    updateItem(item.slot, { item_flags: updatedFlags });
  };

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* Checkbox item flag lists */}
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-zinc-400 uppercase tracking-wide">Item Flags</span>
        <p className="text-[10px] text-zinc-500 italic pb-1">
          Select which components should be hidden from the item's hover description tooltip.
        </p>

        <div className="flex flex-col gap-2.5 bg-zinc-900/10 p-3 rounded border border-zinc-800/40">
          {ITEM_FLAGS.map(flag => {
            const isChecked = currentFlags.includes(flag.id);
            return (
              <label 
                key={flag.id} 
                className="flex items-start gap-2.5 cursor-pointer py-0.5 select-none hover:text-zinc-200 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => handleFlagToggle(flag.id, e.target.checked)}
                  className="accent-indigo-500 rounded border-zinc-700 bg-zinc-850 mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="text-zinc-300 font-mono text-[10px] font-semibold">{flag.id}</span>
                  <span className="text-[9px] text-zinc-500 mt-0.5">{flag.description}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 1.20.5+ hide_tooltip */}
      <div className="border-t border-zinc-800/60 pt-4 mt-1 flex flex-col gap-3">
        <span className="font-semibold text-zinc-400 uppercase tracking-wide text-xs">Advanced Display (1.20.5+)</span>
        
        <Toggle
          checked={item.hide_tooltip || false}
          onChange={(val) => updateItem(item.slot, { hide_tooltip: val })}
          label="Hide Entire Tooltip"
          description="Hides the entire tooltip (name, lore, and traits) when hovered."
        />
      </div>

      {/* 1.21.2+ Custom Models & Styles */}
      <div className="border-t border-zinc-800/60 pt-4 flex flex-col gap-3">
        <span className="font-semibold text-zinc-400 uppercase tracking-wide text-xs">Modern Custom Models (1.21.2+)</span>
        
        <div className="flex flex-col gap-1.5">
          <span className="text-zinc-500 font-medium">Item Model ID (item_model)</span>
          <input
            type="text"
            value={item.item_model || ''}
            onChange={(e) => updateItem(item.slot, { item_model: e.target.value })}
            placeholder="e.g. minecraft:diamond_sword"
            className="w-full h-8 px-2.5 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
          />
          <span className="text-[9px] text-zinc-500">Defines namespaced key model overrides instead of custom_model_data.</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-zinc-500 font-medium">Tooltip Style Key (tooltip_style)</span>
          <input
            type="text"
            value={item.tooltip_style || ''}
            onChange={(e) => updateItem(item.slot, { tooltip_style: e.target.value })}
            placeholder="e.g. my_plugin:custom_style"
            className="w-full h-8 px-2.5 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
          />
          <span className="text-[9px] text-zinc-500">Applies custom rendering styles to item hover popups.</span>
        </div>
      </div>
    </div>
  );
}
