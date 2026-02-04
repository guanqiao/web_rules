import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { BranchesOutlined } from '@ant-design/icons';

export const DecisionNode: React.FC<NodeProps> = ({ data, selected }) => {
  const config = data.config || {} as any;
  
  return (
    <div
      style={{
        position: 'relative',
        transition: 'all 0.3s ease',
        transform: selected ? 'scale(1.05)' : 'scale(1)',
        filter: selected ? 'drop-shadow(0 4px 12px rgba(114, 46, 209, 0.4))' : 'none'
      }}
    >
      <div
        style={{
          width: 160,
          height: 160,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab',
          transition: 'all 0.3s ease'
        }}
      >
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            filter: selected ? 'drop-shadow(0 8px 24px rgba(114, 46, 209, 0.3))' : 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))'
          }}
        >
          <polygon
            points="80,5 155,80 80,155 5,80"
            fill={selected ? '#f9f0ff' : '#f9f0ff'}
            stroke={selected ? '#1890ff' : '#722ed1'}
            strokeWidth={selected ? '3' : '2'}
            style={{ transition: 'all 0.3s ease' }}
          />
        </svg>
        
        <div style={{ zIndex: 1, textAlign: 'center', padding: '0 20px' }}>
          <BranchesOutlined 
            style={{ 
              color: '#722ed1', 
              fontSize: 28,
              marginBottom: 6,
              display: 'block'
            }} 
          />
          <span style={{ fontWeight: 700, fontSize: 12, color: '#262626', display: 'block' }}>
            {String(data.label)}
          </span>
          {config.expression && (
            <span style={{ 
              fontSize: 10, 
              color: '#8c8c8c', 
              marginTop: 4, 
              display: 'block',
              maxWidth: 120, 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {config.expression}
            </span>
          )}
        </div>
      </div>
      
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ 
          background: '#722ed1',
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
          background: '#722ed1',
          width: 12,
          height: 12,
          border: '2px solid #fff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }} 
      />
    </div>
  );
};
