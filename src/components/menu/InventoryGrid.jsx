import React, { useState, useEffect } from 'react';
import { useMenuStore, getItemAtSlot, getItemsAtSlot } from '../../store/useMenuStore';
import SlotCell from './SlotCell';
import Modal from '../ui/Modal';
import { Copy, Trash, Edit2 } from 'lucide-react';
import { MinecraftText } from '../../utils/colorPreview';

export default function InventoryGrid() {
  const {
    size,
    items,
    selectedSlot,
    setSelectedSlot,
    setItem,
    addItemAtSlot,
    removeItem,
    moveItem,
    showToast,
    menu_title,
    inventory_type
  } = useMenuStore();

  // Context Menu State
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, slotIndex: null });
  // Duplicate Modal State
  const [duplicateModal, setDuplicateModal] = useState({ isOpen: false, sourceSlot: null, targetSlot: '' });

  const layout = { count: size || 27, gridCols: 'grid-cols-9' };

  // Close context menu on window click
  useEffect(() => {
    const handleClose = () => {
      if (contextMenu.show) {
        setContextMenu({ ...contextMenu, show: false });
      }
    };
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [contextMenu.show]);

  // Context menu trigger
  const handleContextMenuOpen = (e, slotIndex) => {
    setContextMenu({
      show: true,
      x: e.pageX,
      y: e.pageY,
      slotIndex
    });
  };

  // Drag and Drop
  const handleDragStart = (e, slotIndex) => {
    e.dataTransfer.setData('text/plain', slotIndex.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetSlotIndex) => {
    e.preventDefault();
    const sourceSlot = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(sourceSlot) && sourceSlot !== targetSlotIndex) {
      moveItem(sourceSlot, targetSlotIndex);
      showToast(`Moved item to slot ${targetSlotIndex}`, 'info');
    }
  };

  // Quick operations from context menu
  const handleEdit = () => {
    setSelectedSlot(contextMenu.slotIndex);
  };

  const handleClear = () => {
    if (contextMenu.slotIndex !== null) {
      removeItem(contextMenu.slotIndex);
      showToast(`Cleared slot ${contextMenu.slotIndex}`, 'info');
    }
  };

  const handleOpenDuplicate = () => {
    setDuplicateModal({
      isOpen: true,
      sourceSlot: contextMenu.slotIndex,
      targetSlot: ''
    });
  };

  const handleAddVariant = () => {
    if (contextMenu.slotIndex === null) return;
    addItemAtSlot(contextMenu.slotIndex);
    showToast(`Added priority variant at slot ${contextMenu.slotIndex}`, 'success');
  };

  const handleConfirmDuplicate = () => {
    const target = parseInt(duplicateModal.targetSlot, 10);
    const source = duplicateModal.sourceSlot;
    
    if (isNaN(target) || target < 0 || target >= layout.count) {
      showToast(`Invalid target slot! Enter a number between 0 and ${layout.count - 1}`, 'error');
      return;
    }

    if (target === source) {
      showToast('Cannot duplicate item to the same slot!', 'error');
      return;
    }

    const sourceItem = getItemAtSlot(items, source);
    if (!sourceItem) return;

    // Create copy with new slot index and adjusted id
    const newItem = {
      ...JSON.parse(JSON.stringify(sourceItem)),
      slot: target,
      id: sourceItem.id === `item_${source}` ? `item_${target}` : `${sourceItem.id}_copy`
    };

    setItem(target, newItem);
    setSelectedSlot(target);
    setDuplicateModal({ isOpen: false, sourceSlot: null, targetSlot: '' });
    showToast(`Duplicated to slot ${target}`, 'success');
  };

  // Build cells array
  const cells = [];
  for (let i = 0; i < layout.count; i++) {
    const slotItems = getItemsAtSlot(items, i);
    const item = slotItems[0] || null;
    cells.push(
      <SlotCell
        key={i}
        slotIndex={i}
        item={item}
        itemCount={slotItems.length}
        isSelected={selectedSlot === i}
        onContextMenuOpen={handleContextMenuOpen}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
    );
  }

  return (
    <div className="relative flex flex-col items-center select-none animate-fadeIn">
      {/* Visual Chest Container (Minecraft UI Texture mimic) */}
      <div className="bg-zinc-800 border-[4px] border-t-zinc-600 border-l-zinc-600 border-r-zinc-950 border-b-zinc-950 p-4 rounded shadow-2xl flex flex-col gap-3 min-w-[380px]">
        {/* Chest GUI Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-2 px-1">
          <span className="text-xs font-bold tracking-wide font-sans text-zinc-300">
            <MinecraftText text={menu_title || 'Chest'} />
          </span>
          <span className="text-[10px] text-zinc-500 font-mono font-semibold uppercase tracking-wider scale-90 shrink-0">
            {inventory_type} ({layout.count})
          </span>
        </div>

        {/* Chest Slots Grid */}
        <div className="bg-zinc-950 p-1 rounded border border-zinc-950">
          <div className={`grid ${layout.gridCols} gap-[2px]`}>
            {cells}
          </div>
        </div>
      </div>

      <div className="mt-4 text-[10px] text-zinc-500 font-mono text-center max-w-sm">
        Left-click slot to edit. Right-click for options. Drag items to rearrange them.
      </div>

      {/* Floating Context Menu */}
      {contextMenu.show && (
        <div 
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed z-50 min-w-[120px] bg-zinc-900 border border-zinc-800 rounded shadow-2xl py-1 text-xs select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => { handleEdit(); setContextMenu({ ...contextMenu, show: false }); }}
            className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 flex items-center gap-2"
          >
            <Edit2 size={12} className="text-zinc-500" />
            <span>Edit Item</span>
          </button>
          
          {getItemAtSlot(items, contextMenu.slotIndex) && (
            <>
              <button 
                onClick={() => { handleAddVariant(); setContextMenu({ ...contextMenu, show: false }); }}
                className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 flex items-center gap-2"
              >
                <Copy size={12} className="text-indigo-400" />
                <span>Add Priority Variant</span>
              </button>
              <button 
                onClick={() => { handleOpenDuplicate(); setContextMenu({ ...contextMenu, show: false }); }}
                className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 flex items-center gap-2"
              >
                <Copy size={12} className="text-zinc-500" />
                <span>Duplicate to Slot</span>
              </button>
              <div className="h-px bg-zinc-800 my-1" />
              <button 
                onClick={() => { handleClear(); setContextMenu({ ...contextMenu, show: false }); }}
                className="w-full text-left px-3 py-1.5 hover:bg-zinc-850 hover:text-red-400 text-zinc-400 flex items-center gap-2"
              >
                <Trash size={12} className="text-red-500" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Duplicate Modal */}
      <Modal
        isOpen={duplicateModal.isOpen}
        onClose={() => setDuplicateModal({ isOpen: false, sourceSlot: null, targetSlot: '' })}
        title="Duplicate Item Configuration"
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-zinc-400">
            Enter the target slot number (0 to {layout.count - 1}) where you want to duplicate this item's configuration.
          </p>
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-zinc-400 uppercase tracking-wide text-[10px]">Target Slot</span>
            <input
              type="number"
              min="0"
              max={layout.count - 1}
              value={duplicateModal.targetSlot}
              onChange={(e) => setDuplicateModal({ ...duplicateModal, targetSlot: e.target.value })}
              placeholder="e.g. 5"
              className="w-full h-9 px-3 rounded border border-zinc-800 bg-zinc-800/50 text-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all font-mono text-xs"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => setDuplicateModal({ isOpen: false, sourceSlot: null, targetSlot: '' })}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-750 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDuplicate}
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
            >
              Confirm Duplicate
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
