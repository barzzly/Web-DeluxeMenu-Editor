import React from 'react';

export default function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex min-w-0 items-start justify-between gap-4 cursor-pointer py-1.5 select-none">
      <div className="flex min-w-0 flex-col">
        <span className="break-words text-sm font-medium text-zinc-200">{label}</span>
        {description && <span className="break-words text-xs text-zinc-400 mt-0.5">{description}</span>}
      </div>
      <div className="relative mt-1 shrink-0">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)} 
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:bg-white peer-checked:bg-indigo-600 transition-colors"></div>
      </div>
    </label>
  );
}
