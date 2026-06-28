import { dump } from 'js-yaml';
import { getInventoryLayout } from './inventoryLayout';

const cleanRequirement = (req) => {
  if (!req) return undefined;
  if (!req.requirements || Object.keys(req.requirements).length === 0) return undefined;
  
  const result = {
    requirements: {}
  };
  
  Object.keys(req.requirements).forEach(key => {
    const r = req.requirements[key];
    const cleanR = {};
    if (r.type) cleanR.type = r.type;
    if (r.permission) cleanR.permission = r.permission;
    if (r.amount !== undefined && r.amount !== null && r.amount !== '') cleanR.amount = Number(r.amount);
    if (r.input) cleanR.input = r.input;
    if (r.output) cleanR.output = r.output;
    if (r.value) cleanR.value = r.value;
    if (r.expression) cleanR.expression = r.expression;
    if (r.deny_commands && r.deny_commands.length > 0) cleanR.deny_commands = r.deny_commands;
    
    result.requirements[key] = cleanR;
  });
  
  if (req.deny_commands && req.deny_commands.length > 0) {
    result.deny_commands = req.deny_commands;
  }
  if (req.minimum_requirements !== undefined && req.minimum_requirements !== null && req.minimum_requirements !== '') {
    result.minimum_requirements = isNaN(Number(req.minimum_requirements)) ? req.minimum_requirements : Number(req.minimum_requirements);
  }
  if (req.stop_at_success) {
    result.stop_at_success = true;
  }
  
  return result;
};

const cleanItem = (item) => {
  const clean = {};
  
  clean.material = item.material || 'STONE';
  
  if (item.slots && item.slots.length > 0) {
    clean.slots = item.slots.map(s => Number(s));
  } else {
    clean.slot = Number(item.slot);
  }
  
  if (item.display_name) clean.display_name = item.display_name;
  if (item.lore && item.lore.length > 0) clean.lore = item.lore;
  if (item.amount && item.amount > 1) clean.amount = Number(item.amount);
  if (item.dynamic_amount) clean.dynamic_amount = item.dynamic_amount;
  if (item.damage && item.damage > 0) clean.damage = Number(item.damage);
  if (item.priority && item.priority > 0) clean.priority = Number(item.priority);
  if (item.unbreakable) clean.unbreakable = true;
  if (item.update) clean.update = true;
  if (item.rgb) clean.rgb = item.rgb;
  
  if (item.item_flags && item.item_flags.length > 0) clean.item_flags = item.item_flags;
  
  if (item.enchantments && item.enchantments.length > 0) {
    clean.enchantments = item.enchantments.map(e => `${e.id}:${e.level}`);
  }
  
  if (item.potion_effects && item.potion_effects.length > 0) {
    clean.potion_effects = item.potion_effects.map(p => `${p.id};${p.duration};${p.amplifier}`);
  }
  
  if (item.banner_meta && item.banner_meta.length > 0) {
    clean.banner_meta = item.banner_meta.map(b => `${b.color};${b.pattern}`);
  }
  
  if (item.base_color) clean.base_color = item.base_color;
  if (item.light_level !== null && item.light_level !== '') clean.light_level = Number(item.light_level);
  
  if (item.trim_material && item.trim_pattern) {
    clean.trim_material = item.trim_material;
    clean.trim_pattern = item.trim_pattern;
  }
  
  if (item.nbt_string) clean.nbt_string = item.nbt_string;
  if (item.nbt_strings && item.nbt_strings.length > 0) clean.nbt_strings = item.nbt_strings;
  if (item.nbt_int) clean.nbt_int = item.nbt_int;
  if (item.nbt_ints && item.nbt_ints.length > 0) clean.nbt_ints = item.nbt_ints;
  if (item.nbt_byte) clean.nbt_byte = item.nbt_byte;
  if (item.nbt_bytes && item.nbt_bytes.length > 0) clean.nbt_bytes = item.nbt_bytes;
  
  if (item.hide_tooltip) clean.hide_tooltip = true;
  if (item.enchantment_glint_override) clean.enchantment_glint_override = true;
  if (item.rarity) clean.rarity = item.rarity;
  
  if (item.model_data !== null && item.model_data !== '') clean.model_data = Number(item.model_data);
  
  if (item.model_data_component) {
    const comp = item.model_data_component;
    const cleanComp = {};
    let hasData = false;
    if (comp.strings && comp.strings.length > 0) { cleanComp.strings = comp.strings; hasData = true; }
    if (comp.floats && comp.floats.length > 0) { cleanComp.floats = comp.floats.map(f => Number(f)); hasData = true; }
    if (comp.flags && comp.flags.length > 0) { cleanComp.flags = comp.flags.map(f => f === 'true'); hasData = true; }
    if (comp.colors && comp.colors.length > 0) { cleanComp.colors = comp.colors; hasData = true; }
    if (hasData) {
      clean.model_data_component = cleanComp;
    }
  }
  
  if (item.item_model) clean.item_model = item.item_model;
  if (item.tooltip_style) clean.tooltip_style = item.tooltip_style;
  
  if (item.view_requirement) {
    const viewReq = cleanRequirement(item.view_requirement);
    if (viewReq) clean.view_requirement = viewReq;
  }
  
  if (item.click_commands && item.click_commands.length > 0) clean.click_commands = item.click_commands;
  if (item.left_click_commands && item.left_click_commands.length > 0) clean.left_click_commands = item.left_click_commands;
  if (item.right_click_commands && item.right_click_commands.length > 0) clean.right_click_commands = item.right_click_commands;
  if (item.middle_click_commands && item.middle_click_commands.length > 0) clean.middle_click_commands = item.middle_click_commands;
  if (item.shift_left_click_commands && item.shift_left_click_commands.length > 0) clean.shift_left_click_commands = item.shift_left_click_commands;
  if (item.shift_right_click_commands && item.shift_right_click_commands.length > 0) clean.shift_right_click_commands = item.shift_right_click_commands;
  
  if (item.click_requirement) {
    const req = cleanRequirement(item.click_requirement);
    if (req) clean.click_requirement = req;
  }
  if (item.left_click_requirement) {
    const req = cleanRequirement(item.left_click_requirement);
    if (req) clean.left_click_requirement = req;
  }
  if (item.right_click_requirement) {
    const req = cleanRequirement(item.right_click_requirement);
    if (req) clean.right_click_requirement = req;
  }
  if (item.shift_left_click_requirement) {
    const req = cleanRequirement(item.shift_left_click_requirement);
    if (req) clean.shift_left_click_requirement = req;
  }
  if (item.shift_right_click_requirement) {
    const req = cleanRequirement(item.shift_right_click_requirement);
    if (req) clean.shift_right_click_requirement = req;
  }
  
  return clean;
};

