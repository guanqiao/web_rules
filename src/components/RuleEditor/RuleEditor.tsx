import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  ReactFlowProvider,
  Panel,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { NodePalette, NodeType } from '@/components/NodePalette/NodePalette';
import { PropertyPanel } from '@/components/PropertyPanel/PropertyPanel';
import { Toolbar } from '@/components/Toolbar/Toolbar';
import { DroolsPreview } from '@/components/DroolsPreview/DroolsPreview';
import { VariableManager } from '@/components/VariableManager/VariableManager';
import { TestPanel } from '@/components/TestPanel/TestPanel';

import { StartNode } from '@/components/custom-nodes/StartNode';
import { EndNode } from '@/components/custom-nodes/EndNode';
import { ConditionNode } from '@/components/custom-nodes/ConditionNode';
import { ActionNode } from '@/components/custom-nodes/ActionNode';
import { DecisionNode } from '@/components/custom-nodes/DecisionNode';
import { GroupNode } from '@/components/custom-nodes/GroupNode';
import CustomEdge from '@/components/custom-edges/CustomEdge';

import { generateNodeId, validateConnection, downloadFile } from '@/utils/helpers';
import { compileToDRL, compileToJar } from '@/engines/DroolsCompiler';
import { buildAndDownloadCompiledJar, DroolsJarBuilder } from '@/engines/DroolsJarBuilder';
import { RuleNode } from '@/types/rule.types';
import { Modal, Input, message, Button, Space, Tooltip, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEditorStore } from '@/stores/useEditorStore';
import { autoSaveManager } from '@/utils/autoSave';
import { 
  BorderOutlined, 
  AppstoreOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined
} from '@ant-design/icons';

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  condition: ConditionNode,
  action: ActionNode,
  decision: DecisionNode,
  group: GroupNode
};

