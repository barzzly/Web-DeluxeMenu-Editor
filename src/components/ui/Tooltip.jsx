import React from 'react';

export default function Tooltip({ content, children, position = 'top' }) {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  if (!content) return children;

  return (
    <div className="relative group inline-block">
      {children}
      <div className={`absolute z-50 hidden group-hover:block px-2 py-1 text-xs text-zinc-200 bg-zinc-950 border border-zinc-800 rounded shadow-lg whitespace-nowrap pointer-events-none ${positionClasses[position]}`}>
        {content}
      </div>
    </div>
  );
}
