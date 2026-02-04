import React, { useCallback, useState, useRef } from 'react';
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
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { NodePalette, NodeType } from '@/components/NodePalette/NodePalette';
import { PropertyPanel } from '@/components/PropertyPanel/PropertyPanel';
import { Toolbar } from '@/components/Toolbar/Toolbar';
import { DroolsPreview } from '@/components/DroolsPreview/DroolsPreview';

import { StartNode } from '@/components/custom-nodes/StartNode';
import { EndNode } from '@/components/custom-nodes/EndNode';
import { ConditionNode } from '@/components/custom-nodes/ConditionNode';
import { ActionNode } from '@/components/custom-nodes/ActionNode';
import { DecisionNode } from '@/components/custom-nodes/DecisionNode';
import { GroupNode } from '@/components/custom-nodes/GroupNode';

import { generateNodeId, validateConnection, downloadFile } from '@/utils/helpers';
import { compileToDRL, compileToJar } from '@/engines/DroolsCompiler';
import { RuleNode } from '@/types/rule.types';
import { Modal, Input, message } from 'antd';

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  condition: ConditionNode,
  action: ActionNode,
  decision: DecisionNode,
  group: GroupNode
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export const RuleEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [compiledDRL, setCompiledDRL] = useState<string>('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [ruleName, setRuleName] = useState('my-rules');
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      if (validateConnection(params.source!, params.target!, edges)) {
        setEdges((eds) => addEdge(params, eds));
      } else {
        message.warning('连接已存在或无效');
      }
    },
    [edges, setEdges]
  );

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
  }, [setNodes, setEdges]);

  const onCompile = useCallback(() => {
    if (nodes.length === 0) {
      message.warning('请先添加节点');
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
      message.success('编译成功');
    } catch (error) {
      message.error('编译失败: ' + (error as Error).message);
    }
  }, [nodes, edges]);

  const onPreview = useCallback(() => {
    if (nodes.length === 0) {
      message.warning('请先添加节点');
      return;
    }
    onCompile();
    setPreviewVisible(true);
  }, [nodes, onCompile]);

  const onDownload = useCallback(async () => {
    if (nodes.length === 0) {
      message.warning('请先添加节点');
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
      
      message.success('下载成功');
    } catch (error) {
      message.error('下载失败: ' + (error as Error).message);
    }
  }, [nodes, edges, compiledDRL, ruleName]);

  const onDownloadJar = useCallback(async () => {
    if (nodes.length === 0) {
      message.warning('请先添加节点');
      return;
    }

    try {
      message.loading({ content: '正在生成 JAR 文件...', key: 'jarDownload' });
      
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
      
      message.success({ content: 'JAR 文件下载成功', key: 'jarDownload' });
    } catch (error) {
      message.error({ content: 'JAR 文件生成失败: ' + (error as Error).message, key: 'jarDownload' });
    }
  }, [nodes, edges, ruleName]);

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
    message.success('保存成功');
  }, [nodes, edges, ruleName]);

  const onClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setCompiledDRL('');
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

  const canCompile = nodes.length > 0;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        onPreview={onPreview}
        onCompile={onCompile}
        onDownload={onDownload}
        onDownloadJar={onDownloadJar}
        onSave={onSave}
        onClear={onClear}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onFitView={onFitView}
        canCompile={canCompile}
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
            onPaneClick={onPaneClick}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
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
          </ReactFlow>
        </div>

        <div style={{ width: 300, borderLeft: '1px solid #f0f0f0', overflowY: 'auto' }}>
          <PropertyPanel
            selectedNode={selectedNode}
            onUpdateNode={onUpdateNode}
            onDeleteNode={onDeleteNode}
          />
        </div>
      </div>

      <DroolsPreview
        visible={previewVisible}
        drlCode={compiledDRL}
        onClose={() => setPreviewVisible(false)}
        nodesCount={nodes.length}
        edgesCount={edges.length}
      />

      <Modal
        title="保存配置"
        open={saveModalVisible}
        onOk={handleSave}
        onCancel={() => setSaveModalVisible(false)}
      >
        <Input
          placeholder="输入规则名称"
          value={ruleName}
          onChange={(e) => setRuleName(e.target.value)}
        />
      </Modal>
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
