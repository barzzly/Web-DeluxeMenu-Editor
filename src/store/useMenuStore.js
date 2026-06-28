import { create } from 'zustand';
import { createDefaultItem, INITIAL_MENU_STATE } from './defaults';
import { load } from 'js-yaml';
import { getInventoryLayout, normalizeChestSize, normalizeInventoryType } from '../utils/inventoryLayout';

const cloneState = (state) => JSON.parse(JSON.stringify(state));

const toSlotNumber = (value, fallback = 0) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeList = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const normalizePotionEffects = (value) => normalizeList(value)
  .map((effect) => {
    if (!effect) return null;
    if (typeof effect === 'string') {
      const [id, duration = 600, amplifier = 0] = effect.split(/[;:]/);
      return {
        id: id || 'SPEED',
        duration: parseInt(duration, 10) || 600,
        amplifier: parseInt(amplifier, 10) || 0
      };
    }
    return {
      id: effect.id || effect.type || 'SPEED',
      duration: parseInt(effect.duration, 10) || 600,
      amplifier: parseInt(effect.amplifier, 10) || 0
    };
  })
  .filter(Boolean);

const normalizeSlots = (value) => {
  if (!value) return [];
  const values = Array.isArray(value) ? value : [value];
  return values
    .flatMap((entry) => {
      if (typeof entry === 'string' && entry.includes('-')) {
        const [start, end] = entry.split('-').map((part) => parseInt(part.trim(), 10));
        if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
          return Array.from({ length: end - start + 1 }, (_, index) => start + index);
        }
      }
      return [parseInt(entry, 10)];
    })
    .filter((slot) => Number.isFinite(slot));
};

const uniqueItemId = (items, preferredId) => {
  const base = (preferredId || 'item').toString().trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_') || 'item';
  if (!items[base]) return base;

  let index = 2;
  while (items[`${base}_${index}`]) index += 1;
  return `${base}_${index}`;
};

const sortByPriority = (a, b) => {
  const priorityA = Number(a.priority || 0);
  const priorityB = Number(b.priority || 0);
  if (priorityA !== priorityB) return priorityA - priorityB;
  return String(a.id).localeCompare(String(b.id));
};

const filterItemsForLayout = (items, type, size) => {
  const layout = getInventoryLayout(type, size);
  return Object.fromEntries(Object.entries(items).filter(([, item]) => toSlotNumber(item.slot) < layout.count));
};

const itemOccupiesSlot = (item, slotIndex) => {
  if (!item) return false;
  if (toSlotNumber(item.slot) === slotIndex) return true;
  return normalizeSlots(item.slots).includes(slotIndex);
};

const getItemKey = (items, identifier, selectedItemId = null) => {
  if (!items) return null;
  if (selectedItemId && items[selectedItemId]) return selectedItemId;
  if (identifier && items[identifier]) return identifier;
  const byId = Object.keys(items).find((key) => items[key]?.id === identifier);
  if (byId) return byId;
  if (Number.isFinite(Number(identifier))) {
    const slot = Number(identifier);
    return getItemsAtSlot(items, slot)[0]?.id || null;
  }
  return null;
};

const importRequirement = (reqBlock) => {
  if (!reqBlock) return null;
  return {
    requirements: reqBlock.requirements || {},
    deny_commands: normalizeList(reqBlock.deny_commands),
    minimum_requirements: reqBlock.minimum_requirements || undefined,
    stop_at_success: reqBlock.stop_at_success || false
  };
};

