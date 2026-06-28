import React, { useState, useEffect } from 'react';
import { useMenuStore, getItemAtSlot, getItemsAtSlot } from '../../store/useMenuStore';
import SlotCell from './SlotCell';
import Modal from '../ui/Modal';
import { Copy, Trash, Edit2, Flame, ArrowRight, ArrowDown, Plus, BookOpen, Zap, FlaskConical } from 'lucide-react';
import { MinecraftText } from '../../utils/colorPreview';
import { getInventoryLayout } from '../../utils/inventoryLayout';

const CUSTOM_LAYOUTS = {
  FURNACE: {
    columns: 3,
    rows: 3,
    cells: [
      { type: 'slot', index: 0, label: 'Input Item', ghost: 'item' },
      { type: 'empty' },
      { type: 'empty' },
      { type: 'decorator', icon: 'flame', label: 'Fuel Heat' },
      { type: 'decorator', icon: 'arrow-right', label: 'Smelting Progress' },
      { type: 'slot', index: 2, label: 'Output Result', ghost: 'sparkles' },
      { type: 'slot', index: 1, label: 'Fuel Source', ghost: 'fuel' },
      { type: 'empty' },
      { type: 'empty' }
    ]
  },
  BLAST_FURNACE: {
    columns: 3,
    rows: 3,
    cells: [
      { type: 'slot', index: 0, label: 'Ore Input', ghost: 'item' },
      { type: 'empty' },
      { type: 'empty' },
      { type: 'decorator', icon: 'flame', label: 'Fuel Heat' },
      { type: 'decorator', icon: 'arrow-right', label: 'Smelting Progress' },
      { type: 'slot', index: 2, label: 'Smelted Result', ghost: 'sparkles' },
      { type: 'slot', index: 1, label: 'Fuel Source', ghost: 'fuel' },
      { type: 'empty' },
      { type: 'empty' }
    ]
  },
  SMOKER: {
    columns: 3,
    rows: 3,
    cells: [
      { type: 'slot', index: 0, label: 'Food Input', ghost: 'item' },
      { type: 'empty' },
      { type: 'empty' },
      { type: 'decorator', icon: 'flame', label: 'Fuel Heat' },
      { type: 'decorator', icon: 'arrow-right', label: 'Cooking Progress' },
      { type: 'slot', index: 2, label: 'Cooked Result', ghost: 'sparkles' },
      { type: 'slot', index: 1, label: 'Fuel Source', ghost: 'fuel' },
      { type: 'empty' },
      { type: 'empty' }
    ]
  },
  WORKBENCH: {
    columns: 5,
    rows: 3,
    cells: [
      { type: 'slot', index: 1, label: 'Craft Grid Col 1', ghost: 'grid' },
      { type: 'slot', index: 2, label: 'Craft Grid Col 2', ghost: 'grid' },
      { type: 'slot', index: 3, label: 'Craft Grid Col 3', ghost: 'grid' },
      { type: 'empty' },
      { type: 'empty' },
      { type: 'slot', index: 4, label: 'Craft Grid Col 1', ghost: 'grid' },
      { type: 'slot', index: 5, label: 'Craft Grid Col 2', ghost: 'grid' },
      { type: 'slot', index: 6, label: 'Craft Grid Col 3', ghost: 'grid' },
      { type: 'decorator', icon: 'arrow-right', label: 'Crafting Output' },
      { type: 'slot', index: 0, label: 'Crafting Result', ghost: 'sparkles' },
      { type: 'slot', index: 7, label: 'Craft Grid Col 1', ghost: 'grid' },
      { type: 'slot', index: 8, label: 'Craft Grid Col 2', ghost: 'grid' },
      { type: 'slot', index: 9, label: 'Craft Grid Col 3', ghost: 'grid' },
      { type: 'empty' },
      { type: 'empty' }
    ]
  },
  ANVIL: {
    columns: 5,
    rows: 1,
    cells: [
      { type: 'slot', index: 0, label: 'Repair Item', ghost: 'swords' },
      { type: 'decorator', icon: 'plus', label: 'Combine' },
      { type: 'slot', index: 1, label: 'Book / Material', ghost: 'book' },
      { type: 'decorator', icon: 'arrow-right', label: 'Repair Progress' },
      { type: 'slot', index: 2, label: 'Repair Result', ghost: 'sparkles' }
    ]
  },
  BREWING: {
    columns: 3,
    rows: 3,
    cells: [
      { type: 'slot', index: 1, label: 'Blaze Powder Fuel', ghost: 'fuel' },
      { type: 'slot', index: 0, label: 'Ingredient Slot', ghost: 'item' },
      { type: 'empty' },
      { type: 'decorator', icon: 'flame', label: 'Brewing Active' },
      { type: 'decorator', icon: 'arrow-down', label: 'Distill Progress' },
      { type: 'empty' },
      { type: 'slot', index: 2, label: 'Potion Potion Left', ghost: 'potion' },
      { type: 'slot', index: 3, label: 'Potion Potion Middle', ghost: 'potion' },
      { type: 'slot', index: 4, label: 'Potion Potion Right', ghost: 'potion' }
    ]
  },
  ENCHANTING: {
    columns: 3,
    rows: 1,
    cells: [
      { type: 'slot', index: 0, label: 'Enchant Item', ghost: 'swords' },
      { type: 'slot', index: 1, label: 'Lapis Lazuli', ghost: 'lapis' },
      { type: 'decorator', icon: 'book', label: 'Enchantments' }
    ]
  },
  BEACON: {
    columns: 2,
    rows: 1,
    cells: [
      { type: 'slot', index: 0, label: 'Payment Item', ghost: 'lapis' },
      { type: 'decorator', icon: 'beacon', label: 'Beacon Active' }
    ]
  },
  LOOM: {
    columns: 5,
    rows: 1,
    cells: [
      { type: 'slot', index: 0, label: 'Banner Pattern', ghost: 'item' },
      { type: 'slot', index: 1, label: 'Dye color', ghost: 'lapis' },
      { type: 'slot', index: 2, label: 'Banner Template', ghost: 'item' },
      { type: 'decorator', icon: 'arrow-right', label: 'Weaving Result' },
      { type: 'slot', index: 3, label: 'Loom Output', ghost: 'sparkles' }
    ]
  },
  CARTOGRAPHY: {
    columns: 5,
    rows: 1,
    cells: [
      { type: 'slot', index: 0, label: 'Input Map', ghost: 'item' },
      { type: 'decorator', icon: 'plus', label: 'Modifier Input' },
      { type: 'slot', index: 1, label: 'Paper / Glass Pane', ghost: 'item' },
      { type: 'decorator', icon: 'arrow-right', label: 'Mapping Result' },
      { type: 'slot', index: 2, label: 'Output Map', ghost: 'sparkles' }
    ]
  },
  GRINDSTONE: {
    columns: 3,
    rows: 2,
    cells: [
      { type: 'slot', index: 0, label: 'Grind Item 1', ghost: 'swords' },
      { type: 'empty' },
      { type: 'empty' },
      { type: 'slot', index: 1, label: 'Grind Item 2', ghost: 'swords' },
      { type: 'decorator', icon: 'arrow-right', label: 'Disenchant Output' },
      { type: 'slot', index: 2, label: 'Grinded Result', ghost: 'sparkles' }
    ]
  },
  PLAYER: {
    columns: 9,
    rows: 4,
    cells: [
      { type: 'slot', index: 9, label: 'Inventory 9', ghost: 'item' },
      { type: 'slot', index: 10, label: 'Inventory 10', ghost: 'item' },
      { type: 'slot', index: 11, label: 'Inventory 11', ghost: 'item' },
      { type: 'slot', index: 12, label: 'Inventory 12', ghost: 'item' },
      { type: 'slot', index: 13, label: 'Inventory 13', ghost: 'item' },
      { type: 'slot', index: 14, label: 'Inventory 14', ghost: 'item' },
      { type: 'slot', index: 15, label: 'Inventory 15', ghost: 'item' },
      { type: 'slot', index: 16, label: 'Inventory 16', ghost: 'item' },
      { type: 'slot', index: 17, label: 'Inventory 17', ghost: 'item' },
      { type: 'slot', index: 18, label: 'Inventory 18', ghost: 'item' },
      { type: 'slot', index: 19, label: 'Inventory 19', ghost: 'item' },
      { type: 'slot', index: 20, label: 'Inventory 20', ghost: 'item' },
      { type: 'slot', index: 21, label: 'Inventory 21', ghost: 'item' },
      { type: 'slot', index: 22, label: 'Inventory 22', ghost: 'item' },
      { type: 'slot', index: 23, label: 'Inventory 23', ghost: 'item' },
      { type: 'slot', index: 24, label: 'Inventory 24', ghost: 'item' },
      { type: 'slot', index: 25, label: 'Inventory 25', ghost: 'item' },
      { type: 'slot', index: 26, label: 'Inventory 26', ghost: 'item' },
      { type: 'slot', index: 27, label: 'Inventory 27', ghost: 'item' },
      { type: 'slot', index: 28, label: 'Inventory 28', ghost: 'item' },
      { type: 'slot', index: 29, label: 'Inventory 29', ghost: 'item' },
      { type: 'slot', index: 30, label: 'Inventory 30', ghost: 'item' },
      { type: 'slot', index: 31, label: 'Inventory 31', ghost: 'item' },
      { type: 'slot', index: 32, label: 'Inventory 32', ghost: 'item' },
      { type: 'slot', index: 33, label: 'Inventory 33', ghost: 'item' },
      { type: 'slot', index: 34, label: 'Inventory 34', ghost: 'item' },
      { type: 'slot', index: 35, label: 'Inventory 35', ghost: 'item' },
      { type: 'slot', index: 0, label: 'Hotbar 0', ghost: 'item' },
      { type: 'slot', index: 1, label: 'Hotbar 1', ghost: 'item' },
      { type: 'slot', index: 2, label: 'Hotbar 2', ghost: 'item' },
      { type: 'slot', index: 3, label: 'Hotbar 3', ghost: 'item' },
      { type: 'slot', index: 4, label: 'Hotbar 4', ghost: 'item' },
      { type: 'slot', index: 5, label: 'Hotbar 5', ghost: 'item' },
      { type: 'slot', index: 6, label: 'Hotbar 6', ghost: 'item' },
      { type: 'slot', index: 7, label: 'Hotbar 7', ghost: 'item' },
      { type: 'slot', index: 8, label: 'Hotbar 8', ghost: 'item' }
    ]
  }
};

