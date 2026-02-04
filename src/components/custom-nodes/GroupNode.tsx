import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from 'antd';
import { FolderOutlined } from '@ant-design/icons';

export const GroupNode: React.FC<NodeProps> = ({ data, selected }) => {
  const config = data.config || {} as any;
  
  return (
    <Card
      size="small"
      style={{
        width: 200,
        borderColor: selected ? '#1890ff' : '#13c2c2',
        backgroundColor: '#e6fffb',
        minWidth: 200
      }}
      bodyStyle={{ padding: '12px' }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FolderOutlined style={{ color: '#13c2c2', fontSize: 16 }} />
          <span style={{ fontWeight: 600, fontSize: 13 }}>{String(data.label)}</span>
        </div>
      }
    >
      <div style={{ fontSize: 11, color: '#666' }}>
        {config.agendaGroup && (
          <div style={{ marginBottom: 4 }}>
            <strong>议程组:</strong> {String(config.agendaGroup)}
          </div>
        )}
        {config.salience !== undefined && (
          <div style={{ marginBottom: 4 }}>
            <strong>优先级:</strong> {String(config.salience)}
          </div>
        )}
        {config.activationGroup && (
          <div>
            <strong>激活组:</strong> {String(config.activationGroup)}
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left} style={{ background: '#13c2c2' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#13c2c2' }} />
    </Card>
  );
};
