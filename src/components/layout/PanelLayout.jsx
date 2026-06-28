import React, { useState, useEffect } from 'react';
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

  // Resizable panels state
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [itemEditorWidth, setItemEditorWidth] = useState(380);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingItemEditor, setIsResizingItemEditor] = useState(false);

  // Responsive screen detection
  const [isLargeScreen, setIsLargeScreen] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingSidebar) {
        // Clamp sidebar between 200px and 500px
        const newWidth = Math.max(200, Math.min(500, e.clientX));
        setSidebarWidth(newWidth);
      }
      if (isResizingItemEditor) {
        // Clamp item editor between 280px and 600px
        const newWidth = Math.max(280, Math.min(600, window.innerWidth - e.clientX));
        setItemEditorWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      setIsResizingItemEditor(false);
    };

    if (isResizingSidebar || isResizingItemEditor) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizingSidebar, isResizingItemEditor]);

  const sidebarStyle = isLargeScreen ? { width: `${sidebarWidth}px`, minWidth: `${sidebarWidth}px` } : {};
  const itemEditorStyle = isLargeScreen && selectedSlot !== null 
    ? { width: `${itemEditorWidth}px`, minWidth: `${itemEditorWidth}px` } 
    : {};

  return (
    <div className="relative z-10 flex flex-col min-h-screen lg:h-screen overflow-x-hidden lg:overflow-hidden text-zinc-100 font-sans">
      <TopBar />

      <div className="flex-1 flex flex-col lg:flex-row overflow-visible lg:overflow-hidden">
        <Sidebar style={sidebarStyle} />

        {/* Resizer left */}
        {isLargeScreen && (
          <div 
            onMouseDown={() => setIsResizingSidebar(true)}
            className={`w-1 cursor-col-resize h-full transition-all shrink-0 select-none z-30 ${
              isResizingSidebar ? 'bg-indigo-600 w-1.5' : 'bg-zinc-800 hover:bg-indigo-500/50 hover:w-1.5'
            }`}
          />
        )}

        <div className="flex-1 flex flex-col bg-zinc-950/65 border-y lg:border-y-0 lg:border-r border-zinc-800/70 overflow-hidden min-h-[68vh] backdrop-blur-sm">
          <div className="h-auto min-h-11 border-b border-zinc-800/80 bg-zinc-900/55 px-3 sm:px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 select-none backdrop-blur">
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

          <div className="flex-1 overflow-auto p-3 sm:p-5 lg:p-8 flex items-start lg:items-center justify-start lg:justify-center min-w-0 mobile-scroll-pad">
            {centerTab === 'grid' ? <InventoryGrid /> : <YamlPreview />}
          </div>
        </div>

        {/* Resizer right */}
        {isLargeScreen && selectedSlot !== null && (
          <div 
            onMouseDown={() => setIsResizingItemEditor(true)}
            className={`w-1 cursor-col-resize h-full transition-all shrink-0 select-none z-30 ${
              isResizingItemEditor ? 'bg-indigo-600 w-1.5' : 'bg-zinc-800 hover:bg-indigo-500/50 hover:w-1.5'
            }`}
          />
        )}

        <div 
          style={itemEditorStyle}
          className={`w-full shrink-0 bg-zinc-900/95 border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col max-h-none lg:h-full overflow-hidden transition-all backdrop-blur-xl ${
            isResizingItemEditor ? 'duration-0' : 'duration-300'
          } ${
            selectedSlot !== null ? 'translate-x-0 opacity-100' : 'hidden lg:flex lg:translate-x-full lg:w-0 lg:border-l-0 opacity-0'
          }`}
        >
          {selectedSlot !== null && <ItemEditor />}
        </div>
      </div>
    </div>
  );
}