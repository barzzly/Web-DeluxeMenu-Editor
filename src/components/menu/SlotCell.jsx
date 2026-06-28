import React from 'react';
import { useMenuStore } from '../../store/useMenuStore';
import { MinecraftText } from '../../utils/colorPreview';

export default function SlotCell({ 
  slotIndex, 
  item, 
  itemCount = 0,
  isSelected, 
  onContextMenuOpen,
  onDragStart,
  onDragOver,
  onDrop
}) {
  const { setSelectedSlot } = useMenuStore();

  const handleSelect = (e) => {
    e.preventDefault();
    setSelectedSlot(slotIndex);
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    onContextMenuOpen(e, slotIndex);
  };

  const isLink = item && item.slot !== slotIndex;

  // Shorten material name for visual fit
  const getShortMaterial = (mat) => {
    if (!mat) return '';
    const clean = mat.replace('LEGACY_', '').replace('MINECRAFT_', '');
    if (clean.length > 9) {
      return clean.substring(0, 7) + '..';
    }
    return clean;
  };

  return (
    <div
      onClick={handleSelect}
      onContextMenu={handleRightClick}
      draggable={item !== null && !isLink}
      onDragStart={(e) => onDragStart(e, slotIndex)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, slotIndex)}
      className={`w-[52px] h-[52px] relative flex flex-col items-center justify-center cursor-pointer select-none group font-sans border-2 transition-all ${
        isSelected
          ? 'border-indigo-500 bg-indigo-950/40 text-zinc-100 z-10 scale-105 shadow-md shadow-indigo-500/25'
          : item
            ? isLink
              ? 'border-t-zinc-950 border-l-zinc-950 border-b-zinc-800 border-r-zinc-800 bg-zinc-900/30 text-zinc-500 opacity-60 hover:opacity-90'
              : 'border-t-zinc-950 border-l-zinc-950 border-b-zinc-700 border-r-zinc-700 bg-zinc-800/40 text-zinc-300 hover:bg-zinc-800/70 hover:border-b-zinc-650 hover:border-r-zinc-650'
            : 'border-t-zinc-950 border-l-zinc-950 border-b-zinc-800 border-r-zinc-800 bg-zinc-900/60 text-zinc-600 hover:border-b-zinc-700 hover:border-r-zinc-700 hover:bg-zinc-850/30'
      }`}
    >
      {/* Slot Coordinate label */}
      <span className="absolute top-[2px] left-[4px] text-[8px] font-mono text-zinc-500 group-hover:text-zinc-400 font-semibold leading-none">
        {slotIndex}
      </span>

      {/* Render content based on item existence */}
      {item ? (
        <div className="flex flex-col items-center justify-center w-full px-0.5 text-center mt-1">
          {/* Material code */}
          <span className="text-[8px] font-semibold tracking-wider font-mono text-indigo-400 uppercase truncate max-w-full leading-none">
            {getShortMaterial(item.material)}
          </span>
          
          {/* Minecraft formatted name */}
          <div className="text-[9px] truncate max-w-full font-medium mt-[2px] text-zinc-300 leading-tight">
            {item.display_name ? (
              <MinecraftText text={item.display_name} />
            ) : (
              <span className="text-zinc-500 italic text-[8px]">No Name</span>
            )}
          </div>

          {/* Linked item tag */}
          {isLink && (
            <span className="absolute top-[2px] right-[2px] text-[7px] bg-zinc-950 text-zinc-500 px-0.5 rounded leading-none scale-75">
              link
            </span>
          )}

          {itemCount > 1 && (
            <span className="absolute top-[2px] right-[2px] text-[8px] font-bold font-mono text-indigo-200 bg-indigo-600/80 px-1 rounded leading-none">
              x{itemCount}
            </span>
          )}

          {/* Amount Badge */}
          {item.amount > 1 && (
            <span className="absolute bottom-[2px] right-[2px] text-[9px] font-bold font-mono text-yellow-400 bg-zinc-950/80 px-0.5 rounded leading-none">
              {item.amount}
            </span>
          )}
        </div>
      ) : (
        <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 text-zinc-500 transition-opacity">
          +
        </span>
      )}
    </div>
  );
}
