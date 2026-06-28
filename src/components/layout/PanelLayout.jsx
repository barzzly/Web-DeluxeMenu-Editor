import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import InventoryGrid from '../menu/InventoryGrid';
import YamlPreview from '../output/YamlPreview';
import ItemEditor from '../item/ItemEditor';
import { useMenuStore } from '../../store/useMenuStore';
import { Grid, FileCode2, Edit3 } from 'lucide-react';

export default function PanelLayout() {
  const { selectedSlot } = useMenuStore();
  const [centerTab, setCenterTab] = useState('grid'); // 'grid' | 'yaml'

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      {/* Top Bar */}
      <TopBar />

      {/* Main Panel Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center Panel (Grid or YAML Output) */}
        <div className="flex-1 flex flex-col bg-zinc-950 border-r border-zinc-800 overflow-hidden">
          {/* Center Tabs Header */}
          <div className="h-11 border-b border-zinc-800/80 bg-zinc-900/30 px-4 flex items-center justify-between select-none">
            <div className="flex gap-1.5 p-0.5 rounded bg-zinc-900 border border-zinc-800/60">
              <button
                onClick={() => setCenterTab('grid')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                  centerTab === 'grid'
                    ? 'bg-zinc-800 text-indigo-400'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Grid size={13} />
                <span>Visual Grid</span>
              </button>
              <button
                onClick={() => setCenterTab('yaml')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                  centerTab === 'yaml'
                    ? 'bg-zinc-800 text-indigo-400'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FileCode2 size={13} />
                <span>YAML Output</span>
              </button>
            </div>
            
            <div className="text-[10px] text-zinc-500 font-mono">
              Workspace Editor
            </div>
          </div>

          {/* Center Panel Work Area */}
          <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center min-w-[500px]">
            {centerTab === 'grid' ? <InventoryGrid /> : <YamlPreview />}
          </div>
        </div>

        {/* Right Panel (Item Editor) */}
        <div className={`w-[380px] shrink-0 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full overflow-hidden transition-all duration-200 ${
          selectedSlot !== null ? 'translate-x-0' : 'translate-x-full w-0 border-l-0'
        }`}>
          {selectedSlot !== null && <ItemEditor />}
        </div>
      </div>
    </div>
  );
}
