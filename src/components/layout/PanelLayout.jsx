import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import InventoryGrid from '../menu/InventoryGrid';
import YamlPreview from '../output/YamlPreview';
import ItemEditor from '../item/ItemEditor';
import { useMenuStore } from '../../store/useMenuStore';
import { Grid, FileCode2 } from 'lucide-react';

export default function PanelLayout() {
  const { selectedSlot } = useMenuStore();
  const [centerTab, setCenterTab] = useState('grid');

  return (
    <div className="flex flex-col min-h-screen lg:h-screen overflow-x-hidden lg:overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      <TopBar />

      <div className="flex-1 flex flex-col lg:flex-row overflow-visible lg:overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col bg-zinc-950 border-r border-zinc-800 overflow-hidden min-h-[70vh]">
          <div className="h-auto min-h-11 border-b border-zinc-800/80 bg-zinc-900/30 px-3 sm:px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 select-none">
            <div className="flex gap-1.5 p-0.5 rounded bg-zinc-900 border border-zinc-800/60 w-full sm:w-auto">
              <button
                onClick={() => setCenterTab('grid')}
                className={`flex flex-1 sm:flex-none items-center justify-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                  centerTab === 'grid'
                    ? 'bg-zinc-800 text-indigo-400 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Grid size={13} />
                <span>Visual Grid</span>
              </button>
              <button
                onClick={() => setCenterTab('yaml')}
                className={`flex flex-1 sm:flex-none items-center justify-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all duration-200 ${
                  centerTab === 'yaml'
                    ? 'bg-zinc-800 text-indigo-400 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FileCode2 size={13} />
                <span>YAML Output</span>
              </button>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono hidden sm:block">
              dmenu.barzzly.com
            </div>
          </div>

          <div className="flex-1 overflow-auto p-3 sm:p-5 lg:p-8 flex items-start lg:items-center justify-start lg:justify-center min-w-0">
            {centerTab === 'grid' ? <InventoryGrid /> : <YamlPreview />}
          </div>
        </div>

        <div className={`w-full lg:w-[380px] shrink-0 bg-zinc-900 border-l border-zinc-800 flex flex-col max-h-[80vh] lg:h-full overflow-hidden transition-all duration-300 ${
          selectedSlot !== null ? 'translate-x-0 opacity-100' : 'hidden lg:flex lg:translate-x-full lg:w-0 lg:border-l-0 opacity-0'
        }`}>
          {selectedSlot !== null && <ItemEditor />}
        </div>
      </div>
    </div>
  );
}