import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, Badge } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';

export const ActionNode: React.FC<NodeProps> = ({ data, selected }) => {
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

  const getActionTypeColor = (type: string) => {
    switch (type) {
      case 'set':
        return '#52c41a';
      case 'call':
        return '#1890ff';
      case 'insert':
        return '#13c2c2';
      case 'retract':
        return '#ff4d4f';
      case 'modify':
        return '#faad14';
      default:
        return '#8c8c8c';
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        transition: 'all 0.3s ease',
        transform: selected ? 'scale(1.05)' : 'scale(1)',
        filter: selected ? 'drop-shadow(0 4px 12px rgba(250, 173, 20, 0.4))' : 'none'
      }}
    >
      <Card
        size="small"
        style={{
          width: 220,
          borderColor: selected ? '#1890ff' : '#faad14',
          backgroundColor: selected ? '#fffbe6' : '#fffbe6',
          minWidth: 220,
          boxShadow: selected ? '0 8px 24px rgba(250, 173, 20, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: selected ? '3px solid #1890ff' : '2px solid #faad14',
          cursor: 'grab',
          transition: 'all 0.3s ease',
          borderRadius: 12
        }}
        styles={{ body: { padding: '14px' } }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ThunderboltOutlined 
              style={{ 
                color: '#faad14', 
                fontSize: 18,
                animation: status === 'processing' ? 'pulse 1.5s ease-in-out infinite' : 'none'
              }} 
            />
            <span style={{ fontWeight: 700, fontSize: 13, color: '#262626' }}>{String(data.label)}</span>
          </div>
        }
      >
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          {getStatusBadge()}
        </div>
        
        <div style={{ fontSize: 11, color: '#595959', marginTop: 8 }}>
          {config.type && (
            <div style={{ marginBottom: 6, padding: '4px 8px', backgroundColor: '#fff', borderRadius: 4, border: '1px solid #d9d9d9' }}>
              <span style={{ color: '#8c8c8c', marginRight: 4 }}>类型:</span>
              <span style={{ fontWeight: 600, color: getActionTypeColor(config.type) }}>{String(config.type)}</span>
            </div>
          )}
          {config.target && (
            <div style={{ marginBottom: 6, padding: '4px 8px', backgroundColor: '#fff', borderRadius: 4, border: '1px solid #d9d9d9' }}>
              <span style={{ color: '#8c8c8c', marginRight: 4 }}>目标:</span>
              <span style={{ fontWeight: 500, color: '#262626' }}>{String(config.target)}</span>
            </div>
          )}
          {config.value !== undefined && (
            <div style={{ marginBottom: 6, padding: '4px 8px', backgroundColor: '#fff', borderRadius: 4, border: '1px solid #d9d9d9' }}>
              <span style={{ color: '#8c8c8c', marginRight: 4 }}>值:</span>
              <span style={{ fontWeight: 500, color: '#262626' }}>{String(config.value)}</span>
            </div>
          )}
          {config.method && (
            <div style={{ padding: '4px 8px', backgroundColor: '#fff7e6', borderRadius: 4, border: '1px solid #ffd591' }}>
              <span style={{ color: '#8c8c8c', marginRight: 4 }}>方法:</span>
              <span style={{ fontWeight: 500, color: '#faad14' }}>{String(config.method)}</span>
            </div>
          )}
        </div>
      </Card>
      
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ 
          background: '#faad14',
          width: 12,
          height: 12,
          border: '2px solid #fff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }} 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ 
          background: '#faad14',
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
