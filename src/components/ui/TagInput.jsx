import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function TagInput({ tags = [], onChange, placeholder = 'Add item...', numeric = false }) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (val) => {
    const trimmed = val.trim();
    if (!trimmed) return;

    let newTags = [...tags];
    
    // Parse numeric values or range (e.g. 0, 1-8) if numeric
    if (numeric) {
      if (trimmed.includes('-')) {
        // Handle range: "0-8"
        const parts = trimmed.split('-');
        const start = parseInt(parts[0], 10);
        const end = parseInt(parts[1], 10);
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            if (!newTags.includes(i)) newTags.push(i);
          }
        }
      } else {
        const parsed = parseInt(trimmed, 10);
        if (!isNaN(parsed) && !newTags.includes(parsed)) {
          newTags.push(parsed);
        }
      }
    } else {
      if (!newTags.includes(trimmed)) {
        newTags.push(trimmed);
      }
    }

    onChange(newTags);
    setInputValue('');
  };

  const removeTag = (indexToRemove) => {
    const newTags = tags.filter((_, idx) => idx !== indexToRemove);
    onChange(newTags);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="flex min-w-0 max-w-full flex-wrap items-center gap-1.5 p-1.5 min-h-[38px] w-full rounded border border-zinc-800 bg-zinc-800/50 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all">
      {tags.map((tag, idx) => (
        <span 
          key={idx} 
          className="flex min-w-0 max-w-full items-center gap-1 px-2 py-0.5 text-xs bg-zinc-700 hover:bg-zinc-650 text-zinc-100 rounded"
        >
          <span className="truncate">{tag}</span>
          <button 
            type="button"
            onClick={() => removeTag(idx)} 
            className="text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input 
        type="text" 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(inputValue)}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[60px] bg-transparent text-xs text-zinc-200 outline-none placeholder:text-zinc-500"
      />
    </div>
  );
}
