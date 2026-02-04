import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

export const StartNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <Card
      size="small"
      style={{
        width: 120,
        borderColor: selected ? '#1890ff' : '#52c41a',
        backgroundColor: '#f6ffed',
        minWidth: 120
      }}
      bodyStyle={{ padding: '8px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <PlayCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />
        <span style={{ fontWeight: 600, fontSize: 12 }}>{data.label}</span>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#52c41a' }} />
    </Card>
  );
};