const renderDecoratorIcon = (icon) => {
  switch (icon) {
    case 'flame':
      return <Flame className="w-5 h-5 text-orange-500 animate-pulse" />;
    case 'arrow-right':
      return <ArrowRight className="w-5 h-5 text-zinc-500" />;
    case 'arrow-down':
      return <ArrowDown className="w-5 h-5 text-zinc-500" />;
    case 'plus':
      return <Plus className="w-5 h-5 text-zinc-600" />;
    case 'book':
      return <BookOpen className="w-5 h-5 text-purple-400" />;
    case 'beacon':
      return <Zap className="w-5 h-5 text-sky-400 animate-pulse" />;
    case 'brewing_stand':
      return <FlaskConical className="w-5 h-5 text-emerald-400" />;
    default:
      return null;
  }
};

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

  const layout = getInventoryLayout(inventory_type, size);

  // Close context menu on window click
  useEffect(() => {
    const handleClose = () => {
      if (contextMenu.show) {
        setContextMenu({ ...contextMenu, show: false });
      }
    };
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [contextMenu]);

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
  const customLayout = CUSTOM_LAYOUTS[layout.type];
  const gridColumns = customLayout ? customLayout.columns : layout.columns;

  if (customLayout) {
    customLayout.cells.forEach((cell, idx) => {
      if (cell.type === 'slot') {
        const slotItems = getItemsAtSlot(items, cell.index);
        const item = slotItems[0] || null;
        cells.push(
          <SlotCell
            key={`slot-${cell.index}`}
            slotIndex={cell.index}
            item={item}
            itemCount={slotItems.length}
            isSelected={selectedSlot === cell.index}
            onContextMenuOpen={handleContextMenuOpen}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            label={cell.label}
            ghost={cell.ghost}
          />
        );
      } else if (cell.type === 'decorator') {
        cells.push(
          <div
            key={`decorator-${idx}`}
            className="slot-cell flex flex-col items-center justify-center border-2 border-transparent text-zinc-600 transition-all select-none relative group cursor-help bg-zinc-900/10 rounded"
          >
            {renderDecoratorIcon(cell.icon)}
            <span className="absolute bottom-[2px] text-[7px] text-zinc-500 font-mono scale-90 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-zinc-950/90 border border-zinc-800 px-1 rounded z-20 pointer-events-none">
              {cell.label}
            </span>
          </div>
        );
      } else {
        cells.push(
          <div
            key={`empty-${idx}`}
            className="slot-cell border-2 border-transparent transition-all select-none opacity-20"
          />
        );
      }
    });
  } else {
    for (let i = 0; i < layout.count; i++) {
      const slotItems = getItemsAtSlot(items, i);
      const item = slotItems[0] || null;
      cells.push(
        <SlotCell
          key={`slot-${i}`}
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
  }

  return (
    <div className="relative flex w-full flex-col items-center select-none animate-fadeIn">
      {/* Visual Chest Container (Minecraft UI Texture mimic) */}
      <div className="inventory-shell bg-zinc-800/95 border-[4px] border-t-zinc-600 border-l-zinc-600 border-r-zinc-950 border-b-zinc-950 p-2.5 sm:p-4 rounded shadow-2xl shadow-black/40 flex flex-col gap-3 w-max max-w-full">
        {/* Chest GUI Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-2 px-1">
          <span className="text-xs font-bold tracking-wide font-sans text-zinc-300">
            <MinecraftText text={menu_title || 'Chest'} />
          </span>
          <span className="text-[10px] text-zinc-500 font-mono font-semibold uppercase tracking-wider scale-90 shrink-0">
            {layout.type} ({layout.count})
          </span>
        </div>

        {/* Chest Slots Grid */}
        <div className="bg-zinc-950/95 p-1.5 rounded border border-zinc-950 overflow-x-auto max-w-full">
          <div
            className="inventory-grid grid gap-[3px] justify-center items-center justify-items-center"
            style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
          >
            {cells}
          </div>
        </div>
      </div>

      <div className="mt-4 px-3 text-[10px] text-zinc-500 font-mono text-center max-w-sm">
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
