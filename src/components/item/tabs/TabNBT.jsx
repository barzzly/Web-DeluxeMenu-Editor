import React from 'react';
import TagInput from '../../ui/TagInput';
import Toggle from '../../ui/Toggle';
import { AlertTriangle } from 'lucide-react';

export default function TabNBT({ item, updateItem }) {
  // Safe helper to extract model data component values
  const comp = item.model_data_component || { strings: [], floats: [], flags: [], colors: [] };

  const handleUpdateComponentField = (field, val) => {
    updateItem(item.slot, {
      model_data_component: {
        ...comp,
        [field]: val
      }
    });
  };

  const handleToggleComponent = (enabled) => {
    if (enabled) {
      updateItem(item.slot, {
        model_data_component: { strings: [], floats: [], flags: [], colors: [] }
      });
    } else {
      updateItem(item.slot, { model_data_component: null });
    }
  };

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-4 text-xs">
      {/* 1.21.4+ Modern Model Data Component section */}
      <div className="flex min-w-0 flex-col gap-3">
        <span className="break-words font-semibold text-zinc-400 uppercase tracking-wide">Modern Model Data Component (1.21.4+)</span>
        <p className="break-words text-[10px] text-zinc-500 leading-relaxed">
          Minecraft 1.21.4 introduced <code>model_data</code> components containing vectors of strings, floats, booleans, and colors.
        </p>

        <div className="min-w-0 bg-zinc-900/20 p-3 rounded border border-zinc-800/40">
          <Toggle
            checked={item.model_data_component !== null && item.model_data_component !== undefined}
            onChange={handleToggleComponent}
            label="Enable Model Data Component"
            description="Use vectors instead of a single custom_model_data integer."
          />
        </div>

        {item.model_data_component && (
          <div className="flex min-w-0 flex-col gap-3.5 bg-zinc-900/10 p-3 rounded border border-zinc-850 animate-fadeIn">
            {/* Strings */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-zinc-400">Strings Vector</span>
              <TagInput
                tags={comp.strings || []}
                onChange={(tags) => handleUpdateComponentField('strings', tags)}
                placeholder="Add string tag..."
              />
            </div>

            {/* Floats */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-zinc-400">Floats Vector</span>
              <TagInput
                tags={comp.floats || []}
                onChange={(tags) => handleUpdateComponentField('floats', tags)}
                placeholder="Add numeric float..."
              />
            </div>

            {/* Flags */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-zinc-400">Flags (true/false) Vector</span>
              <TagInput
                tags={comp.flags || []}
                onChange={(tags) => handleUpdateComponentField('flags', tags)}
                placeholder="Add 'true' or 'false'..."
              />
            </div>

            {/* Colors */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-zinc-400">Colors (R, G, B) Vector</span>
              <TagInput
                tags={comp.colors || []}
                onChange={(tags) => handleUpdateComponentField('colors', tags)}
                placeholder="e.g. 255,0,0..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Legacy Model Data Section */}
      <div className="min-w-0 border-t border-zinc-800/60 pt-4 flex flex-col gap-2.5">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <span className="break-words font-semibold text-zinc-400 uppercase tracking-wide">Legacy Custom Model Data</span>
          {item.model_data !== null && item.model_data !== '' && (
            <span className="text-[9px] px-1 bg-amber-950/20 text-amber-400 border border-amber-900/30 rounded">Deprecated</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <input
            type="number"
            value={item.model_data !== null ? item.model_data : ''}
            onChange={(e) => updateItem(item.slot, { model_data: e.target.value !== '' ? parseInt(e.target.value, 10) : null })}
            placeholder="e.g. 10001"
            className="w-full h-8 px-2.5 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
          />
          <span className="text-[9px] text-zinc-500">Integer ID used in legacy versions (&lt; 1.21.4).</span>
        </div>

        {item.model_data !== null && item.model_data !== '' && (
          <div className="flex gap-2 p-2.5 rounded bg-amber-950/20 border border-amber-900/30 text-[10px] text-amber-300 leading-relaxed items-start">
            <AlertTriangle size={14} className="shrink-0 text-amber-500 mt-0.5" />
            <span>
              <strong>Warning:</strong> Single <code>model_data</code> integer is deprecated in 1.21.4+ in favor of modern <code>model_data_component</code> arrays.
            </span>
          </div>
        )}
      </div>

      {/* Legacy NBT Tag Fields Section */}
      <div className="min-w-0 border-t border-zinc-800/60 pt-4 flex flex-col gap-3">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <span className="break-words font-semibold text-zinc-400 uppercase tracking-wide">Legacy NBT Attributes (&lt; 1.20.5)</span>
          <span className="text-[9px] px-1 bg-amber-950/20 text-amber-400 border border-amber-900/30 rounded">Deprecated</span>
        </div>
        
        <p className="break-words text-[10px] text-zinc-500 leading-relaxed">
          NBT structures are deprecated in modern Minecraft versions in favor of components. Use format <code>key:value</code>.
        </p>

        {/* Strings NBT */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-zinc-400 font-mono">nbt_strings</span>
          <TagInput
            tags={item.nbt_strings || []}
            onChange={(tags) => updateItem(item.slot, { nbt_strings: tags })}
            placeholder="key:value"
          />
        </div>

        {/* Ints NBT */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-zinc-400 font-mono">nbt_ints</span>
          <TagInput
            tags={item.nbt_ints || []}
            onChange={(tags) => updateItem(item.slot, { nbt_ints: tags })}
            placeholder="key:123"
          />
        </div>

        {/* Bytes NBT */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-zinc-400 font-mono">nbt_bytes</span>
          <TagInput
            tags={item.nbt_bytes || []}
            onChange={(tags) => updateItem(item.slot, { nbt_bytes: tags })}
            placeholder="key:1"
          />
        </div>
      </div>
    </div>
  );
}
