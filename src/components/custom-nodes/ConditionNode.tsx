import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, Badge } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

export const ConditionNode: React.FC<NodeProps> = ({ data, selected }) => {
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
        filter: selected ? 'drop-shadow(0 4px 12px rgba(24, 144, 255, 0.4))' : 'none'
      }}
    >
      <Card
        size="small"
        style={{
          width: 220,
          borderColor: selected ? '#1890ff' : '#1890ff',
          backgroundColor: selected ? '#e6f7ff' : '#e6f7ff',
          minWidth: 220,
          boxShadow: selected ? '0 8px 24px rgba(24, 144, 255, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: selected ? '3px solid #1890ff' : '2px solid #1890ff',
          cursor: 'grab',
          transition: 'all 0.3s ease',
          borderRadius: 12
        }}
        styles={{ body: { padding: '14px' } }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FilterOutlined 
              style={{ 
                color: '#1890ff', 
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
          {config.field && (
            <div style={{ marginBottom: 6, padding: '4px 8px', backgroundColor: '#fff', borderRadius: 4, border: '1px solid #d9d9d9' }}>
              <span style={{ color: '#8c8c8c', marginRight: 4 }}>字段:</span>
              <span style={{ fontWeight: 500, color: '#262626' }}>{String(config.field)}</span>
            </div>
          )}
          {config.operator && (
            <div style={{ marginBottom: 6, padding: '4px 8px', backgroundColor: '#fff', borderRadius: 4, border: '1px solid #d9d9d9' }}>
              <span style={{ color: '#8c8c8c', marginRight: 4 }}>操作:</span>
              <span style={{ fontWeight: 500, color: '#1890ff' }}>{String(config.operator)}</span>
            </div>
          )}
          {config.value !== undefined && (
            <div style={{ padding: '4px 8px', backgroundColor: '#fff', borderRadius: 4, border: '1px solid #d9d9d9' }}>
              <span style={{ color: '#8c8c8c', marginRight: 4 }}>值:</span>
              <span style={{ fontWeight: 500, color: '#262626' }}>{String(config.value)}</span>
            </div>
          )}
          {config.logicalOperator && (
            <div style={{ marginTop: 6, padding: '4px 8px', backgroundColor: '#e6f7ff', borderRadius: 4, border: '1px solid #91d5ff' }}>
              <span style={{ color: '#1890ff', fontWeight: 600 }}>{String(config.logicalOperator)}</span>
            </div>
          )}
        </div>
      </Card>
      
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ 
          background: '#1890ff',
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
          background: '#1890ff',
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
