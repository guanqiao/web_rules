import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Node, Edge } from '@xyflow/react';

interface EditorState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  undoStack: Array<{ nodes: Node[]; edges: Edge[] }>;
  redoStack: Array<{ nodes: Node[]; edges: Edge[] }>;
  maxHistorySize: number;
  
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNode: (node: Node | null) => void;
  
  addNode: (node: Node) => void;
  updateNode: (nodeId: string, data: any) => void;
  deleteNode: (nodeId: string) => void;
  addEdge: (edge: Edge) => void;
  deleteEdge: (edgeId: string) => void;
  
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  saveState: () => void;
  clearHistory: () => void;
}

export const useEditorStore = create<EditorState>()(
  immer((set, get) => ({
    nodes: [],
    edges: [],
    selectedNode: null,
    undoStack: [],
    redoStack: [],
    maxHistorySize: 50,
    
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
    setSelectedNode: (node) => set({ selectedNode: node }),
    
    addNode: (node) => set((state) => {
      state.nodes.push(node);
      get().saveState();
    }),
    
    updateNode: (nodeId, data) => set((state) => {
      const node = state.nodes.find(n => n.id === nodeId);
      if (node) {
        node.data = data;
        get().saveState();
      }
    }),
    
    deleteNode: (nodeId) => set((state) => {
      state.nodes = state.nodes.filter(n => n.id !== nodeId);
      state.edges = state.edges.filter(e => e.source !== nodeId && e.target !== nodeId);
      if (state.selectedNode?.id === nodeId) {
        state.selectedNode = null;
      }
      get().saveState();
    }),
    
    addEdge: (edge) => set((state) => {
      state.edges.push(edge);
      get().saveState();
    }),
    
    deleteEdge: (edgeId) => set((state) => {
      state.edges = state.edges.filter(e => e.id !== edgeId);
      get().saveState();
    }),
    
    undo: () => set((state) => {
      if (state.undoStack.length > 0) {
        const currentState = { nodes: state.nodes, edges: state.edges };
        const previousState = state.undoStack.pop()!;
        
        state.redoStack.push(currentState);
        state.nodes = previousState.nodes;
        state.edges = previousState.edges;
      }
    }),
    
    redo: () => set((state) => {
      if (state.redoStack.length > 0) {
        const currentState = { nodes: state.nodes, edges: state.edges };
        const nextState = state.redoStack.pop()!;
        
        state.undoStack.push(currentState);
        state.nodes = nextState.nodes;
        state.edges = nextState.edges;
      }
    }),
    
    canUndo: () => get().undoStack.length > 0,
    canRedo: () => get().redoStack.length > 0,
    
    saveState: () => set((state) => {
      const currentState = { nodes: state.nodes, edges: state.edges };
      state.undoStack.push(currentState);
      
      if (state.undoStack.length > state.maxHistorySize) {
        state.undoStack.shift();
      }
      
      state.redoStack = [];
    }),
    
    clearHistory: () => set({ undoStack: [], redoStack: [] })
  }))
);
