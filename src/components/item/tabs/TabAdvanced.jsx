import React, { useState } from 'react';
import { POTION_EFFECTS } from '../../../constants/potionEffects';
import { Plus, Trash, AlertCircle } from 'lucide-react';

export default function TabAdvanced({ item, updateItem }) {
  // Lists for dropdown selections
  const dyeColors = [
    'WHITE', 'ORANGE', 'MAGENTA', 'LIGHT_BLUE', 'YELLOW', 'LIME', 'PINK', 'GRAY',
    'LIGHT_GRAY', 'CYAN', 'PURPLE', 'BLUE', 'BROWN', 'GREEN', 'RED', 'BLACK'
  ];

  const bannerPatterns = [
    'BASE', 'BORDER', 'BRICKS', 'CIRCLE', 'CREEPER', 'CROSS', 'CURLY_BORDER', 
    'DIAGONAL_LEFT', 'DIAGONAL_LEFT_MIRROR', 'DIAGONAL_RIGHT', 'DIAGONAL_RIGHT_MIRROR', 
    'FLOWER', 'GRADIENT', 'GRADIENT_UP', 'HALF_HORIZONTAL', 'HALF_HORIZONTAL_MIRROR', 
    'HALF_VERTICAL', 'HALF_VERTICAL_MIRROR', 'MOJANG', 'GLOBE', 'PIGLIN', 'RHOMBUS', 
    'SKULL', 'STRIPE_BOTTOM', 'STRIPE_CENTER', 'STRIPE_DOWNLEFT', 'STRIPE_DOWNRIGHT', 
    'STRIPE_LEFT', 'STRIPE_MIDDLE', 'STRIPE_RIGHT', 'STRIPE_TOP', 'TRIANGLE_BOTTOM', 
    'TRIANGLE_TOP', 'TRIANGLES_BOTTOM', 'TRIANGLES_TOP'
  ];

  const trimMaterials = [
    'AMETHYST', 'COPPER', 'DIAMOND', 'EMERALD', 'GOLD', 'IRON', 'LAPIS', 'NETHERITE', 'QUARTZ', 'REDSTONE'
  ];

  const trimPatterns = [
    'SENTRY', 'DUNE', 'WILD', 'WARDEN', 'SNOUT', 'VEX', 'TIDE', 'COAST', 
    'WAYFINDER', 'SHAPER', 'HOST', 'RAISER', 'SILENCE', 'EYE', 'SPIRE'
  ];

  // Potion Effect State
  const [potionEffectType, setPotionEffectType] = useState(POTION_EFFECTS[0] || 'SPEED');
  const [potionDuration, setPotionDuration] = useState(600); // 30s
  const [potionAmplifier, setPotionAmplifier] = useState(0); // Level 1

  // Banner Pattern State
  const [bannerColor, setBannerColor] = useState('WHITE');
  const [bannerPattern, setBannerPattern] = useState('SKULL');

  // Potion Action Handlers
  const handleAddPotion = () => {
    const current = [...(item.potion_effects || [])];
    if (current.some(p => p.id === potionEffectType)) return;
    
    current.push({
      id: potionEffectType,
      duration: parseInt(potionDuration, 10) || 600,
      amplifier: parseInt(potionAmplifier, 10) || 0
    });
    updateItem(item.slot, { potion_effects: current });
  };

  const handleRemovePotion = (effectId) => {
    const current = (item.potion_effects || []).filter(p => p.id !== effectId);
    updateItem(item.slot, { potion_effects: current });
  };

  // Banner Meta Handlers
  const handleAddBannerPattern = () => {
    const current = [...(item.banner_meta || [])];
    current.push({
      color: bannerColor,
      pattern: bannerPattern
    });
    updateItem(item.slot, { banner_meta: current });
  };

  const handleRemoveBannerPattern = (idx) => {
    const current = (item.banner_meta || []).filter((_, i) => i !== idx);
    updateItem(item.slot, { banner_meta: current });
  };

  const isPotionMaterial = item.material && ['POTION', 'SPLASH_POTION', 'LINGERING_POTION', 'TIPPED_ARROW'].some(m => item.material.includes(m));
  const isBannerMaterial = item.material && ['BANNER', 'SHIELD'].some(m => item.material.includes(m));

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* Lore Append Mode */}
      <div className="flex flex-col gap-1.5">
        <span className="font-semibold text-zinc-400 uppercase tracking-wide">Lore Append Mode</span>
        <select
          value={item.lore_append_mode || 'OVERRIDE'}
          onChange={(e) => updateItem(item.slot, { lore_append_mode: e.target.value })}
          className="w-full h-8 px-2.5 rounded border border-zinc-800 bg-zinc-800 text-zinc-200 outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="OVERRIDE">OVERRIDE (Default)</option>
          <option value="IGNORE">IGNORE</option>
          <option value="BOTTOM">BOTTOM</option>
          <option value="TOP">TOP</option>
        </select>
        <span className="text-[9px] text-zinc-500">Defines how description lines behave when combined with external scripts.</span>
      </div>

      {/* Light Level (Only Light material) */}
      <div className="flex flex-col gap-1.5 border-t border-zinc-800/60 pt-4">
        <span className="font-semibold text-zinc-400 uppercase tracking-wide">Light Level (LIGHT material only)</span>
        <input
          type="number"
          min="0"
          max="15"
          value={item.light_level !== null ? item.light_level : ''}
          onChange={(e) => updateItem(item.slot, { light_level: e.target.value !== '' ? parseInt(e.target.value, 10) : null })}
          placeholder="e.g. 15"
          className="w-full h-8 px-2.5 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
        />
        <span className="text-[9px] text-zinc-500">Value between 0 and 15.</span>
      </div>

      {/* Potion Effects Section */}
      <div className={`border-t border-zinc-800/60 pt-4 flex flex-col gap-3 ${isPotionMaterial ? 'ring-1 ring-indigo-500/20 p-2 rounded bg-indigo-950/5' : ''}`}>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-zinc-400 uppercase tracking-wide">Potion Modifiers</span>
          {isPotionMaterial && <span className="text-[9px] text-indigo-400 font-medium">Recommended for Potions</span>}
        </div>

        {/* Add Potion Effect controls */}
        <div className="flex flex-col gap-2.5 bg-zinc-950/20 p-2.5 rounded border border-zinc-900">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-zinc-500">Effect Type</span>
              <select
                value={potionEffectType}
                onChange={(e) => setPotionEffectType(e.target.value)}
                className="h-8 px-2 rounded border border-zinc-800 bg-zinc-800 text-zinc-200 outline-none text-[10px] cursor-pointer"
              >
                {POTION_EFFECTS.map(effect => (
                  <option key={effect} value={effect}>{effect}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-zinc-500">Duration (ticks)</span>
                <input
                  type="number"
                  min="20"
                  value={potionDuration}
                  onChange={(e) => setPotionDuration(parseInt(e.target.value, 10) || 20)}
                  className="h-8 px-1.5 rounded border border-zinc-800 bg-zinc-800 text-zinc-200 outline-none font-mono text-[10px] text-center"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-zinc-500">Amplifier (0=lvl 1)</span>
                <input
                  type="number"
                  min="0"
                  value={potionAmplifier}
                  onChange={(e) => setPotionAmplifier(parseInt(e.target.value, 10) || 0)}
                  className="h-8 px-1.5 rounded border border-zinc-800 bg-zinc-800 text-zinc-200 outline-none font-mono text-[10px] text-center"
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddPotion}
            className="w-full h-7 bg-zinc-800 hover:bg-zinc-750 text-[10px] font-medium text-zinc-200 rounded flex items-center justify-center gap-1 transition-colors border border-zinc-850"
          >
            <Plus size={12} />
            <span>Add Potion Effect</span>
          </button>
        </div>

        {/* Potions List */}
        {item.potion_effects && item.potion_effects.length > 0 ? (
          <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto pr-1">
            {item.potion_effects.map(effect => (
              <div key={effect.id} className="flex justify-between items-center bg-zinc-900/30 px-3 py-1.5 border border-zinc-850 rounded">
                <div className="flex gap-1.5 items-center font-mono text-[10px]">
                  <span className="text-zinc-300 font-semibold">{effect.id}</span>
                  <span className="text-zinc-500 font-normal">({effect.duration}t, lvl {effect.amplifier + 1})</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePotion(effect.id)}
                  className="p-1 rounded hover:bg-red-950/40 text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <Trash size={11} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[10px] text-zinc-650 italic text-center py-1">
            No potion effects configured.
          </div>
        )}
      </div>

      {/* Banner / Shield metadata section */}
      <div className={`border-t border-zinc-800/60 pt-4 flex flex-col gap-3 ${isBannerMaterial ? 'ring-1 ring-indigo-500/20 p-2 rounded bg-indigo-950/5' : ''}`}>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-zinc-400 uppercase tracking-wide">Banner Meta (Shield/Banner only)</span>
          {isBannerMaterial && <span className="text-[9px] text-indigo-400 font-medium">Recommended for Banners</span>}
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Base color */}
          <div className="flex flex-col gap-1">
            <span className="text-zinc-500 font-medium">Base Color</span>
            <select
              value={item.base_color || ''}
              onChange={(e) => updateItem(item.slot, { base_color: e.target.value })}
              className="w-full h-8 px-2 rounded border border-zinc-800 bg-zinc-800 text-zinc-200 outline-none text-[10px] cursor-pointer"
            >
              <option value="">None / Default</option>
              {dyeColors.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Add Layer Pattern */}
          <div className="bg-zinc-950/20 p-2.5 rounded border border-zinc-900 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-zinc-500">Pattern Color</span>
                <select
                  value={bannerColor}
                  onChange={(e) => setBannerColor(e.target.value)}
                  className="h-8 px-2 rounded border border-zinc-800 bg-zinc-800 text-zinc-200 outline-none text-[10px] cursor-pointer"
                >
                  {dyeColors.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-zinc-500">Pattern Design</span>
                <select
                  value={bannerPattern}
                  onChange={(e) => setBannerPattern(e.target.value)}
                  className="h-8 px-2 rounded border border-zinc-800 bg-zinc-800 text-zinc-200 outline-none text-[10px] cursor-pointer"
                >
                  {bannerPatterns.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddBannerPattern}
              className="w-full h-7 bg-zinc-800 hover:bg-zinc-750 text-[10px] font-medium text-zinc-200 rounded flex items-center justify-center gap-1 transition-colors border border-zinc-850"
            >
              <Plus size={12} />
              <span>Add Pattern Layer</span>
            </button>
          </div>
        </div>

        {/* Pattern List */}
        {item.banner_meta && item.banner_meta.length > 0 ? (
          <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto pr-1">
            {item.banner_meta.map((bMeta, idx) => (
              <div key={idx} className="flex justify-between items-center bg-zinc-900/30 px-3 py-1.5 border border-zinc-850 rounded">
                <div className="flex gap-1.5 items-center font-mono text-[10px]">
                  <span className="text-zinc-500">Layer {idx + 1}:</span>
                  <span className="text-zinc-300 font-semibold">{bMeta.color} {bMeta.pattern}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveBannerPattern(idx)}
                  className="p-1 rounded hover:bg-red-950/40 text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <Trash size={11} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[10px] text-zinc-650 italic text-center py-1">
            No design pattern layers defined.
          </div>
        )}
      </div>

      {/* Armor Trim Section */}
      <div className="border-t border-zinc-800/60 pt-4 flex flex-col gap-3">
        <span className="font-semibold text-zinc-400 uppercase tracking-wide">Armor Trim Modifiers</span>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-zinc-500 font-medium">Trim Material</span>
            <select
              value={item.trim_material || ''}
              onChange={(e) => updateItem(item.slot, { trim_material: e.target.value })}
              className="h-8 px-2 rounded border border-zinc-800 bg-zinc-800 text-zinc-200 outline-none text-[10px] cursor-pointer"
            >
              <option value="">None</option>
              {trimMaterials.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-zinc-500 font-medium">Trim Pattern</span>
            <select
              value={item.trim_pattern || ''}
              onChange={(e) => updateItem(item.slot, { trim_pattern: e.target.value })}
              className="h-8 px-2 rounded border border-zinc-800 bg-zinc-800 text-zinc-200 outline-none text-[10px] cursor-pointer"
            >
              <option value="">None</option>
              {trimPatterns.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Warning if only one of them is set */}
        {((item.trim_material && !item.trim_pattern) || (!item.trim_material && item.trim_pattern)) && (
          <div className="flex gap-2 p-2 rounded bg-amber-950/20 border border-amber-900/30 text-[9px] text-amber-300 items-start leading-relaxed animate-fadeIn">
            <AlertCircle size={14} className="shrink-0 text-amber-500 mt-0.5" />
            <span>
              <strong>Note:</strong> Both **Trim Material** and **Trim Pattern** are required for Minecraft armor trim styling to take effect.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