const edgeTypes = {
  default: CustomEdge
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export const RuleEditor: React.FC = () => {
  const { t } = useTranslation();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [compiledDRL, setCompiledDRL] = useState<string>('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [isDrlEdited, setIsDrlEdited] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [ruleName, setRuleName] = useState('my-rules');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('unsaved');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [variableManagerVisible, setVariableManagerVisible] = useState(false);
  const [testPanelVisible, setTestPanelVisible] = useState(false);
  const [variables, setVariables] = useState<any[]>([]);
  const [isCompilerAvailable, setIsCompilerAvailable] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileStatus, setCompileStatus] = useState<'idle' | 'compiling' | 'success' | 'error'>('idle');
  const [compileMessage, setCompileMessage] = useState('');
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const canUndo = useEditorStore((state) => state.canUndo());
  const canRedo = useEditorStore((state) => state.canRedo());
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);

  useEffect(() => {
    const savedData = autoSaveManager.loadFromStorage();
    if (savedData) {
      setNodes(savedData.nodes);
      setEdges(savedData.edges);
      setSaveStatus('saved');
      setLastSavedTime(new Date(savedData.metadata.savedAt));
    }

    autoSaveManager.startAutoSave(
      () => nodes,
      () => edges,
      () => {
        setSaveStatus('saved');
        setLastSavedTime(new Date());
      }
    );

    // 检查编译服务是否可用
    DroolsJarBuilder.checkCompilerHealth().then(available => {
      setIsCompilerAvailable(available);
      if (available) {
        console.log('Java compiler service is available');
      }
    });

    return () => {
      autoSaveManager.stopAutoSave();
    };
  }, []);

  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      setSaveStatus('unsaved');
    }
  }, [nodes, edges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (validateConnection(params.source!, params.target!, edges)) {
        const newEdge = addEdge(params, edges);
        setEdges(newEdge);
        
        const sourceNode = nodes.find(n => n.id === params.source);
        const targetNode = nodes.find(n => n.id === params.target);
        
        if (sourceNode && targetNode) {
          const recommendations = getSmartConnectionRecommendations(targetNode, nodes, edges);
          if (recommendations.length > 0) {
            message.info({
              content: (
                <div>
                  <div>{t('editor.smartConnect.suggestions')}</div>
                  {recommendations.map((rec, idx) => (
                    <div key={idx} style={{ marginLeft: 16, fontSize: 12, color: '#1890ff' }}>
                      • {rec}
                    </div>
                  ))}
                </div>
              ),
              duration: 3
            });
          }
        }
      } else {
        message.warning(t('editor.validation.invalidConnection'));
      }
    },
    [edges, setEdges, t, nodes]
  );

  const getSmartConnectionRecommendations = (node: Node, allNodes: Node[], allEdges: Edge[]): string[] => {
    const recommendations: string[] = [];
    const connectedSources = allEdges
      .filter(e => e.target === node.id)
      .map(e => allNodes.find(n => n.id === e.source)?.type);
    
    const connectedTargets = allEdges
      .filter(e => e.source === node.id)
      .map(e => allNodes.find(n => n.id === e.target)?.type);

    switch (node.type) {
      case 'start':
        if (!connectedTargets.includes('condition') && !connectedTargets.includes('action')) {
          recommendations.push(t('nodePalette.nodeTypes.condition') + ' - ' + t('editor.smartConnect.forCondition'));
          recommendations.push(t('nodePalette.nodeTypes.action') + ' - ' + t('editor.smartConnect.forAction'));
        }
        break;
      case 'condition':
        if (!connectedTargets.includes('action')) {
          recommendations.push(t('nodePalette.nodeTypes.action') + ' - ' + t('editor.smartConnect.afterCondition'));
        }
        if (!connectedTargets.includes('condition')) {
          recommendations.push(t('nodePalette.nodeTypes.condition') + ' - ' + t('editor.smartConnect.moreConditions'));
        }
        if (!connectedTargets.includes('decision')) {
          recommendations.push(t('nodePalette.nodeTypes.decision') + ' - ' + t('editor.smartConnect.complexLogic'));
        }
        break;
      case 'action':
        if (!connectedTargets.includes('end') && !connectedTargets.includes('action')) {
          recommendations.push(t('nodePalette.nodeTypes.end') + ' - ' + t('editor.smartConnect.finishFlow'));
          recommendations.push(t('nodePalette.nodeTypes.action') + ' - ' + t('editor.smartConnect.continueActions'));
        }
        break;
      case 'decision':
        if (!connectedTargets.includes('action')) {
          recommendations.push(t('nodePalette.nodeTypes.action') + ' - ' + t('editor.smartConnect.branchAction'));
        }
        if (!connectedTargets.includes('end')) {
          recommendations.push(t('nodePalette.nodeTypes.end') + ' - ' + t('editor.smartConnect.finishFlow'));
        }
        break;
      case 'group':
        if (!connectedTargets.includes('end')) {
          recommendations.push(t('nodePalette.nodeTypes.end') + ' - ' + t('editor.smartConnect.finishGroupFlow'));
        }
        break;
    }
    
    return recommendations;
  };

  const onDragStart = useCallback((event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType.type);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });

      const newNode: Node = {
        id: generateNodeId(),
        type,
        position: position || { x: 0, y: 0 },
        data: {
          label: type.charAt(0).toUpperCase() + type.slice(1),
          config: {}
        }
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const onSelectionChange = useCallback((params: any) => {
    if (params.edges && params.edges.length > 0) {
      setSelectedEdge(params.edges[0]);
      setSelectedNode(null);
    } else if (params.nodes && params.nodes.length > 0) {
      setSelectedNode(params.nodes[0]);
      setSelectedEdge(null);
    }
  }, []);

  const onUpdateNode = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data } : node
      )
    );
  }, [setNodes]);

  const onDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [setNodes, setEdges]);

  const onDeleteEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    setSelectedEdge(null);
  }, [setEdges]);

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (selectedNode && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        event.preventDefault();
        onDeleteNode(selectedNode.id);
      } else if (selectedEdge && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        event.preventDefault();
        onDeleteEdge(selectedEdge.id);
      }
    }
  }, [selectedNode, selectedEdge, onDeleteNode, onDeleteEdge]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  const onCompile = useCallback(() => {
    if (nodes.length === 0) {
      message.warning(t('editor.validation.emptyNodes'));
      return;
    }

    try {
      const connections = edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle || undefined,
        targetHandle: e.targetHandle || undefined
      }));
      const drl = compileToDRL(nodes as RuleNode[], connections);
      setCompiledDRL(drl);
      setIsDrlEdited(false);
      message.success(t('editor.validation.compileSuccess'));
    } catch (error) {
      message.error(t('editor.validation.compileFailed', { error: (error as Error).message }));
    }
  }, [nodes, edges, t]);

  const onPreview = useCallback(() => {
    if (nodes.length === 0) {
      message.warning(t('editor.validation.emptyNodes'));
      return;
    }
    if (!isDrlEdited) {
      onCompile();
    }
    setPreviewVisible(true);
  }, [nodes, onCompile, t, isDrlEdited]);

  const onDownload = useCallback(async () => {
    if (nodes.length === 0) {
      message.warning(t('editor.validation.emptyNodes'));
      return;
    }

    try {
      const connections = edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle || undefined,
        targetHandle: e.targetHandle || undefined
      }));
      const drl = compiledDRL || compileToDRL(nodes as RuleNode[], connections);
      
      const zip = new JSZip();
      
      zip.file('rules.drl', drl);
      
      const readme = `# Drools 规则包

## 使用说明

1. 将 rules.drl 文件放入您的 Drools 项目资源目录
2. 加载规则文件:
   \`\`\`java
   KieServices kieServices = KieServices.Factory.get();
   KieContainer kieContainer = kieServices.getKieClasspathContainer();
   KieSession kieSession = kieContainer.newKieSession();
   \`\`\`

3. 插入事实并执行规则:
   \`\`\`java
   kieSession.insert(fact);
   kieSession.fireAllRules();
   \`\`\`

## 规则信息
- 生成时间: ${new Date().toISOString()}
- 节点数量: ${nodes.length}
- 连线数量: ${edges.length}
`;

      zip.file('README.md', readme);

      const config = JSON.stringify({
        nodes,
        edges,
        metadata: {
          name: ruleName,
          version: '1.0.0',
          createdAt: new Date().toISOString()
        }
      }, null, 2);

      zip.file('config.json', config);

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${ruleName}-drools-package.zip`);
      
      message.success(t('editor.validation.downloadSuccess'));
    } catch (error) {
      message.error(t('editor.validation.downloadFailed', { error: (error as Error).message }));
    }
  }, [nodes, edges, compiledDRL, ruleName, t]);

  const onDownloadJar = useCallback(async () => {
    if (nodes.length === 0) {
      message.warning(t('editor.validation.emptyNodes'));
      return;
    }

    try {
      message.loading({ content: t('toolbar.saving'), key: 'jarDownload' });
      
      const connections = edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle || undefined,
        targetHandle: e.targetHandle || undefined
      }));
      
      const filename = `${ruleName}-1.0.0.jar`;
      await compileToJar(nodes as RuleNode[], connections, {
        version: '1.0.0',
        vendor: 'Web Rules',
        description: `Generated Drools Rules - ${ruleName}`,
        includeKModule: true
      }, filename);
      
      message.success({ content: t('editor.validation.downloadSuccess'), key: 'jarDownload' });
    } catch (error) {
      message.error({ content: t('editor.validation.downloadFailed', { error: (error as Error).message }), key: 'jarDownload' });
    }
  }, [nodes, edges, ruleName, t]);

  const onDownloadCompiledJar = useCallback(async () => {
    if (nodes.length === 0) {
      message.warning(t('editor.validation.emptyNodes'));
      return;
    }

    const dataModels = useEditorStore.getState().dataModels;
    if (!dataModels || dataModels.length === 0) {
      message.warning('请先配置数据模型');
      return;
    }

    setIsCompiling(true);
    setCompileStatus('compiling');
    setCompileMessage('正在编译数据模型...');

    try {
      const connections = edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle || undefined,
        targetHandle: e.targetHandle || undefined
      }));
      
      const result = await buildAndDownloadCompiledJar(
        {
          name: ruleName,
          packageName: 'com.rules',
          imports: [],
          globals: [],
          rules: []
        },
        {
          version: '1.0.0',
          vendor: 'Web Rules',
          description: `Compiled Drools Rules - ${ruleName}`,
          includeKModule: true,
          dataModels: dataModels
        }
      );
      
      if (result.success) {
        setCompileStatus('success');
        setCompileMessage(`编译成功！已下载 ${dataModels.length} 个数据模型`);
        message.success({ content: '编译并下载成功！', key: 'compiledJarDownload' });
        
        // 3秒后重置状态
        setTimeout(() => {
          setCompileStatus('idle');
          setCompileMessage('');
        }, 3000);
      } else {
        setCompileStatus('error');
        setCompileMessage(result.error || '编译失败');
        message.error({ content: result.error || '编译失败', key: 'compiledJarDownload' });
      }
    } catch (error) {
      setCompileStatus('error');
      setCompileMessage(`编译失败: ${(error as Error).message}`);
      message.error({ content: `编译失败: ${(error as Error).message}`, key: 'compiledJarDownload' });
    } finally {
      setIsCompiling(false);
    }
  }, [nodes, edges, ruleName, t]);

  const onSave = useCallback(() => {
    setSaveModalVisible(true);
  }, []);

  const handleSave = useCallback(() => {
    const config = JSON.stringify({
      nodes,
      edges,
      metadata: {
        name: ruleName,
        version: '1.0.0',
        updatedAt: new Date().toISOString()
      }
    }, null, 2);
    
    downloadFile(config, `${ruleName}.json`, 'application/json');
    setSaveModalVisible(false);
    setSaveStatus('saved');
    setLastSavedTime(new Date());
    message.success(t('messages.saveSuccess'));
  }, [nodes, edges, ruleName, t]);

  const onClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setSelectedEdge(null);
    setCompiledDRL('');
    setSaveStatus('unsaved');
  }, [setNodes, setEdges]);

  const onZoomIn = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomIn();
    }
  }, [reactFlowInstance]);

  const onZoomOut = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomOut();
    }
  }, [reactFlowInstance]);

  const onFitView = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
    }
  }, [reactFlowInstance]);

  const onOpenVariables = useCallback(() => {
    setVariableManagerVisible(true);
  }, []);

  const onOpenTest = useCallback(() => {
    setTestPanelVisible(true);
  }, []);

  const onApplyTemplate = useCallback((template: any) => {
    const offsetX = 50;
    const offsetY = 50;
    
    // 创建旧节点ID到新节点ID的映射
    const nodeIdMap: Record<string, string> = {};
    
    const newNodes = template.nodes.map((node: any) => {
      const newId = generateNodeId();
      nodeIdMap[node.id] = newId;
      return {
        ...node,
        id: newId,
        position: {
          x: node.position.x + offsetX,
          y: node.position.y + offsetY
        }
      };
    });
    
    const newEdges = template.edges.map((edge: any) => ({
      ...edge,
      id: `edge-${Date.now()}-${Math.random()}`,
      // 更新连线的source和target为新的节点ID
      source: nodeIdMap[edge.source],
      target: nodeIdMap[edge.target]
    }));
    
    setNodes(newNodes);
    setEdges(newEdges);
    setSaveStatus('unsaved');
    message.success(t('templates.templateApplied') + '：' + template.name);
  }, [setNodes, setEdges]);

  const canCompile = nodes.length > 0;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        onPreview={onPreview}
        onCompile={onCompile}
        onDownload={onDownload}
        onDownloadJar={onDownloadJar}
        onDownloadCompiledJar={onDownloadCompiledJar}
        isCompilerAvailable={isCompilerAvailable}
        onSave={onSave}
        onClear={onClear}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onFitView={onFitView}
        canCompile={canCompile}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        saveStatus={saveStatus}
        lastSavedTime={lastSavedTime}
        onApplyTemplate={onApplyTemplate}
        onOpenVariables={onOpenVariables}
        onOpenTest={onOpenTest}
        isCompiling={isCompiling}
        compileStatus={compileStatus}
        compileMessage={compileMessage}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: 240, borderRight: '1px solid #f0f0f0', overflowY: 'auto' }}>
          <NodePalette onDragStart={onDragStart} />
        </div>

        <div style={{ flex: 1, position: 'relative' }} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onSelectionChange={onSelectionChange}
            onPaneClick={onPaneClick}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            snapToGrid={snapToGrid}
            snapGrid={[15, 15]}
            attributionPosition="bottom-left"
          >
            {showGrid && <Background variant={BackgroundVariant.Dots} gap={15} size={1} />}
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                switch (node.type) {
                  case 'start': return '#52c41a';
                  case 'end': return '#ff4d4f';
                  case 'condition': return '#1890ff';
                  case 'action': return '#faad14';
                  case 'decision': return '#722ed1';
                  case 'group': return '#13c2c2';
                  default: return '#ccc';
                }
              }}
              style={{ height: 120 }}
            />
            
            <Panel position="top-right">
              <Space direction="vertical" size="small">
                <Tooltip title={t('editor.showGrid')}>
                  <Switch
                    checked={showGrid}
                    onChange={setShowGrid}
                    checkedChildren={t('editor.gridOn')}
                    unCheckedChildren={t('editor.gridOff')}
                    size="small"
                  />
                </Tooltip>
                <Tooltip title={t('editor.snapToGrid')}>
                  <Switch
                    checked={snapToGrid}
                    onChange={setSnapToGrid}
                    checkedChildren={t('editor.snapOn')}
                    unCheckedChildren={t('editor.snapOff')}
                    size="small"
                  />
                </Tooltip>
              </Space>
            </Panel>
          </ReactFlow>
        </div>

        <div style={{ width: 300, borderLeft: '1px solid #f0f0f0', overflowY: 'auto' }}>
          <PropertyPanel
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            onUpdateNode={onUpdateNode}
            onDeleteNode={onDeleteNode}
            onDeleteEdge={onDeleteEdge}
          />
        </div>
      </div>

      <DroolsPreview
        visible={previewVisible}
        drlCode={compiledDRL}
        onClose={() => setPreviewVisible(false)}
        nodesCount={nodes.length}
        edgesCount={edges.length}
        onSave={(editedCode) => {
          setCompiledDRL(editedCode);
          setIsDrlEdited(true);
        }}
      />

      <Modal
        title={t('toolbar.save')}
        open={saveModalVisible}
        onOk={handleSave}
        onCancel={() => setSaveModalVisible(false)}
      >
        <Input
          placeholder={t('propertyPanel.nodeNamePlaceholder')}
          value={ruleName}
          onChange={(e) => setRuleName(e.target.value)}
        />
      </Modal>

      <VariableManager
        visible={variableManagerVisible}
        onClose={() => setVariableManagerVisible(false)}
        variables={variables}
        onSave={(newVariables) => setVariables(newVariables)}
      />

      <TestPanel
        visible={testPanelVisible}
        onClose={() => setTestPanelVisible(false)}
        nodes={nodes}
        edges={edges}
        onCompile={async () => {
          const connections = edges.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            sourceHandle: e.sourceHandle || undefined,
            targetHandle: e.targetHandle || undefined
          }));
          return compileToDRL(nodes as RuleNode[], connections);
        }}
      />
    </div>
  );
};

export const RuleEditorWithProvider: React.FC = () => {
  return (
    <ReactFlowProvider>
      <RuleEditor />
    </ReactFlowProvider>
  );
};
