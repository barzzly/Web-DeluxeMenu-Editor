import React, { useState } from 'react';
import { ACTION_TYPES } from '../../../constants/actionTypes';
import { Plus, Trash, ArrowUp, ArrowDown, ChevronDown, ChevronRight } from 'lucide-react';

export default function TabCommands({ item, updateItem }) {
  // Local state to manage which click type sections are collapsed
  const [collapsed, setCollapsed] = useState({
    click_commands: false,
    left_click_commands: true,
    right_click_commands: true,
    middle_click_commands: true,
    shift_left_click_commands: true,
    shift_right_click_commands: true
  });

  const clickSections = [
    { key: 'click_commands', label: 'Any Click Actions' },
    { key: 'left_click_commands', label: 'Left Click Actions' },
    { key: 'right_click_commands', label: 'Right Click Actions' },
    { key: 'middle_click_commands', label: 'Middle Click Actions' },
    { key: 'shift_left_click_commands', label: 'Shift Left Click Actions' },
    { key: 'shift_right_click_commands', label: 'Shift Right Click Actions' }
  ];

  // Helper to parse prefix & text from DeluxeMenus action string
  const parseAction = (actionStr) => {
    if (!actionStr) return { prefix: '[player]', text: '' };
    
    // Check match against known action types
    const found = ACTION_TYPES.find(act => actionStr.startsWith(act.prefix));
    if (found) {
      return {
        prefix: found.prefix,
        text: actionStr.substring(found.prefix.length).trim()
      };
    }
    
    // Check fallback bracket prefix: e.g. [arbitrary]
    const bracketMatch = actionStr.match(/^(\[[^\]]+\])(.*)/);
    if (bracketMatch) {
      return {
        prefix: bracketMatch[1],
        text: bracketMatch[2].trim()
      };
    }
    
    return { prefix: '[player]', text: actionStr };
  };

  const handleAddCommand = (key) => {
    const list = [...(item[key] || [])];
    list.push('[player] ');
    updateItem(item.slot, { [key]: list });
  };

  const handleUpdateCommand = (key, idx, prefix, text) => {
    const list = [...(item[key] || [])];
    list[idx] = `${prefix} ${text.trim()}`;
    updateItem(item.slot, { [key]: list });
  };

  const handleRemoveCommand = (key, idx) => {
    const list = item[key].filter((_, i) => i !== idx);
    updateItem(item.slot, { [key]: list });
  };

  const handleMoveCommand = (key, idx, direction) => {
    const list = [...(item[key] || [])];
    if (direction === 'up' && idx > 0) {
      const temp = list[idx];
      list[idx] = list[idx - 1];
      list[idx - 1] = temp;
    } else if (direction === 'down' && idx < list.length - 1) {
      const temp = list[idx];
      list[idx] = list[idx + 1];
      list[idx + 1] = temp;
    }
    updateItem(item.slot, { [key]: list });
  };

  const toggleCollapse = (key) => {
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-4 text-xs">
      <p className="text-[10px] text-zinc-500 italic pb-1">
        Configure actions that trigger when players click this inventory slot. Select a prefix type and enter the command.
      </p>

      {clickSections.map(({ key, label }) => {
        const commandList = item[key] || [];
        const isCollapsed = collapsed[key];

        return (
          <div key={key} className="border border-zinc-800 rounded bg-zinc-900/20 overflow-hidden">
            {/* Header Accordion Trigger */}
            <button
              type="button"
              onClick={() => toggleCollapse(key)}
              className="w-full flex items-center justify-between px-3 py-2 bg-zinc-900 hover:bg-zinc-850 transition-colors text-zinc-300 font-medium border-b border-zinc-800/40"
            >
              <span className="font-mono text-[11px] font-semibold">
                {label} ({commandList.length})
              </span>
              {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
            </button>

            {/* List Body */}
            {!isCollapsed && (
              <div className="p-3 flex flex-col gap-3">
                {commandList.length === 0 ? (
                  <div className="text-[10px] text-zinc-500 italic text-center py-2">
                    No commands configured.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {commandList.map((cmdString, idx) => {
                      const { prefix, text } = parseAction(cmdString);
                      return (
                        <div key={idx} className="flex gap-2 items-start bg-zinc-950/40 p-2 border border-zinc-850 rounded">
                          {/* Prefix Dropdown */}
                          <div className="flex-1 flex flex-col gap-2">
                            <div className="flex gap-1.5">
                              <select
                                value={prefix}
                                onChange={(e) => handleUpdateCommand(key, idx, e.target.value, text)}
                                className="h-8 px-1.5 rounded border border-zinc-800 bg-zinc-800 text-zinc-300 outline-none focus:border-indigo-500 shrink-0 font-mono text-[10px] max-w-[100px] cursor-pointer"
                              >
                                {ACTION_TYPES.map(act => (
                                  <option key={act.prefix} value={act.prefix}>{act.prefix}</option>
                                ))}
                                {/* Custom prefix fallback option */}
                                {!ACTION_TYPES.some(a => a.prefix === prefix) && prefix && (
                                  <option value={prefix}>{prefix}</option>
                                )}
                              </select>
                              
                              <input
                                type="text"
                                value={text}
                                onChange={(e) => handleUpdateCommand(key, idx, prefix, e.target.value)}
                                placeholder="Command or message body..."
                                className="flex-1 h-8 px-2 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
                              />
                            </div>
                            
                            {/* Command action description label helper */}
                            {ACTION_TYPES.find(a => a.prefix === prefix) && (
                              <span className="text-[9px] text-zinc-500 leading-none">
                                {ACTION_TYPES.find(a => a.prefix === prefix).description}
                              </span>
                            )}
                          </div>

                          {/* Reordering & Deletion Actions */}
                          <div className="flex flex-col gap-1 shrink-0">
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => handleMoveCommand(key, idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 rounded bg-zinc-850 hover:bg-zinc-800 text-zinc-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                              >
                                <ArrowUp size={11} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveCommand(key, idx, 'down')}
                                disabled={idx === commandList.length - 1}
                                className="p-1 rounded bg-zinc-850 hover:bg-zinc-800 text-zinc-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                              >
                                <ArrowDown size={11} />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveCommand(key, idx)}
                              className="p-1.5 rounded bg-zinc-850 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <Trash size={11} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add Command Button */}
                <button
                  type="button"
                  onClick={() => handleAddCommand(key)}
                  className="w-full flex items-center justify-center gap-1.5 h-8 border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-850/20 hover:bg-zinc-850/40 rounded text-[10px] text-zinc-400 hover:text-zinc-200 transition-all font-medium"
                >
                  <Plus size={12} />
                  <span>Add Action Line</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
