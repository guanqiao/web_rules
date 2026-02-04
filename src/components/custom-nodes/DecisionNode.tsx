import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from 'antd';
import { BranchesOutlined } from '@ant-design/icons';

export const DecisionNode: React.FC<NodeProps> = ({ data, selected }) => {
  const config = data.config || {} as any;
  
  return (
    <Card
      size="small"
      style={{
        width: 220,
        borderColor: selected ? '#1890ff' : '#722ed1',
        backgroundColor: '#f9f0ff',
        minWidth: 220
      }}
      bodyStyle={{ padding: '12px' }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BranchesOutlined style={{ color: '#722ed1', fontSize: 16 }} />
          <span style={{ fontWeight: 600, fontSize: 13 }}>{String(data.label)}</span>
        </div>
      }
    >
      <div style={{ fontSize: 11, color: '#666' }}>
        {config.expression && (
          <div style={{ marginBottom: 4 }}>
            <strong>表达式:</strong> {String(config.expression)}
          </div>
        )}
        {config.thenActions && config.thenActions.length > 0 && (
          <div>
            <strong>Then动作:</strong> {config.thenActions.length}个
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left} style={{ background: '#722ed1' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#722ed1' }} />
    </Card>
  );
};
