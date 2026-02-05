import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Node, Edge } from '@xyflow/react';
import { DataModel } from '@/types/rule.types';

interface EditorState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  dataModels: DataModel[];
  undoStack: Array<{ nodes: Node[]; edges: Edge[]; dataModels: DataModel[] }>;
  redoStack: Array<{ nodes: Node[]; edges: Edge[]; dataModels: DataModel[] }>;
  maxHistorySize: number;
  
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNode: (node: Node | null) => void;
  setDataModels: (dataModels: DataModel[]) => void;
  
  addNode: (node: Node) => void;
  updateNode: (nodeId: string, data: any) => void;
  deleteNode: (nodeId: string) => void;
  addEdge: (edge: Edge) => void;
  deleteEdge: (edgeId: string) => void;
  addDataModel: (dataModel: DataModel) => void;
  updateDataModel: (modelId: string, dataModel: DataModel) => void;
  deleteDataModel: (modelId: string) => void;
  
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
    dataModels: [],
    undoStack: [],
    redoStack: [],
    maxHistorySize: 50,
    
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
    setSelectedNode: (node) => set({ selectedNode: node }),
    setDataModels: (dataModels) => set({ dataModels }),
    
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
    
    addDataModel: (dataModel) => set((state) => {
      state.dataModels.push(dataModel);
      get().saveState();
    }),
    
    updateDataModel: (modelId, dataModel) => set((state) => {
      const index = state.dataModels.findIndex(m => m.id === modelId);
      if (index !== -1) {
        state.dataModels[index] = dataModel;
        get().saveState();
      }
    }),
    
    deleteDataModel: (modelId) => set((state) => {
      state.dataModels = state.dataModels.filter(m => m.id !== modelId);
      get().saveState();
    }),
    
    undo: () => set((state) => {
      if (state.undoStack.length > 0) {
        const currentState = { nodes: state.nodes, edges: state.edges, dataModels: state.dataModels };
        const previousState = state.undoStack.pop()!;
        
        state.redoStack.push(currentState);
        state.nodes = previousState.nodes;
        state.edges = previousState.edges;
        state.dataModels = previousState.dataModels;
      }
    }),
    
    redo: () => set((state) => {
      if (state.redoStack.length > 0) {
        const currentState = { nodes: state.nodes, edges: state.edges, dataModels: state.dataModels };
        const nextState = state.redoStack.pop()!;
        
        state.undoStack.push(currentState);
        state.nodes = nextState.nodes;
        state.edges = nextState.edges;
        state.dataModels = nextState.dataModels;
      }
    }),
    
    canUndo: () => get().undoStack.length > 0,
    canRedo: () => get().redoStack.length > 0,
    
    saveState: () => set((state) => {
      const currentState = { nodes: state.nodes, edges: state.edges, dataModels: state.dataModels };
      state.undoStack.push(currentState);
      
      if (state.undoStack.length > state.maxHistorySize) {
        state.undoStack.shift();
      }
      
      state.redoStack = [];
    }),
    
    clearHistory: () => set({ undoStack: [], redoStack: [] })
  }))
);
