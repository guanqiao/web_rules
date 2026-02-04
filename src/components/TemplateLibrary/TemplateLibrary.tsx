import React, { useState } from 'react';
import { Modal, Input, Card, Row, Col, Button, Tag, Space, Typography, message } from 'antd';
import { SearchOutlined, CopyOutlined, EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ruleTemplates, RuleTemplate } from '@/templates/ruleTemplates';
import { Node } from '@xyflow/react';

const { Text, Paragraph } = Typography;

export interface TemplateLibraryProps {
  visible: boolean;
  onClose: () => void;
  onApplyTemplate: (nodes: Node[]) => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  visible,
  onClose,
  onApplyTemplate
}) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<RuleTemplate | null>(null);

  const categories = [
    { key: 'all', label: t('templates.categories.all') },
    { key: 'condition', label: t('templates.categories.condition') },
    { key: 'action', label: t('templates.categories.action') },
    { key: 'decision', label: t('templates.categories.decision') },
    { key: 'workflow', label: t('templates.categories.workflow') }
  ];

  const filteredTemplates = ruleTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApplyTemplate = (template: RuleTemplate) => {
    onApplyTemplate(template.nodes);
    message.success(t('messages.templateApplied'));
    onClose();
  };

  const handlePreviewTemplate = (template: RuleTemplate) => {
    setPreviewTemplate(template);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'condition': return 'blue';
      case 'action': return 'orange';
      case 'decision': return 'purple';
      case 'workflow': return 'green';
      default: return 'default';
    }
  };

  return (
    <>
      <Modal
        title={t('templates.title')}
        open={visible}
        onCancel={onClose}
        width={1000}
        footer={null}
      >
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder={t('templates.search')}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="large"
            allowClear
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Space>
            {categories.map(cat => (
              <Tag
                key={cat.key}
                color={selectedCategory === cat.key ? 'blue' : 'default'}
                style={{ cursor: 'pointer', padding: '4px 12px' }}
                onClick={() => setSelectedCategory(cat.key)}
              >
                {cat.label}
              </Tag>
            ))}
          </Space>
        </div>

        {filteredTemplates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            {t('templates.noTemplates')}
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredTemplates.map(template => (
              <Col span={8} key={template.id}>
                <Card
                  hoverable
                  style={{ height: '100%' }}
                  bodyStyle={{ padding: 16 }}
                  actions={[
                    <Button
                      key="preview"
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => handlePreviewTemplate(template)}
                    >
                      {t('templates.preview')}
                    </Button>,
                    <Button
                      key="apply"
                      type="primary"
                      icon={<CopyOutlined />}
                      onClick={() => handleApplyTemplate(template)}
                    >
                      {t('templates.apply')}
                    </Button>
                  ]}
                >
                  <div style={{ marginBottom: 12 }}>
                    <Tag color={getCategoryColor(template.category)} style={{ marginBottom: 8 }}>
                      {categories.find(c => c.key === template.category)?.label}
                    </Tag>
                    <Text strong style={{ fontSize: 14, display: 'block' }}>
                      {template.name}
                    </Text>
                  </div>
                  <Paragraph
                    type="secondary"
                    style={{ fontSize: 12, marginBottom: 8, minHeight: 40 }}
                    ellipsis={{ rows: 2 }}
                  >
                    {template.description}
                  </Paragraph>
                  <div
                    style={{
                      backgroundColor: '#f6f8fa',
                      padding: 8,
                      borderRadius: 4,
                      fontSize: 11,
                      fontFamily: 'monospace',
                      color: '#666'
                    }}
                  >
                    {template.preview}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Modal>

      <Modal
        title={`${t('templates.preview')} - ${previewTemplate?.name}`}
        open={!!previewTemplate}
        onCancel={() => setPreviewTemplate(null)}
        footer={[
          <Button key="close" onClick={() => setPreviewTemplate(null)}>
            {t('common.close')}
          </Button>,
          <Button
            key="apply"
            type="primary"
            onClick={() => previewTemplate && handleApplyTemplate(previewTemplate)}
          >
            {t('templates.apply')}
          </Button>
        ]}
      >
        {previewTemplate && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Tag color={getCategoryColor(previewTemplate.category)}>
                {categories.find(c => c.key === previewTemplate.category)?.label}
              </Tag>
            </div>
            <Paragraph style={{ fontSize: 14, marginTop: 12 }}>
              {previewTemplate.description}
            </Paragraph>
            <div
              style={{
                backgroundColor: '#f6f8fa',
                padding: 16,
                borderRadius: 8,
                fontSize: 12,
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}
            >
              {previewTemplate.preview}
            </div>
            <div style={{ marginTop: 16 }}>
              <Text strong>{t('templates.categories.all')}:</Text>
              <div style={{ marginTop: 8 }}>
                {previewTemplate.nodes.map((node, index) => (
                  <div key={node.id} style={{ marginBottom: 4 }}>
                    <Tag color="blue">{index + 1}. {node.type}</Tag>
                    <span style={{ marginLeft: 8 }}>{node.data.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
