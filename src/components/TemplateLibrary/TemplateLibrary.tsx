import React, { useState } from 'react';
import { Modal, Card, Button, Space, Tag, Empty, Input, Select, message } from 'antd';
import { 
  AppstoreOutlined, 
  EyeOutlined, 
  CopyOutlined, 
  DownloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Search } = Input;
const { Option } = Select;

interface RuleTemplate {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'advanced' | 'workflow';
  tags: string[];
  nodes: any[];
  edges: any[];
  preview: string;
}

const templates: RuleTemplate[] = [
  {
    id: 'simple-condition',
    name: '简单条件规则',
    description: '基本的条件判断规则，包含一个条件节点和一个动作节点',
    category: 'basic',
    tags: ['条件', '基础'],
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 100, y: 100 },
        data: { label: '开始', config: {} }
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 300, y: 100 },
        data: { 
          label: '年龄检查', 
          config: { 
            field: '$person.age', 
            operator: '>=', 
            value: '18' 
          } 
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 550, y: 100 },
        data: { 
          label: '设置成年', 
          config: { 
            type: 'set', 
            target: '$person.isAdult', 
            value: 'true' 
          } 
        }
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 750, y: 100 },
        data: { label: '结束', config: {} }
      }
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'condition-1' },
      { id: 'e2', source: 'condition-1', target: 'action-1' },
      { id: 'e3', source: 'action-1', target: 'end-1' }
    ],
    preview: '规则：当年龄大于等于18岁时，设置isAdult为true'
  },
  {
    id: 'multi-condition',
    name: '多条件组合',
    description: '使用AND/OR逻辑操作符组合多个条件',
    category: 'advanced',
    tags: ['条件', '逻辑'],
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 100, y: 100 },
        data: { label: '开始', config: {} }
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 300, y: 50 },
        data: { 
          label: '年龄检查', 
          config: { 
            field: '$person.age', 
            operator: '>=', 
            value: '18',
            logicalOperator: 'AND'
          } 
        }
      },
      {
        id: 'condition-2',
        type: 'condition',
        position: { x: 300, y: 150 },
        data: { 
          label: '许可证检查', 
          config: { 
            field: '$person.hasLicense', 
            operator: '==', 
            value: 'true',
            logicalOperator: 'AND'
          } 
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 550, y: 100 },
        data: { 
          label: '允许驾驶', 
          config: { 
            type: 'set', 
            target: '$person.canDrive', 
            value: 'true' 
          } 
        }
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 750, y: 100 },
        data: { label: '结束', config: {} }
      }
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'condition-1' },
      { id: 'e2', source: 'condition-1', target: 'condition-2' },
      { id: 'e3', source: 'condition-2', target: 'action-1' },
      { id: 'e4', source: 'action-1', target: 'end-1' }
    ],
    preview: '规则：当年龄>=18且持有许可证时，允许驾驶'
  },
  {
    id: 'decision-branch',
    name: '决策分支',
    description: '使用决策节点实现复杂的分支逻辑',
    category: 'advanced',
    tags: ['决策', '分支'],
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 100, y: 200 },
        data: { label: '开始', config: {} }
      },
      {
        id: 'decision-1',
        type: 'decision',
        position: { x: 300, y: 200 },
        data: { 
          label: '用户类型判断', 
          config: { 
            expression: '$user.type == "VIP"' 
          } 
        }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 550, y: 100 },
        data: { 
          label: 'VIP折扣', 
          config: { 
            type: 'set', 
            target: '$order.discount', 
            value: '0.2' 
          } 
        }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 550, y: 300 },
        data: { 
          label: '普通折扣', 
          config: { 
            type: 'set', 
            target: '$order.discount', 
            value: '0.05' 
          } 
        }
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 750, y: 200 },
        data: { label: '结束', config: {} }
      }
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'decision-1' },
      { id: 'e2', source: 'decision-1', target: 'action-1' },
      { id: 'e3', source: 'decision-1', target: 'action-2' },
      { id: 'e4', source: 'action-1', target: 'end-1' },
      { id: 'e5', source: 'action-2', target: 'end-1' }
    ],
    preview: '规则：根据用户类型(VIP/普通)应用不同折扣'
  },
  {
    id: 'group-priority',
    name: '分组与优先级',
    description: '使用分组节点管理规则优先级和议程组',
    category: 'workflow',
    tags: ['分组', '优先级'],
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 100, y: 100 },
        data: { label: '开始', config: {} }
      },
      {
        id: 'group-1',
        type: 'group',
        position: { x: 300, y: 50 },
        data: { 
          label: '高优先级组', 
          config: { 
            name: 'high-priority',
            salience: 100,
            agendaGroup: 'urgent'
          } 
        }
      },
      {
        id: 'group-2',
        type: 'group',
        position: { x: 300, y: 200 },
        data: { 
          label: '普通优先级组', 
          config: { 
            name: 'normal-priority',
            salience: 50,
            agendaGroup: 'normal'
          } 
        }
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 550, y: 125 },
        data: { label: '结束', config: {} }
      }
    ],
    edges: [
      { id: 'e1', source: 'start-1', target: 'group-1' },
      { id: 'e2', source: 'start-1', target: 'group-2' },
      { id: 'e3', source: 'group-1', target: 'end-1' },
      { id: 'e4', source: 'group-2', target: 'end-1' }
    ],
    preview: '规则：使用分组管理不同优先级的规则'
  }
];