export const useMenuStore = create((set, get) => ({
  past: [],
  future: [],

  menuName: INITIAL_MENU_STATE.menuName,
  menu_title: INITIAL_MENU_STATE.menu_title,
  open_command: INITIAL_MENU_STATE.open_command,
  size: INITIAL_MENU_STATE.size,
  inventory_type: INITIAL_MENU_STATE.inventory_type,
  update_interval: INITIAL_MENU_STATE.update_interval,
  open_requirement: INITIAL_MENU_STATE.open_requirement,
  open_commands: INITIAL_MENU_STATE.open_commands,
  items: INITIAL_MENU_STATE.items,

  selectedSlot: null,
  selectedItemId: null,
  toast: null,

  pushToHistory: () => {
    const { past, future, selectedSlot, selectedItemId, toast, ...currentState } = get();
    set({ past: [...past, cloneState(currentState)], future: [] });
  },

  undo: () => {
    const { past, future, selectedSlot, selectedItemId, toast, ...currentState } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const currentClone = cloneState(currentState);
    const nextSelectedItem = previous.items[selectedItemId] ? selectedItemId : null;
    set({
      past: past.slice(0, past.length - 1),
      future: [currentClone, ...future],
      ...previous,
      selectedItemId: nextSelectedItem,
      selectedSlot: nextSelectedItem ? previous.items[nextSelectedItem].slot : selectedSlot
    });
    get().showToast('Undo successful', 'info');
  },

  redo: () => {
    const { past, future, selectedSlot, selectedItemId, toast, ...currentState } = get();
    if (future.length === 0) return;
    const next = future[0];
    const currentClone = cloneState(currentState);
    const nextSelectedItem = next.items[selectedItemId] ? selectedItemId : null;
    set({
      past: [...past, currentClone],
      future: future.slice(1),
      ...next,
      selectedItemId: nextSelectedItem,
      selectedSlot: nextSelectedItem ? next.items[nextSelectedItem].slot : selectedSlot
    });
    get().showToast('Redo successful', 'info');
  },

  showToast: (message, type = 'success') => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),

  setSelectedSlot: (slot, itemId = null) => {
    const items = get().items;
    const firstItem = itemId ? items[itemId] : getItemsAtSlot(items, slot)[0];
    set({ selectedSlot: slot, selectedItemId: firstItem?.id || null });
  },

  selectItem: (itemId) => {
    const item = get().items[itemId];
    if (item) set({ selectedSlot: item.slot, selectedItemId: item.id });
  },

  setMenuField: (field, value) => {
    get().pushToHistory();
    if (field === 'inventory_type') {
      const inventoryType = normalizeInventoryType(value);
      const currentSize = normalizeChestSize(get().size);
      const updatedItems = filterItemsForLayout(get().items, inventoryType, currentSize);
      set({
        inventory_type: inventoryType,
        size: currentSize,
        items: updatedItems,
        selectedSlot: null,
        selectedItemId: null
      });
      return;
    }
    set({ [field]: value });
  },

  setMenuSize: (newSize) => {
    get().pushToHistory();
    const normalizedSize = normalizeChestSize(newSize);
    const { items, selectedSlot, selectedItemId, inventory_type } = get();
    const updatedItems = filterItemsForLayout(items, inventory_type, normalizedSize);
    set({
      size: normalizedSize,
      items: updatedItems,
      selectedItemId: updatedItems[selectedItemId] ? selectedItemId : null,
      selectedSlot: selectedSlot !== null && selectedSlot >= getInventoryLayout(inventory_type, normalizedSize).count ? null : selectedSlot
    });
  },

  setItem: (slot, itemData = {}) => {
    get().pushToHistory();
    const currentItems = { ...get().items };
    const id = uniqueItemId(currentItems, itemData.id || `item_${slot}`);
    currentItems[id] = { ...createDefaultItem(slot), ...itemData, id, slot };
    set({ items: currentItems, selectedSlot: slot, selectedItemId: id });
  },

  addItemAtSlot: (slot) => {
    const count = getItemsAtSlot(get().items, slot).length;
    get().setItem(slot, { id: `item_${slot}${count ? `_${count + 1}` : ''}`, priority: count });
  },

  updateItem: (identifier, partial) => {
    get().pushToHistory();
    const { items, selectedItemId } = get();
    const currentItems = { ...items };
    const key = getItemKey(currentItems, identifier, selectedItemId);
    if (!key || !currentItems[key]) return;

    const nextItem = { ...currentItems[key], ...partial };
    let nextKey = key;
    if (partial.id && partial.id !== key) {
      nextKey = uniqueItemId(Object.fromEntries(Object.entries(currentItems).filter(([itemKey]) => itemKey !== key)), partial.id);
      delete currentItems[key];
      nextItem.id = nextKey;
    }

    currentItems[nextKey] = nextItem;
    set({ items: currentItems, selectedSlot: nextItem.slot, selectedItemId: nextKey });
  },

  removeItem: (identifier) => {
    get().pushToHistory();
    const { items, selectedItemId } = get();
    const currentItems = { ...items };
    const key = getItemKey(currentItems, identifier, selectedItemId);
    if (!key) return;
    const removedSlot = currentItems[key].slot;
    delete currentItems[key];
    const nextItem = getItemsAtSlot(currentItems, removedSlot)[0];
    set({
      items: currentItems,
      selectedSlot: nextItem ? removedSlot : null,
      selectedItemId: nextItem?.id || null
    });
  },

  moveItem: (fromSlot, toSlot) => {
    get().pushToHistory();
    const { items, selectedItemId } = get();
    const currentItems = { ...items };
    const movingKey = selectedItemId && itemOccupiesSlot(currentItems[selectedItemId], fromSlot)
      ? selectedItemId
      : getItemsAtSlot(currentItems, fromSlot)[0]?.id;
    if (!movingKey) return;
    currentItems[movingKey] = { ...currentItems[movingKey], slot: toSlot, slots: [] };
    set({ items: currentItems, selectedSlot: toSlot, selectedItemId: movingKey });
  },

  resetMenu: () => {
    get().pushToHistory();
    set({
      menuName: INITIAL_MENU_STATE.menuName,
      menu_title: INITIAL_MENU_STATE.menu_title,
      open_command: INITIAL_MENU_STATE.open_command,
      size: INITIAL_MENU_STATE.size,
      inventory_type: INITIAL_MENU_STATE.inventory_type,
      update_interval: INITIAL_MENU_STATE.update_interval,
      open_requirement: INITIAL_MENU_STATE.open_requirement,
      open_commands: INITIAL_MENU_STATE.open_commands,
      items: INITIAL_MENU_STATE.items,
      selectedSlot: null,
      selectedItemId: null
    });
    get().showToast('Menu configuration reset', 'info');
  },

  importYaml: (yamlString) => {
    try {
      const parsed = load(yamlString);
      if (!parsed) throw new Error('YAML is empty or invalid.');

      get().pushToHistory();

      const importedItems = {};
      if (parsed.items) {
        Object.entries(parsed.items).forEach(([itemKey, rawItem]) => {
          const slotsVal = normalizeSlots(rawItem.slots);
          const primarySlot = rawItem.slot !== undefined && rawItem.slot !== null
            ? toSlotNumber(rawItem.slot)
            : (slotsVal[0] ?? 0);
          const id = uniqueItemId(importedItems, itemKey);

          importedItems[id] = {
            ...createDefaultItem(primarySlot),
            id,
            material: rawItem.material || 'STONE',
            slot: primarySlot,
            slots: slotsVal,
            display_name: rawItem.display_name || '',
            lore: normalizeList(rawItem.lore),
            amount: rawItem.amount || 1,
            damage: rawItem.damage || 0,
            priority: rawItem.priority || 0,
            dynamic_amount: rawItem.dynamic_amount || '',
            unbreakable: rawItem.unbreakable || false,
            update: rawItem.update || false,
            rgb: rawItem.rgb || '',
            item_flags: normalizeList(rawItem.item_flags),
            enchantments: normalizeList(rawItem.enchantments),
            potion_effects: normalizePotionEffects(rawItem.potion_effects),
            banner_meta: normalizeList(rawItem.banner_meta),
            base_color: rawItem.base_color || '',
            light_level: rawItem.light_level ?? null,
            trim_material: rawItem.trim_material || '',
            trim_pattern: rawItem.trim_pattern || '',
            lore_append_mode: rawItem.lore_append_mode || '',
            nbt_string: rawItem.nbt_string || '',
            nbt_strings: normalizeList(rawItem.nbt_strings),
            nbt_int: rawItem.nbt_int || '',
            nbt_ints: normalizeList(rawItem.nbt_ints),
            nbt_byte: rawItem.nbt_byte || '',
            nbt_bytes: normalizeList(rawItem.nbt_bytes),
            hide_tooltip: rawItem.hide_tooltip || false,
            hide_enchantments: rawItem.hide_enchantments || false,
            enchantment_glint_override: rawItem.enchantment_glint_override || false,
            rarity: rawItem.rarity || '',
            model_data: rawItem.model_data ?? null,
            model_data_component: rawItem.model_data_component || null,
            item_model: rawItem.item_model || '',
            tooltip_style: rawItem.tooltip_style || '',
            view_requirement: importRequirement(rawItem.view_requirement),
            click_commands: normalizeList(rawItem.click_commands),
            left_click_commands: normalizeList(rawItem.left_click_commands),
            right_click_commands: normalizeList(rawItem.right_click_commands),
            middle_click_commands: normalizeList(rawItem.middle_click_commands),
            shift_left_click_commands: normalizeList(rawItem.shift_left_click_commands),
            shift_right_click_commands: normalizeList(rawItem.shift_right_click_commands),
            click_requirement: importRequirement(rawItem.click_requirement),
            left_click_requirement: importRequirement(rawItem.left_click_requirement),
            right_click_requirement: importRequirement(rawItem.right_click_requirement),
            shift_left_click_requirement: importRequirement(rawItem.shift_left_click_requirement),
            shift_right_click_requirement: importRequirement(rawItem.shift_right_click_requirement)
          };
        });
      }

      set({
        menu_title: parsed.menu_title || '&8My Menu',
        open_command: parsed.open_command || '',
        size: normalizeChestSize(parsed.size || 27),
        inventory_type: normalizeInventoryType(parsed.inventory_type || 'CHEST'),
        update_interval: parsed.update_interval ?? 20,
        open_requirement: parsed.open_requirement || null,
        open_commands: normalizeList(parsed.open_commands),
        items: importedItems,
        selectedSlot: null,
        selectedItemId: null
      });

      get().showToast(`Imported ${Object.keys(importedItems).length} item configs`, 'success');
      return true;
    } catch (err) {
      get().showToast(`Import failed: ${err.message}`, 'error');
      return false;
    }
  }
}));

export const getItemsAtSlot = (items, slotIndex) => {
  if (!items || slotIndex === null || slotIndex === undefined) return [];
  return Object.values(items)
    .filter((item) => itemOccupiesSlot(item, slotIndex))
    .sort(sortByPriority);
};

export const getItemAtSlot = (items, slotIndex, itemId = null) => {
  if (itemId && items?.[itemId]) return items[itemId];
  return getItemsAtSlot(items, slotIndex)[0] || null;
};