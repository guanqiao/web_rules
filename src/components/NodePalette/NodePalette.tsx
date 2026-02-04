import React from 'react';
import { Card, Typography } from 'antd';
import { 
  PlayCircleOutlined, 
  StopOutlined, 
  FilterOutlined, 
  ThunderboltOutlined,
  BranchesOutlined,
  FolderOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

export interface NodeType {
  type: 'start' | 'end' | 'condition' | 'action' | 'decision' | 'group';
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export const NodePalette: React.FC<{ onDragStart: (event: React.DragEvent, nodeType: NodeType) => void }> = ({ onDragStart }) => {
  const { t } = useTranslation();

  const nodeTypes: NodeType[] = [
    {
      type: 'start',
      label: t('nodePalette.nodeTypes.start'),
      icon: <PlayCircleOutlined />,
      color: '#52c41a',
      bgColor: '#f6ffed'
    },
    {
      type: 'end',
      label: t('nodePalette.nodeTypes.end'),
      icon: <StopOutlined />,
      color: '#ff4d4f',
      bgColor: '#fff1f0'
    },
    {
      type: 'condition',
      label: t('nodePalette.nodeTypes.condition'),
      icon: <FilterOutlined />,
      color: '#1890ff',
      bgColor: '#e6f7ff'
    },
    {
      type: 'action',
      label: t('nodePalette.nodeTypes.action'),
      icon: <ThunderboltOutlined />,
      color: '#faad14',
      bgColor: '#fffbe6'
    },
    {
      type: 'decision',
      label: t('nodePalette.nodeTypes.decision'),
      icon: <BranchesOutlined />,
      color: '#722ed1',
      bgColor: '#f9f0ff'
    },
    {
      type: 'group',
      label: t('nodePalette.nodeTypes.group'),
      icon: <FolderOutlined />,
      color: '#13c2c2',
      bgColor: '#e6fffb'
    }
  ];

  return (
    <div style={{ padding: 16, height: '100%', overflowY: 'auto' }}>
      <Typography.Title level={5} style={{ marginBottom: 16 }}>
        {t('nodePalette.title')}
      </Typography.Title>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {nodeTypes.map((node) => (
          <Card
            key={node.type}
            size="small"
            draggable
            onDragStart={(e) => onDragStart(e, node)}
            style={{
              cursor: 'grab',
              borderColor: node.color,
              backgroundColor: node.bgColor,
              transition: 'all 0.2s'
            }}
            bodyStyle={{ padding: '12px' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: node.color, fontSize: 18 }}>
                {node.icon}
              </span>
              <Text strong style={{ fontSize: 13 }}>
                {node.label}
              </Text>
            </div>
          </Card>
        ))}
      </div>
      
      <div style={{ marginTop: 24, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t('nodePalette.hint')}
        </Text>
      </div>
    </div>
  );
};
