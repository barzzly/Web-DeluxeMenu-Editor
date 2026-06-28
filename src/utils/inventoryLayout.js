export const CHEST_SIZES = [9, 18, 27, 36, 45, 54];

export const INVENTORY_LAYOUTS = {
  CHEST: { label: 'Chest', count: 27, columns: 9, sizeEditable: true },
  ANVIL: { label: 'Anvil', count: 3, columns: 3, sizeEditable: false },
  HOPPER: { label: 'Hopper', count: 5, columns: 5, sizeEditable: false },
  DISPENSER: { label: 'Dispenser', count: 9, columns: 3, sizeEditable: false },
  DROPPER: { label: 'Dropper', count: 9, columns: 3, sizeEditable: false },
  FURNACE: { label: 'Furnace', count: 3, columns: 3, sizeEditable: false },
  WORKBENCH: { label: 'Workbench', count: 10, columns: 5, sizeEditable: false },
  CRAFTING: { label: 'Crafting', count: 5, columns: 5, sizeEditable: false },
  ENCHANTING: { label: 'Enchanting', count: 2, columns: 2, sizeEditable: false },
  BREWING: { label: 'Brewing', count: 5, columns: 5, sizeEditable: false },
  BEACON: { label: 'Beacon', count: 1, columns: 1, sizeEditable: false }
};

export const normalizeInventoryType = (type) => {
  const normalized = String(type || 'CHEST').trim().toUpperCase();
  return INVENTORY_LAYOUTS[normalized] ? normalized : 'CHEST';
};

export const normalizeChestSize = (size) => {
  const raw = parseInt(size, 10);
  if (!Number.isFinite(raw)) return 27;
  const clamped = Math.max(9, Math.min(54, raw));
  const floored = Math.floor(clamped / 9) * 9;
  return CHEST_SIZES.includes(floored) ? floored : 27;
};

export const getInventoryLayout = (type, size) => {
  const inventoryType = normalizeInventoryType(type);
  const base = INVENTORY_LAYOUTS[inventoryType];
  if (inventoryType === 'CHEST') {
    return {
      ...base,
      type: inventoryType,
      count: normalizeChestSize(size),
      rows: normalizeChestSize(size) / 9
    };
  }

  return {
    ...base,
    type: inventoryType,
    rows: Math.ceil(base.count / base.columns)
  };
};