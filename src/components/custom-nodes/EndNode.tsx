import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from 'antd';
import { StopOutlined } from '@ant-design/icons';

export const EndNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <Card
      size="small"
      style={{
        width: 120,
        borderColor: selected ? '#1890ff' : '#ff4d4f',
        backgroundColor: '#fff1f0',
        minWidth: 120
      }}
      bodyStyle={{ padding: '8px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <StopOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />
        <span style={{ fontWeight: 600, fontSize: 12 }}>{data.label}</span>
      </div>
      <Handle type="target" position={Position.Left} style={{ background: '#ff4d4f' }} />
    </Card>
  );
};
