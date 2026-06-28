import React, { useState, useEffect, useMemo } from 'react';
import { useMenuStore } from '../../store/useMenuStore';
import { generateYaml } from '../../utils/yamlGenerator';
import { Copy, Download, Check } from 'lucide-react';

export default function YamlPreview() {
  const storeState = useMenuStore();
  const { menuName, showToast } = storeState;

  const [yamlText, setYamlText] = useState('');
  const [copied, setCopied] = useState(false);

  // Debounced YAML Generation (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      const state = useMenuStore.getState();
      setYamlText(generateYaml(state));
    }, 300);

    return () => clearTimeout(timer);
  }, [
    storeState.menuName,
    storeState.menu_title,
    storeState.open_command,
    storeState.size,
    storeState.inventory_type,
    storeState.update_interval,
    storeState.open_requirement,
    storeState.open_commands,
    storeState.items
  ]);

  const highlightedLines = useMemo(() => {
    if (!yamlText) return [];
    return yamlText.split('\n').map((line) => {
      const match = line.match(/^(\s*)([^:#][^:]*)(:)(.*)$/);
      if (!match) return { raw: line };
      return {
        indent: match[1],
        key: match[2],
        colon: match[3],
        value: match[4]
      };
    });
  }, [yamlText]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yamlText);
      setCopied(true);
      showToast('YAML copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showToast(`Copy failed: ${error.message}`, 'error');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([yamlText], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${menuName || 'menu'}.yml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('YAML file downloaded!', 'success');
  };

  return (
    <div className="w-full max-w-3xl h-[70vh] flex flex-col border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 shadow-2xl relative">
      {/* Code Block Toolbar */}
      <div className="h-10 border-b border-zinc-800 bg-zinc-900 px-4 flex items-center justify-between shrink-0 select-none">
        <span className="text-[10px] text-zinc-500 font-mono tracking-wider">
          {menuName}.yml (GENERATED OUTPUT)
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:text-zinc-100 bg-zinc-850 rounded hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:text-zinc-100 bg-zinc-850 rounded hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            <Download size={12} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Preformed Code Body */}
      <div className="flex-1 overflow-auto p-5 font-mono text-[11px] leading-relaxed bg-zinc-950 select-text">
        <pre className="h-full">
          <code className="block h-full text-zinc-400 whitespace-pre">
            {highlightedLines.length > 0 ? highlightedLines.map((line, index) => (
              <React.Fragment key={`${index}-${line.raw || line.key}`}>
                {line.raw !== undefined ? (
                  <span>{line.raw}</span>
                ) : (
                  <>
                    <span>{line.indent}</span>
                    <span className="text-indigo-400 font-semibold">{line.key}</span>
                    <span>{line.colon}</span>
                    <span className={/(:?\s*)(true|false)\b/.test(line.value) ? 'text-emerald-500 font-medium' : /(:?\s*)-?\d+(\.\d+)?\b/.test(line.value) ? 'text-yellow-500' : 'text-zinc-300'}>{line.value}</span>
                  </>
                )}
                {index < highlightedLines.length - 1 ? '\n' : ''}
              </React.Fragment>
            )) : '# Loading configuration...'}
          </code>
        </pre>
      </div>
    </div>
  );
}