export interface TemplateLibraryProps {
  visible: boolean;
  onClose: () => void;
  onApplyTemplate: (template: RuleTemplate) => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  visible,
  onClose,
  onApplyTemplate
}) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<RuleTemplate | null>(null);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchText.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handlePreview = (template: RuleTemplate) => {
    setSelectedTemplate(template);
  };

  const handleApply = (template: RuleTemplate) => {
    onApplyTemplate(template);
    message.success(t('templates.templateAppliedMessage', { name: template.name }));
    onClose();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'green';
      case 'advanced': return 'blue';
      case 'workflow': return 'purple';
      default: return 'default';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'basic': return '基础';
      case 'advanced': return '高级';
      case 'workflow': return '工作流';
      default: return category;
    }
  };

  return (
    <>
      <Modal
        title={
          <Space>
            <AppstoreOutlined />
            <span>{t('templates.title')}</span>
          </Space>
        }
        open={visible}
        onCancel={onClose}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        <div style={{ marginBottom: 16 }}>
          <Space size="middle" style={{ width: '100%' }}>
            <Search
              placeholder={t('templates.search')}
              allowClear
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
            <Select
              placeholder={t('templates.categories.all')}
              style={{ width: 150 }}
              value={categoryFilter}
              onChange={setCategoryFilter}
            >
              <Option value="all">{t('templates.categories.all')}</Option>
              <Option value="basic">{t('templates.categories.basic')}</Option>
              <Option value="advanced">{t('templates.categories.advanced')}</Option>
              <Option value="workflow">{t('templates.categories.workflow')}</Option>
            </Select>
          </Space>
        </div>

        {filteredTemplates.length > 0 ? (
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 16 }}>
              {filteredTemplates.map(template => (
                <Card
                  key={template.id}
                  size="small"
                  hoverable
                  style={{ 
                    borderColor: getCategoryColor(template.category) === 'green' ? '#52c41a' : 
                                 getCategoryColor(template.category) === 'blue' ? '#1890ff' : '#722ed1'
                  }}
                  actions={[
                    <Button 
                      key="preview" 
                      type="text" 
                      icon={<EyeOutlined />}
                      onClick={() => handlePreview(template)}
                    >
                      {t('templates.preview')}
                    </Button>,
                    <Button 
                      key="apply" 
                      type="primary" 
                      icon={<DownloadOutlined />}
                      onClick={() => handleApply(template)}
                    >
                      {t('templates.apply')}
                    </Button>
                  ]}
                >
                  <div style={{ marginBottom: 8 }}>
                    <Space>
                      <Tag color={getCategoryColor(template.category)}>
                        {getCategoryLabel(template.category)}
                      </Tag>
                      {template.tags.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Space>
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                    {template.name}
                  </div>
                  <div style={{ color: '#8c8c8c', fontSize: 12, marginBottom: 8 }}>
                    {template.description}
                  </div>
                  <div style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: 8, 
                    borderRadius: 4, 
                    fontSize: 11,
                    fontFamily: 'monospace',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {template.preview}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Empty 
            description={t('templates.noMatchingTemplates')}
            style={{ padding: '40px 0' }}
          />
        )}
      </Modal>

      {selectedTemplate && (
        <Modal
          title={`${t('templates.previewTemplate')} - ${selectedTemplate.name}`}
          open={!!selectedTemplate}
          onCancel={() => setSelectedTemplate(null)}
          footer={[
            <Button key="close" onClick={() => setSelectedTemplate(null)}>
              {t('common.close')}
            </Button>,
            <Button 
              key="apply" 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={() => handleApply(selectedTemplate)}
            >
              {t('templates.applyTemplate')}
            </Button>
          ]}
          width={800}
        >
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Tag color={getCategoryColor(selectedTemplate.category)}>
                {getCategoryLabel(selectedTemplate.category)}
              </Tag>
              {selectedTemplate.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Space>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <strong>{t('templates.description')}：</strong>
            <p style={{ color: '#595959', marginTop: 4 }}>{selectedTemplate.description}</p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <strong>{t('templates.rulePreview')}：</strong>
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: 12, 
              borderRadius: 4, 
              marginTop: 8,
              fontFamily: 'monospace',
              fontSize: 12
            }}>
              {selectedTemplate.preview}
            </div>
          </div>

          <div>
            <strong>{t('templates.nodeCount')}：</strong> {selectedTemplate.nodes.length}
            <span style={{ margin: '0 16px' }}>|</span>
            <strong>{t('templates.edgeCount')}：</strong> {selectedTemplate.edges.length}
          </div>
        </Modal>
      )}
    </>
  );
};