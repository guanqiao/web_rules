import { Node, Edge } from '@xyflow/react';

const STORAGE_KEY = 'web-rules-auto-save';
const AUTO_SAVE_INTERVAL = 30000;

interface AutoSaveData {
  nodes: Node[];
  edges: Edge[];
  metadata: {
    savedAt: string;
    version: string;
  };
}

export class AutoSaveManager {
  private timer: ReturnType<typeof setInterval> | null = null;
  private onSaveCallback?: () => void;

  constructor() {
    this.loadFromStorage();
  }

  startAutoSave(
    getNodes: () => Node[],
    getEdges: () => Edge[],
    callback?: () => void
  ): void {
    this.onSaveCallback = callback;
    
    this.timer = setInterval(() => {
      this.save(getNodes(), getEdges());
    }, AUTO_SAVE_INTERVAL);
  }

  stopAutoSave(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  save(nodes: Node[], edges: Edge[]): void {
    const data: AutoSaveData = {
      nodes,
      edges,
      metadata: {
        savedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (this.onSaveCallback) {
        this.onSaveCallback();
      }
    } catch (error) {
      console.error('Auto save failed:', error);
    }
  }

  loadFromStorage(): AutoSaveData | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Load from storage failed:', error);
    }
    return null;
  }

  clearStorage(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  hasAutoSave(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  getLastSavedTime(): Date | null {
    const data = this.loadFromStorage();
    return data ? new Date(data.metadata.savedAt) : null;
  }
}

export const autoSaveManager = new AutoSaveManager();
