import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';

export const ActionNode: React.FC<NodeProps> = ({ data, selected }) => {
  const config = data.config || {};
  
  return (
    <Card
      size="small"
      style={{
        width: 200,
        borderColor: selected ? '#1890ff' : '#faad14',
        backgroundColor: '#fffbe6',
        minWidth: 200
      }}
      bodyStyle={{ padding: '12px' }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThunderboltOutlined style={{ color: '#faad14', fontSize: 16 }} />
          <span style={{ fontWeight: 600, fontSize: 13 }}>{data.label}</span>
        </div>
      }
    >
      <div style={{ fontSize: 11, color: '#666' }}>
        {config.type && (
          <div style={{ marginBottom: 4 }}>
            <strong>类型:</strong> {config.type}
          </div>
        )}
        {config.target && (
          <div style={{ marginBottom: 4 }}>
            <strong>目标:</strong> {config.target}
          </div>
        )}
        {config.value !== undefined && (
          <div>
            <strong>值:</strong> {String(config.value)}
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left} style={{ background: '#faad14' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#faad14' }} />
    </Card>
  );
};
