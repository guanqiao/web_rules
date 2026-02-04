import React, { useState, useEffect } from 'react';
import { Modal, Button, Space, Typography, Card, Statistic, Row, Col, message } from 'antd';
import { CopyOutlined, CheckOutlined, FileTextOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Text, Paragraph } = Typography;

export interface DroolsPreviewProps {
  visible: boolean;
  drlCode: string;
  onClose: () => void;
  nodesCount: number;
  edgesCount: number;
}

export const DroolsPreview: React.FC<DroolsPreviewProps> = ({
  visible,
  drlCode,
  onClose,
  nodesCount,
  edgesCount
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    package: '',
    imports: 0,
    rules: 0,
    lines: 0,
    characters: 0
  });

  useEffect(() => {
    if (drlCode) {
      const lines = drlCode.split('\n');
      const packageMatch = drlCode.match(/package\s+([^;]+);/);
      const imports = (drlCode.match(/import\s+/g) || []).length;
      const rules = (drlCode.match(/rule\s+/g) || []).length;

      setStats({
        package: packageMatch ? packageMatch[1] : '',
        imports,
        rules,
        lines: lines.length,
        characters: drlCode.length
      });
    }
  }, [drlCode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(drlCode);
      setCopied(true);
      message.success(t('preview.copySuccess'));
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      message.error(t('preview.copyFailed'));
    }
  };

  const highlightDRL = (code: string) => {
    return code
      .replace(/(package|import|global|rule|when|then|end|salience|agenda-group|activation-group|no-loop)/g, 
        '<span style="color: #d73a49; font-weight: bold;">$1</span>')
      .replace(/(\$[a-zA-Z_][a-zA-Z0-9_]*)/g, 
        '<span style="color: #005cc5;">$1</span>')
      .replace(/(:\s*[A-Z][a-zA-Z0-9]*)/g, 
        '<span style="color: #6f42c1;">$1</span>')
      .replace(/(\/\/.*$)/gm, 
        '<span style="color: #6a737d; font-style: italic;">$1</span>')
      .replace(/("(?:[^"\\]|\\.)*")/g, 
        '<span style="color: #032f62;">$1</span>');
  };

  return (
    <Modal
      title={
        <Space>
          <FileTextOutlined />
          <span>{t('preview.title')}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={900}
      footer={
        <Space>
          <Button onClick={onClose}>{t('common.close')}</Button>
          <Button 
            type="primary" 
            icon={copied ? <CheckOutlined /> : <CopyOutlined />}
            onClick={handleCopy}
          >
            {copied ? t('preview.copied') : t('preview.copyCode')}
          </Button>
        </Space>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Card size="small">
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title={t('preview.stats.package')}
                value={stats.package || 'N/A'}
                valueStyle={{ fontSize: 14, color: '#1890ff' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title={t('preview.stats.rules')}
                value={stats.rules}
                valueStyle={{ fontSize: 14, color: '#52c41a' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title={t('preview.stats.imports')}
                value={stats.imports}
                valueStyle={{ fontSize: 14, color: '#faad14' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title={t('preview.stats.lines')}
                value={stats.lines}
                valueStyle={{ fontSize: 14, color: '#722ed1' }}
              />
            </Col>
          </Row>
        </Card>
      </div>

      <Card 
        size="small" 
        title={t('preview.codePreview')}
        extra={
          <Space size="small">
            <Text type="secondary">{t('preview.nodes')}: {nodesCount}</Text>
            <Text type="secondary">{t('preview.edges')}: {edgesCount}</Text>
          </Space>
        }
      >
        <pre
          style={{
            backgroundColor: '#f6f8fa',
            padding: 16,
            borderRadius: 6,
            overflow: 'auto',
            maxHeight: 400,
            fontSize: 12,
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
            lineHeight: 1.6,
            margin: 0
          }}
          dangerouslySetInnerHTML={{
            __html: highlightDRL(drlCode)
          }}
        />
      </Card>

      <div style={{ marginTop: 16 }}>
        <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0 }}>
          <Text strong>{t('common.tip')}：</Text>
          {t('preview.tip')}
        </Paragraph>
      </div>
    </Modal>
  );
};
