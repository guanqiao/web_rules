import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, Badge, Tag } from 'antd';
import { FolderOutlined } from '@ant-design/icons';

export const GroupNode: React.FC<NodeProps> = ({ data, selected }) => {
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
        filter: selected ? 'drop-shadow(0 4px 12px rgba(19, 194, 194, 0.4))' : 'none'
      }}
    >
      <Card
        size="small"
        style={{
          width: 220,
          borderColor: selected ? '#1890ff' : '#13c2c2',
          backgroundColor: selected ? '#e6fffb' : '#e6fffb',
          minWidth: 220,
          boxShadow: selected ? '0 8px 24px rgba(19, 194, 194, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: selected ? '3px solid #1890ff' : '2px solid #13c2c2',
          cursor: 'grab',
          transition: 'all 0.3s ease',
          borderRadius: 12
        }}
        styles={{ body: { padding: '14px' } }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FolderOutlined 
              style={{ 
                color: '#13c2c2', 
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
          {config.agendaGroup && (
            <div style={{ marginBottom: 6, padding: '4px 8px', backgroundColor: '#fff', borderRadius: 4, border: '1px solid #d9d9d9' }}>
              <span style={{ color: '#8c8c8c', marginRight: 4 }}>议程组:</span>
              <Tag color="cyan" style={{ margin: 0, fontSize: 10 }}>{String(config.agendaGroup)}</Tag>
            </div>
          )}
          {config.salience !== undefined && (
            <div style={{ marginBottom: 6, padding: '4px 8px', backgroundColor: '#fff', borderRadius: 4, border: '1px solid #d9d9d9' }}>
              <span style={{ color: '#8c8c8c', marginRight: 4 }}>优先级:</span>
              <Tag color="orange" style={{ margin: 0, fontSize: 10 }}>{String(config.salience)}</Tag>
            </div>
          )}
          {config.activationGroup && (
            <div style={{ padding: '4px 8px', backgroundColor: '#fff', borderRadius: 4, border: '1px solid #d9d9d9' }}>
              <span style={{ color: '#8c8c8c', marginRight: 4 }}>激活组:</span>
              <Tag color="purple" style={{ margin: 0, fontSize: 10 }}>{String(config.activationGroup)}</Tag>
            </div>
          )}
        </div>
      </Card>
      
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ 
          background: '#13c2c2',
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
          background: '#13c2c2',
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
