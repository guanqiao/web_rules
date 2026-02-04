import React, { useState, useMemo } from 'react';
import { Card, Typography, Input, Tabs, Collapse, Badge, Tooltip, Empty } from 'antd';
import { 
  PlayCircleOutlined, 
  StopOutlined, 
  FilterOutlined, 
  ThunderboltOutlined,
  BranchesOutlined,
  FolderOutlined,
  SearchOutlined,
  StarOutlined,
  StarFilled,
  AppstoreOutlined,
  ApartmentOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;
const { Search } = Input;

export interface NodeType {
  type: 'start' | 'end' | 'condition' | 'action' | 'decision' | 'group';
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  category: 'basic' | 'logic' | 'data';
  description: string;
}

export const NodePalette: React.FC<{ onDragStart: (event: React.DragEvent, nodeType: NodeType) => void }> = ({ onDragStart }) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const nodeTypes: NodeType[] = [
    {
      type: 'start',
      label: t('nodePalette.nodeTypes.start'),
      icon: <PlayCircleOutlined />,
      color: '#52c41a',
      bgColor: '#f6ffed',
      category: 'basic',
      description: t('nodePalette.descriptions.start')
    },
    {
      type: 'end',
      label: t('nodePalette.nodeTypes.end'),
      icon: <StopOutlined />,
      color: '#ff4d4f',
      bgColor: '#fff1f0',
      category: 'basic',
      description: t('nodePalette.descriptions.end')
    },
    {
      type: 'condition',
      label: t('nodePalette.nodeTypes.condition'),
      icon: <FilterOutlined />,
      color: '#1890ff',
      bgColor: '#e6f7ff',
      category: 'logic',
      description: t('nodePalette.descriptions.condition')
    },
    {
      type: 'action',
      label: t('nodePalette.nodeTypes.action'),
      icon: <ThunderboltOutlined />,
      color: '#faad14',
      bgColor: '#fffbe6',
      category: 'data',
      description: t('nodePalette.descriptions.action')
    },
    {
      type: 'decision',
      label: t('nodePalette.nodeTypes.decision'),
      icon: <BranchesOutlined />,
      color: '#722ed1',
      bgColor: '#f9f0ff',
      category: 'logic',
      description: t('nodePalette.descriptions.decision')
    },
    {
      type: 'group',
      label: t('nodePalette.nodeTypes.group'),
      icon: <FolderOutlined />,
      color: '#13c2c2',
      bgColor: '#e6fffb',
      category: 'data',
      description: t('nodePalette.descriptions.group')
    }
  ];

  const toggleFavorite = (nodeType: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(nodeType)) {
      newFavorites.delete(nodeType);
    } else {
      newFavorites.add(nodeType);
    }
    setFavorites(newFavorites);
  };

  const filteredNodes = useMemo(() => {
    return nodeTypes.filter(node => {
      const matchesSearch = node.label.toLowerCase().includes(searchText.toLowerCase()) ||
                           node.description.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = activeCategory === 'all' || node.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchText, activeCategory, nodeTypes]);

  const favoriteNodes = useMemo(() => {
    return nodeTypes.filter(node => favorites.has(node.type));
  }, [favorites, nodeTypes]);

  const renderNodeCard = (node: NodeType) => (
    <Card
      key={node.type}
      size="small"
      draggable
      onDragStart={(e) => onDragStart(e, node)}
      style={{
        cursor: 'grab',
        borderColor: node.color,
        backgroundColor: node.bgColor,
        transition: 'all 0.2s',
        marginBottom: 8,
        borderRadius: 8
      }}
      bodyStyle={{ padding: '10px' }}
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
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text strong style={{ fontSize: 13, display: 'block' }}>
            {node.label}
          </Text>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {node.description}
          </Text>
        </div>
        <Tooltip title={favorites.has(node.type) ? t('nodePalette.removeFromFavorites') : t('nodePalette.addToFavorites')}>
          <div 
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(node.type);
            }}
            style={{ 
              cursor: 'pointer',
              color: favorites.has(node.type) ? '#faad14' : '#d9d9d9',
              fontSize: 16
            }}
          >
            {favorites.has(node.type) ? <StarFilled /> : <StarOutlined />}
          </div>
        </Tooltip>
      </div>
    </Card>
  );

  const categoryItems = [
    {
      key: 'all',
      label: (
        <span>
          <AppstoreOutlined style={{ marginRight: 4 }} />
          {t('nodePalette.categories.all')}
        </span>
      ),
      children: filteredNodes.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredNodes.map(renderNodeCard)}
        </div>
      ) : (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description={t('nodePalette.noResults')}
          style={{ padding: '20px 0' }}
        />
      )
    },
    {
      key: 'basic',
      label: (
        <span>
          <PlayCircleOutlined style={{ marginRight: 4 }} />
          {t('nodePalette.categories.basic')}
        </span>
      ),
      children: filteredNodes.filter(n => n.category === 'basic').length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredNodes.filter(n => n.category === 'basic').map(renderNodeCard)}
        </div>
      ) : (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description={t('nodePalette.noBasicNodes')}
          style={{ padding: '20px 0' }}
        />
      )
    },
    {
      key: 'logic',
      label: (
        <span>
          <ApartmentOutlined style={{ marginRight: 4 }} />
          {t('nodePalette.categories.logic')}
        </span>
      ),
      children: filteredNodes.filter(n => n.category === 'logic').length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredNodes.filter(n => n.category === 'logic').map(renderNodeCard)}
        </div>
      ) : (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description={t('nodePalette.noLogicNodes')}
          style={{ padding: '20px 0' }}
        />
      )
    },
    {
      key: 'data',
      label: (
        <span>
          <ThunderboltOutlined style={{ marginRight: 4 }} />
          {t('nodePalette.categories.data')}
        </span>
      ),
      children: filteredNodes.filter(n => n.category === 'data').length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredNodes.filter(n => n.category === 'data').map(renderNodeCard)}
        </div>
      ) : (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description={t('nodePalette.noDataNodes')}
          style={{ padding: '20px 0' }}
        />
      )
    }
  ];

  return (
    <div style={{ padding: 16, height: '100%', overflowY: 'auto' }}>
      <Typography.Title level={5} style={{ marginBottom: 16 }}>
        {t('nodePalette.title')}
      </Typography.Title>

      <Search
        placeholder="搜索节点..."
        allowClear
        prefix={<SearchOutlined />}
        style={{ marginBottom: 16 }}
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
      />

      {favoriteNodes.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            marginBottom: 12,
            paddingBottom: 8,
            borderBottom: '1px solid #f0f0f0'
          }}>
            <StarFilled style={{ color: '#faad14' }} />
            <Text strong style={{ fontSize: 13 }}>收藏节点</Text>
            <Badge count={favoriteNodes.length} style={{ backgroundColor: '#faad14' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {favoriteNodes.map(renderNodeCard)}
          </div>
        </div>
      )}

      <Collapse 
        items={categoryItems} 
        defaultActiveKey={['all']}
        bordered={false}
        style={{ backgroundColor: 'transparent' }}
      />
      
      <div style={{ marginTop: 24, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t('nodePalette.hint')}
        </Text>
      </div>
    </div>
  );
};
