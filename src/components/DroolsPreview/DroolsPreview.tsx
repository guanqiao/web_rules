import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Space, Typography, Card, Statistic, Row, Col, message, Alert, Badge, Tooltip, List, Tag, Input } from 'antd';
import { CopyOutlined, CheckOutlined, FileTextOutlined, WarningOutlined, CloseCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { checkDrlSyntax, DrlSyntaxError, DrlCheckResult } from '@/engines/DrlSyntaxChecker';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

export interface DroolsPreviewProps {
  visible: boolean;
  drlCode: string;
  onClose: () => void;
  nodesCount: number;
  edgesCount: number;
  onSave?: (editedCode: string) => void;
}

interface LineWithError {
  lineNumber: number;
  content: string;
  errors: DrlSyntaxError[];
  warnings: DrlSyntaxError[];
}

export const DroolsPreview: React.FC<DroolsPreviewProps> = ({
  visible,
  drlCode,
  onClose,
  nodesCount,
  edgesCount,
  onSave
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [checkResult, setCheckResult] = useState<DrlCheckResult | null>(null);
  const [selectedError, setSelectedError] = useState<DrlSyntaxError | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(drlCode);
  const [stats, setStats] = useState({
    package: '',
    imports: 0,
    rules: 0,
    lines: 0,
    characters: 0
  });

  useEffect(() => {
    if (drlCode) {
      setEditedCode(drlCode);
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

      const result = checkDrlSyntax(drlCode);
      setCheckResult(result);
    }
  }, [drlCode]);

  useEffect(() => {
    if (isEditing && editedCode) {
      const lines = editedCode.split('\n');
      const packageMatch = editedCode.match(/package\s+([^;]+);/);
      const imports = (editedCode.match(/import\s+/g) || []).length;
      const rules = (editedCode.match(/rule\s+/g) || []).length;

      setStats({
        package: packageMatch ? packageMatch[1] : '',
        imports,
        rules,
        lines: lines.length,
        characters: editedCode.length
      });

      const result = checkDrlSyntax(editedCode);
      setCheckResult(result);
    }
  }, [editedCode, isEditing]);

  const linesWithErrors = useMemo((): LineWithError[] => {
    const codeToParse = isEditing ? editedCode : drlCode;
    if (!codeToParse) return [];

    const lines = codeToParse.split('\n');
    return lines.map((content, index) => {
      const lineNumber = index + 1;
      const errors = checkResult?.errors.filter(e => e.line === lineNumber) || [];
      const warnings = checkResult?.warnings.filter(w => w.line === lineNumber) || [];
      return { lineNumber, content, errors, warnings };
    });
  }, [drlCode, editedCode, isEditing, checkResult]);

  const handleCopy = async () => {
    const codeToCopy = isEditing ? editedCode : drlCode;
    try {
      await navigator.clipboard.writeText(codeToCopy);
      setCopied(true);
      message.success(t('preview.copySuccess'));
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      message.error(t('preview.copyFailed'));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedCode(drlCode);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedCode(drlCode);
    setSelectedError(null);
  };

  const handleSave = () => {
    if (onSave && editedCode !== drlCode) {
      onSave(editedCode);
      message.success(t('preview.saveSuccess'));
    }
    setIsEditing(false);
  };

  const highlightDRL = (code: string) => {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    return escapedCode
      .replace(/(package|import|global|rule|when|then|end|salience|agenda-group|activation-group|no-loop)/g,
        '<span style="color: #d73a49; font-weight: bold;">$1</span>')
      .replace(/(\$[a-zA-Z_][a-zA-Z0-9_]*)/g,
        '<span style="color: #005cc5;">$1</span>')
      .replace(/(:\s*[A-Z][a-zA-Z0-9]*)/g,
        '<span style="color: #6f42c1;">$1</span>')
      .replace(/(\/\/.*$)/gm,
        '<span style="color: #6a737d; font-style: italic;">$1</span>')
      .replace(/(&quot;(?:[^&quot;\\]|\\.)*&quot;)/g,
        '<span style="color: #032f62;">$1</span>');
  };

  const scrollToLine = (lineNumber: number) => {
    const lineElement = document.getElementById(`drl-line-${lineNumber}`);
    if (lineElement) {
      lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      lineElement.style.backgroundColor = '#fff2f0';
      setTimeout(() => {
        lineElement.style.backgroundColor = '';
      }, 2000);
    }
  };

  const getErrorIcon = (line: LineWithError) => {
    if (line.errors.length > 0) {
      return (
        <Tooltip title={line.errors.map(e => e.message).join('\n')}>
          <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 12 }} />
        </Tooltip>
      );
    }
    if (line.warnings.length > 0) {
      return (
        <Tooltip title={line.warnings.map(w => w.message).join('\n')}>
          <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 12 }} />
        </Tooltip>
      );
    }
    return null;
  };

  const getLineStyle = (line: LineWithError): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: 'flex',
      minHeight: '20px',
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
      fontSize: 12,
      lineHeight: '20px'
    };

    if (line.errors.length > 0) {
      return {
        ...baseStyle,
        backgroundColor: '#fff2f0',
        borderLeft: '2px solid #ff4d4f'
      };
    }

    if (line.warnings.length > 0) {
      return {
        ...baseStyle,
        backgroundColor: '#fffbe6',
        borderLeft: '2px solid #faad14'
      };
    }

    return baseStyle;
  };

  const allIssues = useMemo(() => {
    if (!checkResult) return [];
    return [
      ...checkResult.errors.map(e => ({ ...e, type: 'error' as const })),
      ...checkResult.warnings.map(w => ({ ...w, type: 'warning' as const }))
    ].sort((a, b) => a.line - b.line || a.column - b.column);
  }, [checkResult]);

  const renderCodePreview = () => {
    if (isEditing) {
      return (
        <TextArea
          value={editedCode}
          onChange={(e) => setEditedCode(e.target.value)}
          style={{
            minHeight: 500,
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
            fontSize: 12,
            lineHeight: '20px',
            backgroundColor: '#f6f8fa',
            border: 'none',
            resize: 'none',
            padding: 0,
            paddingLeft: 40
          }}
        />
      );
    }

    return (
      <div
        style={{
          backgroundColor: '#f6f8fa',
          borderRadius: 6,
          overflow: 'auto',
          maxHeight: 500,
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
          fontSize: 12,
          lineHeight: '20px'
        }}
      >
        {linesWithErrors.map((line) => (
          <div
            key={line.lineNumber}
            id={`drl-line-${line.lineNumber}`}
            style={getLineStyle(line)}
            onClick={() => {
              if (line.errors.length > 0) setSelectedError(line.errors[0]);
              else if (line.warnings.length > 0) setSelectedError(line.warnings[0]);
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 40,
                textAlign: 'right',
                paddingRight: 12,
                color: '#6a737d',
                userSelect: 'none',
                borderRight: '1px solid #e1e4e8',
                marginRight: 12,
                backgroundColor: line.errors.length > 0 ? '#ffccc7' : line.warnings.length > 0 ? '#ffe7ba' : 'transparent'
              }}
            >
              {line.lineNumber}
            </span>
            <span style={{ width: 20, textAlign: 'center', marginRight: 8 }}>
              {getErrorIcon(line)}
            </span>
            <span
              style={{ flex: 1, whiteSpace: 'pre' }}
              dangerouslySetInnerHTML={{
                __html: highlightDRL(line.content) || ' '
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Modal
      title={
        <Space>
          <FileTextOutlined />
          <span>{t('preview.title')}</span>
          {isEditing && (
            <Tag color="blue">{t('preview.editing')}</Tag>
          )}
          {checkResult && !isEditing && (
            <Space size="small">
              {checkResult.errors.length > 0 && (
                <Badge count={checkResult.errors.length} style={{ backgroundColor: '#ff4d4f' }}>
                  <Text type="danger" style={{ fontSize: 12 }}>{t('preview.errors')}</Text>
                </Badge>
              )}
              {checkResult.warnings.length > 0 && (
                <Badge count={checkResult.warnings.length} style={{ backgroundColor: '#faad14' }}>
                  <Text type="warning" style={{ fontSize: 12 }}>{t('preview.warnings')}</Text>
                </Badge>
              )}
              {checkResult.errors.length === 0 && checkResult.warnings.length === 0 && (
                <Badge count={0} style={{ backgroundColor: '#52c41a' }}>
                  <Text type="success" style={{ fontSize: 12 }}>{t('preview.noIssues')}</Text>
                </Badge>
              )}
            </Space>
          )}
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={1100}
      footer={
        <Space>
          <Button onClick={onClose}>{t('common.close')}</Button>
          {isEditing ? (
            <>
              <Button
                icon={<CloseOutlined />}
                onClick={handleCancelEdit}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
              >
                {t('common.save')}
              </Button>
            </>
          ) : (
            <>
              {onSave && (
                <Button
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  {t('common.edit')}
                </Button>
              )}
              <Button
                type="primary"
                icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                onClick={handleCopy}
              >
                {copied ? t('preview.copied') : t('preview.copyCode')}
              </Button>
            </>
          )}
        </Space>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Card size="small">
          <Row gutter={16}>
            <Col span={4}>
              <Statistic
                title={t('preview.stats.package')}
                value={stats.package || 'N/A'}
                valueStyle={{ fontSize: 12, color: '#1890ff' }}
              />
            </Col>
            <Col span={4}>
              <Statistic
                title={t('preview.stats.rules')}
                value={stats.rules}
                valueStyle={{ fontSize: 14, color: '#52c41a' }}
              />
            </Col>
            <Col span={4}>
              <Statistic
                title={t('preview.stats.imports')}
                value={stats.imports}
                valueStyle={{ fontSize: 14, color: '#faad14' }}
              />
            </Col>
            <Col span={4}>
              <Statistic
                title={t('preview.stats.lines')}
                value={stats.lines}
                valueStyle={{ fontSize: 14, color: '#722ed1' }}
              />
            </Col>
            <Col span={4}>
              <Statistic
                title={t('preview.stats.errors')}
                value={checkResult?.errors.length || 0}
                valueStyle={{ fontSize: 14, color: checkResult?.errors.length ? '#ff4d4f' : '#52c41a' }}
              />
            </Col>
            <Col span={4}>
              <Statistic
                title={t('preview.stats.warnings')}
                value={checkResult?.warnings.length || 0}
                valueStyle={{ fontSize: 14, color: checkResult?.warnings.length ? '#faad14' : '#52c41a' }}
              />
            </Col>
          </Row>
        </Card>
      </div>

      <Row gutter={16}>
        <Col span={16}>
          <Card
            size="small"
            title={
              <Space>
                {t('preview.codePreview')}
                {isEditing && editedCode !== drlCode && (
                  <Tag color="orange">{t('preview.modified')}</Tag>
                )}
              </Space>
            }
            extra={
              <Space size="small">
                <Text type="secondary">{t('preview.nodes')}: {nodesCount}</Text>
                <Text type="secondary">{t('preview.edges')}: {edgesCount}</Text>
              </Space>
            }
            bodyStyle={{ padding: 0 }}
          >
            {renderCodePreview()}
          </Card>
        </Col>

        <Col span={8}>
          <Card
            size="small"
            title={
              <Space>
                <WarningOutlined />
                <span>{t('preview.syntaxIssues')} ({allIssues.length})</span>
              </Space>
            }
            bodyStyle={{ padding: 0, maxHeight: 500, overflow: 'auto' }}
          >
            {allIssues.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center' }}>
                <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
                <Text type="secondary">{t('preview.noSyntaxIssues')}</Text>
              </div>
            ) : (
              <List
                size="small"
                dataSource={allIssues}
                renderItem={(issue, index) => (
                  <List.Item
                    key={index}
                    style={{
                      cursor: 'pointer',
                      padding: '8px 12px',
                      borderLeft: `3px solid ${issue.type === 'error' ? '#ff4d4f' : '#faad14'}`,
                      backgroundColor: selectedError === issue ? '#e6f7ff' : 'transparent'
                    }}
                    onClick={() => {
                      setSelectedError(issue);
                      scrollToLine(issue.line);
                    }}
                  >
                    <div style={{ width: '100%' }}>
                      <Space style={{ marginBottom: 4 }}>
                        {issue.type === 'error' ? (
                          <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                        ) : (
                          <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                        )}
                        <Text strong style={{ fontSize: 12 }}>
                          {t('preview.line')} {issue.line}, {t('preview.column')} {issue.column}
                        </Text>
                        <Tag color={issue.type === 'error' ? 'error' : 'warning'}>
                          {issue.code}
                        </Tag>
                      </Space>
                      <div style={{ marginLeft: 20 }}>
                        <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                          {issue.message}
                        </Text>
                        {issue.suggestion && (
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {t('preview.suggestion')}: {issue.suggestion}
                          </Text>
                        )}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Card>

          {selectedError && (
            <Alert
              style={{ marginTop: 16 }}
              type={selectedError.severity}
              message={selectedError.message}
              description={
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t('preview.location')}: {t('preview.line')} {selectedError.line}, {t('preview.column')} {selectedError.column}
                  </Text>
                  {selectedError.suggestion && (
                    <div style={{ marginTop: 8 }}>
                      <Text strong style={{ fontSize: 12 }}>{t('preview.suggestion')}:</Text>
                      <Text style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                        {selectedError.suggestion}
                      </Text>
                    </div>
                  )}
                </div>
              }
              closable
              onClose={() => setSelectedError(null)}
            />
          )}
        </Col>
      </Row>

      <div style={{ marginTop: 16 }}>
        <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0 }}>
          <Text strong>{t('common.tip')}：</Text>
          {isEditing ? t('preview.editTip') : t('preview.tip')}
        </Paragraph>
      </div>
    </Modal>
  );
};
