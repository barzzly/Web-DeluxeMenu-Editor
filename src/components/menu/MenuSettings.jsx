import React from 'react';
import { useMenuStore } from '../../store/useMenuStore';
import ColorCodeInput from '../ui/ColorCodeInput';
import TagInput from '../ui/TagInput';

export default function MenuSettings() {
  const {
    menu_title,
    open_command,
    size,
    update_interval,
    open_commands,
    open_requirement,
    setMenuField,
    setMenuSize
  } = useMenuStore();

  // Extraction of open requirement permission & deny commands
  const reqPermission = open_requirement?.requirements?.permission_check?.permission || '';
  const reqDenyCommands = open_requirement?.requirements?.permission_check?.deny_commands || [];

  const handleRequirementPermissionChange = (newPerm) => {
    if (!newPerm.trim()) {
      setMenuField('open_requirement', null);
      return;
    }
    const updated = {
      requirements: {
        permission_check: {
          type: 'has permission',
          permission: newPerm,
          deny_commands: reqDenyCommands
        }
      }
    };
    setMenuField('open_requirement', updated);
  };

  const handleRequirementDenyCommandsChange = (newDenyCmds) => {
    if (!reqPermission.trim()) return; // only update if permission is set
    const updated = {
      requirements: {
        permission_check: {
          type: 'has permission',
          permission: reqPermission,
          deny_commands: newDenyCmds
        }
      }
    };
    setMenuField('open_requirement', updated);
  };

  return (
    <div className="flex flex-col gap-5 p-4 text-xs">
      {/* Menu Title */}
      <ColorCodeInput
        label="Menu Title"
        value={menu_title}
        onChange={(val) => setMenuField('menu_title', val)}
        placeholder="e.g. &8Main Menu"
      />

      {/* Open Command */}
      <div className="flex flex-col gap-1.5">
        <span className="font-semibold text-zinc-400 uppercase tracking-wide">Open Command</span>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-zinc-500 font-mono">/</span>
          <input
            type="text"
            value={open_command}
            onChange={(e) => setMenuField('open_command', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            placeholder="menu"
            className="w-full h-9 pl-6 pr-3 rounded border border-zinc-800 bg-zinc-800/50 text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all font-mono"
          />
        </div>
        <span className="text-[10px] text-zinc-500">Player command to open this menu (no slash).</span>
      </div>

      {/* Size */}
      <div className="flex flex-col gap-1.5">
        <span className="font-semibold text-zinc-400 uppercase tracking-wide">Menu Size</span>
        <select
          value={size}
          onChange={(e) => setMenuSize(parseInt(e.target.value, 10))}
          className="w-full h-9 px-3 rounded border border-zinc-800 bg-zinc-800 text-zinc-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all cursor-pointer"
        >
          <option value={9}>9 slots (1 row)</option>
          <option value={18}>18 slots (2 rows)</option>
          <option value={27}>27 slots (3 rows)</option>
          <option value={36}>36 slots (4 rows)</option>
          <option value={45}>45 slots (5 rows)</option>
          <option value={54}>54 slots (6 rows)</option>
        </select>
        <span className="text-[10px] text-zinc-500">DeluxeMenus standard chest grid size.</span>
      </div>

      {/* Update Interval */}
      <div className="flex flex-col gap-1.5">
        <span className="font-semibold text-zinc-400 uppercase tracking-wide">Update Interval (ticks)</span>
        <input
          type="number"
          min="1"
          value={update_interval || ''}
          onChange={(e) => setMenuField('update_interval', e.target.value ? parseInt(e.target.value, 10) : '')}
          placeholder="20"
          className="w-full h-9 px-3 rounded border border-zinc-800 bg-zinc-800/50 text-zinc-200 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all font-mono"
        />
        <span className="text-[10px] text-zinc-500">20 ticks = 1 second.</span>
      </div>

      {/* Open Commands */}
      <div className="flex flex-col gap-1.5">
        <span className="font-semibold text-zinc-400 uppercase tracking-wide">Open Actions</span>
        <TagInput
          tags={open_commands}
          onChange={(newTags) => setMenuField('open_commands', newTags)}
          placeholder="e.g. [message] Opening Menu..."
        />
        <span className="text-[10px] text-zinc-500">Actions when menu is opened. Press Enter or comma.</span>
      </div>

      {/* Open Requirement */}
      <div className="border-t border-zinc-800/60 pt-4 flex flex-col gap-3">
        <span className="font-semibold text-zinc-400 uppercase tracking-wide text-xs">Permission Guard</span>
        
        <div className="flex flex-col gap-1.5">
          <span className="text-zinc-500 font-medium">Require Permission</span>
          <input
            type="text"
            value={reqPermission}
            onChange={(e) => handleRequirementPermissionChange(e.target.value)}
            placeholder="e.g. rank.vip"
            className="w-full h-9 px-3 rounded border border-zinc-800 bg-zinc-800/50 text-zinc-200 placeholder:text-zinc-650 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all font-mono"
          />
        </div>

        {reqPermission.trim() && (
          <div className="flex flex-col gap-1.5 animate-fadeIn">
            <span className="text-zinc-500 font-medium">Deny Actions</span>
            <TagInput
              tags={reqDenyCommands}
              onChange={handleRequirementDenyCommandsChange}
              placeholder="e.g. [message] No permission!"
            />
          </div>
        )}
      </div>
    </div>
  );
}
