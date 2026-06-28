import React, { useState } from 'react';
import Toggle from '../../ui/Toggle';
import TagInput from '../../ui/TagInput';
import { Plus, Trash, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function TabRequirements({ item, updateItem }) {
  const [activeSection, setActiveSection] = useState('view_requirement');

  const sections = [
    { key: 'view_requirement', label: 'View Requirement' },
    { key: 'click_requirement', label: 'Any Click Req' },
    { key: 'left_click_requirement', label: 'Left Click Req' },
    { key: 'right_click_requirement', label: 'Right Click Req' },
    { key: 'shift_left_click_requirement', label: 'Shift Left Click Req' },
    { key: 'shift_right_click_requirement', label: 'Shift Right Click Req' }
  ];

  const reqTypes = [
    { id: 'has permission', label: 'Has Permission' },
    { id: 'has money', label: 'Has Money' },
    { id: 'has item', label: 'Has Item' },
    { id: 'string equals', label: 'String Equals' },
    { id: 'string contains', label: 'String Contains' },
    { id: 'regex matches', label: 'Regex Matches' },
    { id: 'javascript', label: 'JavaScript Expression' },
    { id: 'has exp', label: 'Has EXP' },
    { id: 'has meta', label: 'Has Metadata' }
  ];

  const currentBlock = item[activeSection] || null;

  const handleToggleBlock = (enable) => {
    if (enable) {
      updateItem(item.slot, {
        [activeSection]: {
          requirements: {},
          deny_commands: [],
          minimum_requirements: '',
          stop_at_success: false
        }
      });
    } else {
      updateItem(item.slot, { [activeSection]: null });
    }
  };

  const handleUpdateBlockField = (field, value) => {
    if (!currentBlock) return;
    updateItem(item.slot, {
      [activeSection]: {
        ...currentBlock,
        [field]: value
      }
    });
  };

  const handleAddCheck = () => {
    if (!currentBlock) return;
    const currentReqs = { ...(currentBlock.requirements || {}) };
    
    // Find unique check ID key
    let idx = 1;
    while (currentReqs[`check_${idx}`]) {
      idx++;
    }
    const newKey = `check_${idx}`;
    
    currentReqs[newKey] = {
      type: 'has permission',
      permission: ''
    };

    handleUpdateBlockField('requirements', currentReqs);
  };

  const handleUpdateCheck = (checkKey, partial) => {
    if (!currentBlock) return;
    const currentReqs = { ...(currentBlock.requirements || {}) };
    if (currentReqs[checkKey]) {
      currentReqs[checkKey] = {
        ...currentReqs[checkKey],
        ...partial
      };
      handleUpdateBlockField('requirements', currentReqs);
    }
  };

  const handleRenameCheckKey = (oldKey, newKey) => {
    if (!currentBlock || !newKey.trim() || oldKey === newKey) return;
    const currentReqs = { ...(currentBlock.requirements || {}) };
    if (currentReqs[oldKey] && !currentReqs[newKey]) {
      currentReqs[newKey] = currentReqs[oldKey];
      delete currentReqs[oldKey];
      handleUpdateBlockField('requirements', currentReqs);
    }
  };

  const handleRemoveCheck = (checkKey) => {
    if (!currentBlock) return;
    const currentReqs = { ...(currentBlock.requirements || {}) };
    delete currentReqs[checkKey];
    handleUpdateBlockField('requirements', currentReqs);
  };

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* Sections Tab Row */}
      <div className="flex flex-wrap gap-1 border-b border-zinc-800 pb-2">
        {sections.map(sec => {
          const isActive = activeSection === sec.key;
          const isEnabled = item[sec.key] !== null && item[sec.key] !== undefined;
          return (
            <button
              key={sec.key}
              type="button"
              onClick={() => setActiveSection(sec.key)}
              className={`px-2.5 py-1.5 rounded font-mono text-[10px] border flex items-center gap-1.5 transition-colors ${
                isActive
                  ? 'bg-indigo-600 border-indigo-500 text-white font-medium shadow-sm'
                  : isEnabled
                    ? 'bg-indigo-900/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-900/20'
                    : 'bg-zinc-800 border-transparent text-zinc-400 hover:bg-zinc-750'
              }`}
            >
              <span>{sec.label}</span>
              {isEnabled && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Enable Toggle */}
      <div className="bg-zinc-900/20 p-3 rounded border border-zinc-800/40">
        <Toggle
          checked={currentBlock !== null}
          onChange={handleToggleBlock}
          label={`Enable ${sections.find(s => s.key === activeSection).label}`}
          description={`Adds requirements validation logic prior to rendering or triggering actions.`}
        />
      </div>

      {/* Requirement Details Forms */}
      {currentBlock && (
        <div className="flex flex-col gap-4 animate-fadeIn">
          {/* General Block Parameters */}
          <div className="grid grid-cols-2 gap-3 bg-zinc-900/10 p-3 rounded border border-zinc-800/20">
            <div className="flex flex-col gap-1.5">
              <span className="font-semibold text-zinc-400 uppercase tracking-wide text-[10px]">Minimum Reqs Required</span>
              <input
                type="text"
                value={currentBlock.minimum_requirements || ''}
                onChange={(e) => handleUpdateBlockField('minimum_requirements', e.target.value)}
                placeholder="all"
                className="w-full h-8 px-3 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            
            <div className="pt-2">
              <Toggle
                checked={currentBlock.stop_at_success || false}
                onChange={(val) => handleUpdateBlockField('stop_at_success', val)}
                label="Stop At Success"
                description="Halt validation checks upon first success."
              />
            </div>
          </div>

          {/* List of checks */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-zinc-800/30 pb-1">
              <span className="font-semibold text-zinc-400 uppercase tracking-wide">Checks List</span>
              <button
                type="button"
                onClick={handleAddCheck}
                className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <Plus size={12} />
                <span>Add Check</span>
              </button>
            </div>

            {Object.keys(currentBlock.requirements || {}).length === 0 ? (
              <div className="text-[10px] text-zinc-500 italic text-center py-4">
                No requirement checks configured. Click "Add Check".
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                {Object.keys(currentBlock.requirements).map(checkKey => {
                  const check = currentBlock.requirements[checkKey];
                  return (
                    <div key={checkKey} className="flex gap-2 items-start bg-zinc-900/30 p-3 rounded border border-zinc-800/50">
                      <div className="flex-1 flex flex-col gap-2.5">
                        {/* Check Key ID */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={checkKey}
                            onChange={(e) => handleRenameCheckKey(checkKey, e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                            placeholder="check_name"
                            className="w-1/2 h-8 px-2.5 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
                            title="Unique identifier key in YAML configuration"
                          />
                          
                          {/* Check Type */}
                          <select
                            value={check.type}
                            onChange={(e) => {
                              // Reset type fields
                              const newType = e.target.value;
                              const resetCheck = { type: newType };
                              handleUpdateCheck(checkKey, resetCheck);
                            }}
                            className="w-1/2 h-8 px-2.5 rounded border border-zinc-800 bg-zinc-800 text-zinc-250 outline-none focus:border-indigo-500 cursor-pointer text-[10px]"
                          >
                            {reqTypes.map(t => (
                              <option key={t.id} value={t.id}>{t.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Type specific fields */}
                        {check.type === 'has permission' && (
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-zinc-500">Permission Node</span>
                            <input
                              type="text"
                              value={check.permission || ''}
                              onChange={(e) => handleUpdateCheck(checkKey, { permission: e.target.value })}
                              placeholder="e.g. rank.vip"
                              className="w-full h-8 px-2.5 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
                            />
                          </div>
                        )}

                        {check.type === 'has money' && (
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-zinc-500">Balance Amount</span>
                            <input
                              type="text"
                              value={check.amount !== undefined ? check.amount : ''}
                              onChange={(e) => handleUpdateCheck(checkKey, { amount: e.target.value })}
                              placeholder="e.g. 500 or %placeholder%"
                              className="w-full h-8 px-2.5 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
                            />
                          </div>
                        )}

                        {check.type === 'has item' && (
                          <div className="flex flex-col gap-2 bg-zinc-950/20 p-2 border border-zinc-850/60 rounded">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-zinc-500">Material</span>
                                <input
                                  type="text"
                                  value={check.material || ''}
                                  onChange={(e) => handleUpdateCheck(checkKey, { material: e.target.value.toUpperCase() })}
                                  placeholder="DIAMOND"
                                  className="h-8 px-2 rounded border border-zinc-800 bg-zinc-800/45 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-zinc-500">Amount</span>
                                <input
                                  type="number"
                                  min="1"
                                  value={check.amount || 1}
                                  onChange={(e) => handleUpdateCheck(checkKey, { amount: parseInt(e.target.value, 10) || 1 })}
                                  className="h-8 px-2 rounded border border-zinc-800 bg-zinc-800/45 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {check.type === 'string equals' && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-zinc-500">Input String</span>
                              <input
                                type="text"
                                value={check.input || ''}
                                onChange={(e) => handleUpdateCheck(checkKey, { input: e.target.value })}
                                placeholder="%placeholder%"
                                className="h-8 px-2 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-zinc-500">Output String</span>
                              <input
                                type="text"
                                value={check.output || ''}
                                onChange={(e) => handleUpdateCheck(checkKey, { output: e.target.value })}
                                placeholder="expected"
                                className="h-8 px-2 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
                              />
                            </div>
                          </div>
                        )}

                        {check.type === 'string contains' && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-zinc-500">Base String</span>
                              <input
                                type="text"
                                value={check.input || ''}
                                onChange={(e) => handleUpdateCheck(checkKey, { input: e.target.value })}
                                placeholder="%placeholder%"
                                className="h-8 px-2 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-zinc-500">Contains Value</span>
                              <input
                                type="text"
                                value={check.output || ''}
                                onChange={(e) => handleUpdateCheck(checkKey, { output: e.target.value })}
                                placeholder="substr"
                                className="h-8 px-2 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
                              />
                            </div>
                          </div>
                        )}

                        {check.type === 'regex matches' && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-zinc-500">Input String</span>
                              <input
                                type="text"
                                value={check.input || ''}
                                onChange={(e) => handleUpdateCheck(checkKey, { input: e.target.value })}
                                placeholder="%placeholder%"
                                className="h-8 px-2 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-zinc-500">Regex Pattern</span>
                              <input
                                type="text"
                                value={check.value || ''}
                                onChange={(e) => handleUpdateCheck(checkKey, { value: e.target.value })}
                                placeholder="^[a-zA-Z]+$"
                                className="h-8 px-2 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
                              />
                            </div>
                          </div>
                        )}

                        {check.type === 'javascript' && (
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-zinc-500">Expression (returns true/false)</span>
                            <textarea
                              value={check.expression || ''}
                              onChange={(e) => handleUpdateCheck(checkKey, { expression: e.target.value })}
                              placeholder='e.g. "%vault_eco_balance%" >= 1000'
                              rows={2}
                              className="w-full p-2 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-250 outline-none focus:border-indigo-500 font-mono text-[10px] resize-y"
                            />
                          </div>
                        )}

                        {check.type === 'has exp' && (
                          <div className="grid grid-cols-2 gap-2 bg-zinc-950/20 p-2 border border-zinc-850/60 rounded">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-zinc-500">Amount / Ticks</span>
                              <input
                                type="number"
                                min="0"
                                value={check.amount || 0}
                                onChange={(e) => handleUpdateCheck(checkKey, { amount: parseInt(e.target.value, 10) || 0 })}
                                className="h-8 px-2 rounded border border-zinc-800 bg-zinc-800/45 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
                              />
                            </div>
                            <div className="pt-5 pl-2">
                              <Toggle
                                checked={check.level || false}
                                onChange={(val) => handleUpdateCheck(checkKey, { level: val })}
                                label="Check Levels"
                                description=""
                              />
                            </div>
                          </div>
                        )}

                        {check.type === 'has meta' && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-zinc-500">Meta Key</span>
                              <input
                                type="text"
                                value={check.key || ''}
                                onChange={(e) => handleUpdateCheck(checkKey, { key: e.target.value })}
                                placeholder="my_meta_key"
                                className="h-8 px-2 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-zinc-500">Expected Value</span>
                              <input
                                type="text"
                                value={check.value || ''}
                                onChange={(e) => handleUpdateCheck(checkKey, { value: e.target.value })}
                                placeholder="value"
                                className="h-8 px-2 rounded border border-zinc-800 bg-zinc-800/40 text-zinc-200 outline-none focus:border-indigo-500 font-mono text-[10px]"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Remove Check Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveCheck(checkKey)}
                        className="p-1.5 rounded bg-zinc-850 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 transition-colors shrink-0 mt-1"
                        title="Remove Check"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Deny Commands tag list */}
          <div className="flex flex-col gap-1.5 border-t border-zinc-800/60 pt-4 mt-2">
            <span className="font-semibold text-zinc-400 uppercase tracking-wide">Deny Actions</span>
            <TagInput
              tags={currentBlock.deny_commands || []}
              onChange={(newTags) => handleUpdateBlockField('deny_commands', newTags)}
              placeholder="e.g. [message] Requirement unmet."
            />
            <span className="text-[10px] text-zinc-500">Actions triggered if validation checks fail.</span>
          </div>
        </div>
      )}
    </div>
  );
}