export function generateYaml(storeState) {
  const root = {};
  
  if (storeState.menu_title) root.menu_title = storeState.menu_title;
  if (storeState.open_command) root.open_command = storeState.open_command;

  const layout = getInventoryLayout(storeState.inventory_type, storeState.size);
  if (layout.type === 'CHEST') {
    root.size = layout.count;
  } else {
    root.inventory_type = layout.type;
  }
  
  if (storeState.update_interval !== undefined && storeState.update_interval !== null && storeState.update_interval !== '') {
    root.update_interval = Number(storeState.update_interval);
  }
  
  if (storeState.open_requirement) {
    const req = cleanRequirement(storeState.open_requirement);
    if (req) root.open_requirement = req;
  }
  
  if (storeState.open_commands && storeState.open_commands.length > 0) {
    root.open_commands = storeState.open_commands;
  }
  
  const itemEntries = Object.values(storeState.items || {})
    .filter(Boolean)
    .sort((a, b) => {
      const slotDelta = Number(a.slot || 0) - Number(b.slot || 0);
      if (slotDelta !== 0) return slotDelta;
      const priorityDelta = Number(a.priority || 0) - Number(b.priority || 0);
      if (priorityDelta !== 0) return priorityDelta;
      return String(a.id).localeCompare(String(b.id));
    });

  if (itemEntries.length > 0) {
    root.items = {};
    itemEntries.forEach((item, index) => {
      root.items[item.id || `item_${index}`] = cleanItem(item);
    });
  }
  
  return dump(root, {
    indent: 2,
    lineWidth: -1,
    noRefs: true
  });
}
