import React from 'react';
import { MinecraftText } from '../../utils/colorPreview';

export default function ColorCodeInput({ 
  label, 
  value = '', 
  onChange, 
  placeholder = '', 
  isTextArea = false,
  rows = 3
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">{label}</span>}
      
      {isTextArea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-3 py-2 text-xs rounded border border-zinc-800 bg-zinc-800/50 text-zinc-200 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all resize-y"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-9 px-3 text-xs rounded border border-zinc-800 bg-zinc-800/50 text-zinc-200 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all"
        />
      )}

      {/* Live Minecraft Color Code Render Box */}
      {value && (
        <div className="mt-1 px-3 py-1.5 rounded bg-zinc-950 border border-zinc-900 text-xs font-medium min-h-[28px] flex items-center leading-relaxed">
          <MinecraftText text={value} />
        </div>
      )}
    </div>
  );
}
