import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

export const ConditionNode: React.FC<NodeProps> = ({ data, selected }) => {
  const config = data.config || {} as any;
  
  return (
    <Card
      size="small"
      style={{
        width: 200,
        borderColor: selected ? '#1890ff' : '#1890ff',
        backgroundColor: '#e6f7ff',
        minWidth: 200
      }}
      bodyStyle={{ padding: '12px' }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FilterOutlined style={{ color: '#1890ff', fontSize: 16 }} />
          <span style={{ fontWeight: 600, fontSize: 13 }}>{String(data.label)}</span>
        </div>
      }
    >
      <div style={{ fontSize: 11, color: '#666' }}>
        {config.field && (
          <div style={{ marginBottom: 4 }}>
            <strong>字段:</strong> {String(config.field)}
          </div>
        )}
        {config.operator && (
          <div style={{ marginBottom: 4 }}>
            <strong>操作:</strong> {String(config.operator)}
          </div>
        )}
        {config.value !== undefined && (
          <div>
            <strong>值:</strong> {String(config.value)}
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left} style={{ background: '#1890ff' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#1890ff' }} />
    </Card>
  );
};
