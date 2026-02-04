export interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  category: 'edit' | 'view' | 'file' | 'help';
}

export const shortcuts: Shortcut[] = [];

export const registerShortcut = (shortcut: Shortcut) => {
  shortcuts.push(shortcut);
};

export const unregisterShortcut = (key: string) => {
  const index = shortcuts.findIndex(s => s.key === key);
  if (index !== -1) {
    shortcuts.splice(index, 1);
  }
};

export const executeShortcut = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase();
  const ctrlKey = event.ctrlKey || event.metaKey;
  const shiftKey = event.shiftKey;
  const altKey = event.altKey;

  let shortcutKey = '';
  if (ctrlKey) shortcutKey += 'ctrl+';
  if (shiftKey) shortcutKey += 'shift+';
  if (altKey) shortcutKey += 'alt+';
  shortcutKey += key;

  const shortcut = shortcuts.find(s => s.key.toLowerCase() === shortcutKey.toLowerCase());
  if (shortcut) {
    event.preventDefault();
    shortcut.action();
  }
};

export const getDefaultShortcuts = (): Shortcut[] => {
  return [
    {
      key: 'Ctrl+Z',
      description: 'shortcuts.undo',
      action: () => {},
      category: 'edit'
    },
    {
      key: 'Ctrl+Y',
      description: 'shortcuts.redo',
      action: () => {},
      category: 'edit'
    },
    {
      key: 'Ctrl+S',
      description: 'shortcuts.save',
      action: () => {},
      category: 'file'
    },
    {
      key: 'Delete',
      description: 'shortcuts.delete',
      action: () => {},
      category: 'edit'
    },
    {
      key: 'Ctrl+C',
      description: 'shortcuts.copy',
      action: () => {},
      category: 'edit'
    },
    {
      key: 'Ctrl+V',
      description: 'shortcuts.paste',
      action: () => {},
      category: 'edit'
    },
    {
      key: 'Ctrl+A',
      description: 'shortcuts.selectAll',
      action: () => {},
      category: 'edit'
    },
    {
      key: 'Ctrl++',
      description: 'shortcuts.zoomIn',
      action: () => {},
      category: 'view'
    },
    {
      key: 'Ctrl+-',
      description: 'shortcuts.zoomOut',
      action: () => {},
      category: 'view'
    },
    {
      key: 'Ctrl+0',
      description: 'shortcuts.fitView',
      action: () => {},
      category: 'view'
    },
    {
      key: 'Ctrl+F',
      description: 'shortcuts.search',
      action: () => {},
      category: 'edit'
    },
    {
      key: 'F5',
      description: 'shortcuts.preview',
      action: () => {},
      category: 'view'
    },
    {
      key: 'F6',
      description: 'shortcuts.compile',
      action: () => {},
      category: 'file'
    },
    {
      key: 'F1',
      description: 'shortcuts.help',
      action: () => {},
      category: 'help'
    }
  ];
};
