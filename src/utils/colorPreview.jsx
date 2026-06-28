import React from 'react';

export function parseMinecraftColors(text) {
  if (text === undefined || text === null) return [];
  const textStr = String(text);
  
  const tokens = [];
  const colorRegex = /(&[0-9a-fk-or])|(&#[0-9a-fA-F]{6})/g;
  
  let match;
  let lastIndex = 0;
  
  let currentState = {
    colorClass: 'text-zinc-300',
    hexColor: null,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    obfuscated: false
  };

  const colorMap = {
    '0': 'mc-black',
    '1': 'mc-dark_blue',
    '2': 'mc-dark_green',
    '3': 'mc-dark_aqua',
    '4': 'mc-dark_red',
    '5': 'mc-dark_purple',
    '6': 'mc-gold',
    '7': 'mc-gray',
    '8': 'mc-dark_gray',
    '9': 'mc-blue',
    'a': 'mc-green',
    'b': 'mc-aqua',
    'c': 'mc-red',
    'd': 'mc-light_purple',
    'e': 'mc-yellow',
    'f': 'mc-white'
  };

  const addChunk = (str) => {
    if (str) {
      tokens.push({
        text: str,
        ...currentState
      });
    }
  };

  while ((match = colorRegex.exec(textStr)) !== null) {
    const prevText = textStr.substring(lastIndex, match.index);
    addChunk(prevText);

    const code = match[0];
    if (code.startsWith('&#')) {
      currentState.hexColor = code.substring(2);
      currentState.colorClass = null;
    } else {
      const char = code.charAt(1).toLowerCase();
      if (colorMap[char] !== undefined) {
        currentState.colorClass = colorMap[char];
        currentState.hexColor = null;
        currentState.bold = false;
        currentState.italic = false;
        currentState.underline = false;
        currentState.strikethrough = false;
        currentState.obfuscated = false;
      } else {
        switch (char) {
          case 'l': currentState.bold = true; break;
          case 'o': currentState.italic = true; break;
          case 'n': currentState.underline = true; break;
          case 'm': currentState.strikethrough = true; break;
          case 'k': currentState.obfuscated = true; break;
          case 'r':
            currentState = {
              colorClass: 'text-zinc-300',
              hexColor: null,
              bold: false,
              italic: false,
              underline: false,
              strikethrough: false,
              obfuscated: false
            };
            break;
        }
      }
    }
    lastIndex = colorRegex.lastIndex;
  }

  const remaining = textStr.substring(lastIndex);
  addChunk(remaining);

  return tokens;
}

export function MinecraftText({ text }) {
  const parsed = parseMinecraftColors(text);
  if (parsed.length === 0) return <span>&nbsp;</span>;
  
  return (
    <span>
      {parsed.map((token, idx) => {
        const style = {};
        if (token.hexColor) {
          style.color = `#${token.hexColor}`;
        }
        
        let classes = token.colorClass || '';
        if (token.bold) classes += ' mc-bold';
        if (token.italic) classes += ' mc-italic';
        if (token.underline) classes += ' mc-underlined';
        if (token.strikethrough) classes += ' mc-strikethrough';
        if (token.obfuscated) classes += ' mc-obfuscated';
        
        return (
          <span key={idx} className={classes.trim()} style={style}>
            {token.text}
          </span>
        );
      })}
    </span>
  );
}
