import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, Badge } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

export const StartNode: React.FC<NodeProps> = ({ data, selected }) => {
  const config = data.config || {} as any;
  const status = config.status || 'idle';
  
  const getStatusBadge = () => {
    switch (status) {
      case 'success':
        return <Badge status="success" />;
      case 'error':
        return <Badge status="error" />;
      case 'processing':
        return <Badge status="processing" />;
      case 'warning':
        return <Badge status="warning" />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        transition: 'all 0.3s ease',
        transform: selected ? 'scale(1.05)' : 'scale(1)',
        filter: selected ? 'drop-shadow(0 4px 12px rgba(82, 196, 26, 0.4))' : 'none'
      }}
    >
      <Card
        size="small"
        style={{
          width: 140,
          height: 140,
          borderRadius: '50%',
          borderColor: selected ? '#1890ff' : '#52c41a',
          backgroundColor: selected ? '#f0f9ff' : '#f6ffed',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: selected ? '0 8px 24px rgba(82, 196, 26, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: selected ? '3px solid #1890ff' : '2px solid #52c41a',
          cursor: 'grab',
          transition: 'all 0.3s ease'
        }}
        bodyStyle={{ padding: '12px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      >
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          {getStatusBadge()}
        </div>
        <PlayCircleOutlined 
          style={{ 
            color: '#52c41a', 
            fontSize: 32,
            marginBottom: 8,
            animation: status === 'processing' ? 'pulse 1.5s ease-in-out infinite' : 'none'
          }} 
        />
        <span style={{ fontWeight: 700, fontSize: 13, color: '#262626' }}>{String(data.label)}</span>
        {config.description && (
          <span style={{ fontSize: 10, color: '#8c8c8c', marginTop: 4, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {config.description}
          </span>
        )}
      </Card>
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ 
          background: '#52c41a',
          width: 12,
          height: 12,
          border: '2px solid #fff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }} 
      />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};
