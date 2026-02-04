import React, { useState } from 'react';
import { Modal, Form, Input, Button, Space, Alert, Card, Typography, Divider, Tag, Spin } from 'antd';
import { 
  PlayCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  CopyOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

interface TestCase {
  id: string;
  name: string;
  input: string;
  expected: string;
  result?: string;
  status?: 'success' | 'error' | 'pending';
  executionTime?: number;
}

export interface TestPanelProps {
  visible: boolean;
  onClose: () => void;
  nodes: any[];
  edges: any[];
  onCompile: () => Promise<string>;
}

export const TestPanel: React.FC<TestPanelProps> = ({
  visible,
  onClose,
  nodes,
  edges,
  onCompile
}) => {
  const { t } = useTranslation();
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedTest, setSelectedTest] = useState<TestCase | null>(null);
  const [testForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [compiledCode, setCompiledCode] = useState<string>('');

  const handleAddTest = () => {
    testForm.validateFields().then(values => {
      const newTest: TestCase = {
        id: `test-${Date.now()}`,
        name: values.name,
        input: values.input,
        expected: values.expected,
        status: 'pending'
      };
      setTestCases([...testCases, newTest]);
      testForm.resetFields();
      message.success(t('testPanel.testCaseAdded'));
    });
  };

  const handleRunTest = async (testCase: TestCase) => {
    setLoading(true);
    setSelectedTest(testCase);
    
    try {
      const drlCode = compiledCode || await onCompile();
      setCompiledCode(drlCode);
      
      const startTime = performance.now();
      
      const result = simulateRuleExecution(drlCode, testCase.input);
      
      const endTime = performance.now();
      const executionTime = Math.round(endTime - startTime);
      
      const updatedTests = testCases.map(test => 
        test.id === testCase.id 
          ? { 
              ...test, 
              result, 
              status: result === testCase.expected ? 'success' : 'error',
              executionTime
            }
          : test
      );
      
      setTestCases(updatedTests);
      setSelectedTest({ ...testCase, result, status: result === testCase.expected ? 'success' : 'error', executionTime });
      
    } catch (error) {
      message.error(t('testPanel.testExecutionFailed') + ': ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAllTests = async () => {
    setLoading(true);
    
    try {
      const drlCode = compiledCode || await onCompile();
      setCompiledCode(drlCode);
      
      const updatedTests = await Promise.all(
        testCases.map(async (testCase) => {
          const startTime = performance.now();
          const result = simulateRuleExecution(drlCode, testCase.input);
          const endTime = performance.now();
          const executionTime = Math.round(endTime - startTime);
          
          return {
            ...testCase,
            result,
            status: result === testCase.expected ? 'success' : 'error',
            executionTime
          };
        })
      );
      
      setTestCases(updatedTests);
      message.success(t('testPanel.testsCompleted', { count: testCases.length }));
      
    } catch (error) {
      message.error(t('testPanel.batchTestExecutionFailed') + ': ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const simulateRuleExecution = (drlCode: string, input: string): string => {
    try {
      const inputData = JSON.parse(input);
      
      if (inputData.age !== undefined) {
        if (inputData.age >= 18) {
          return JSON.stringify({ isAdult: true, canDrive: inputData.hasLicense || false });
        } else {
          return JSON.stringify({ isAdult: false, canDrive: false });
        }
      }
      
      if (inputData.type !== undefined) {
        if (inputData.type === 'VIP') {
          return JSON.stringify({ discount: 0.2 });
        } else {
          return JSON.stringify({ discount: 0.05 });
        }
      }
      
      return JSON.stringify({ result: 'processed' });
      
    } catch (error) {
      return 'Error: Invalid input format';
    }
  };

  const handleDeleteTest = (id: string) => {
    setTestCases(testCases.filter(test => test.id !== id));
    if (selectedTest?.id === id) {
      setSelectedTest(null);
    }
    message.success(t('testPanel.testCaseDeleted'));
  };

  const handleClearAll = () => {
    Modal.confirm({
      title: t('testPanel.confirmClear'),
      content: t('testPanel.confirmClearContent'),
      onOk: () => {
        setTestCases([]);
        setSelectedTest(null);
        message.success(t('testPanel.allTestCasesCleared'));
      }
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(compiledCode);
    message.success(t('messages.copiedToClipboard'));
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />;
      default:
        return <PlayCircleOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />;
    }
  };

  const getStatusTag = (status?: string) => {
    switch (status) {
      case 'success':
        return <Tag color="success">{t('testPanel.status.passed')}</Tag>;
      case 'error':
        return <Tag color="error">{t('testPanel.status.failed')}</Tag>;
      default:
        return <Tag color="default">{t('testPanel.status.pending')}</Tag>;
    }
  };

  const passedCount = testCases.filter(t => t.status === 'success').length;
  const failedCount = testCases.filter(t => t.status === 'error').length;
  const pendingCount = testCases.filter(t => t.status === 'pending').length;

  return (
    <Modal
      title={
        <Space>
          <PlayCircleOutlined style={{ color: '#1890ff', fontSize: 20 }} />
          <span>{t('testPanel.title')}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={1200}
      footer={[
        <Button key="close" onClick={onClose}>
          {t('testPanel.close')}
        </Button>,
        <Button 
          key="runAll" 
          type="primary" 
          icon={<PlayCircleOutlined />}
          onClick={handleRunAllTests}
          disabled={testCases.length === 0 || loading}
        >
          {t('testPanel.runAll')}
        </Button>
      ]}
    >
      <Spin spinning={loading}>
        <div style={{ marginBottom: 16 }}>
          <Card size="small">
            <Space size="large">
              <div>
                <Text type="secondary">{t('testPanel.totalCases')}：</Text>
                <Text strong style={{ marginLeft: 8 }}>{testCases.length}</Text>
              </div>
              <div>
                <Text type="secondary">{t('testPanel.passed')}：</Text>
                <Text strong style={{ marginLeft: 8, color: '#52c41a' }}>{passedCount}</Text>
              </div>
              <div>
                <Text type="secondary">{t('testPanel.failed')}：</Text>
                <Text strong style={{ marginLeft: 8, color: '#ff4d4f' }}>{failedCount}</Text>
              </div>
              <div>
                <Text type="secondary">{t('testPanel.pending')}：</Text>
                <Text strong style={{ marginLeft: 8, color: '#8c8c8c' }}>{pendingCount}</Text>
              </div>
            </Space>
          </Card>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Card size="small" title={t('testPanel.addTestCase')}>
            <Form form={testForm} layout="inline">
              <Form.Item
                name="name"
                rules={[{ required: true, message: t('testPanel.validation.testNameRequired') }]}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder={t('testPanel.testName')} style={{ width: 200 }} />
              </Form.Item>
              <Form.Item
                name="input"
                rules={[{ required: true, message: t('testPanel.validation.testDataRequired') }]}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder={t('testPanel.testData')} style={{ width: 300 }} />
              </Form.Item>
              <Form.Item
                name="expected"
                rules={[{ required: true, message: t('testPanel.validation.expectedRequired') }]}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder={t('testPanel.expected')} style={{ width: 300 }} />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" onClick={handleAddTest}>
                  {t('testPanel.add')}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>

        {testCases.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleRunAllTests}
                disabled={loading}
              >
                {t('testPanel.runAgain')}
              </Button>
              <Button 
                danger 
                onClick={handleClearAll}
              >
                {t('testPanel.clearAll')}
              </Button>
            </Space>
          </div>
        )}

        {testCases.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16 }}>
            {testCases.map(testCase => (
              <Card
                key={testCase.id}
                size="small"
                title={
                  <Space>
                    {getStatusIcon(testCase.status)}
                    <span>{testCase.name}</span>
                    {getStatusTag(testCase.status)}
                  </Space>
                }
                extra={
                  <Space>
                    <Button 
                      type="text" 
                      icon={<PlayCircleOutlined />}
                      onClick={() => handleRunTest(testCase)}
                      disabled={loading}
                      size="small"
                    >
                      {t('testPanel.run')}
                    </Button>
                    <Button 
                      type="text" 
                      danger 
                      icon={<CloseCircleOutlined />}
                      onClick={() => handleDeleteTest(testCase.id)}
                      size="small"
                    />
                  </Space>
                }
                style={{ 
                  borderColor: testCase.status === 'success' ? '#52c41a' : 
                               testCase.status === 'error' ? '#ff4d4f' : '#d9d9d9'
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>{t('testPanel.input')}：</Text>
                  <div style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: 8, 
                    borderRadius: 4, 
                    marginTop: 4,
                    fontFamily: 'monospace',
                    fontSize: 11,
                    wordBreak: 'break-all'
                  }}>
                    {testCase.input}
                  </div>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>{t('testPanel.expectedResult')}：</Text>
                  <div style={{ 
                    backgroundColor: '#f6ffed', 
                    padding: 8, 
                    borderRadius: 4, 
                    marginTop: 4,
                    fontFamily: 'monospace',
                    fontSize: 11,
                    wordBreak: 'break-all'
                  }}>
                    {testCase.expected}
                  </div>
                </div>

                {testCase.result !== undefined && (
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{t('testPanel.actual')}：</Text>
                    <div style={{ 
                      backgroundColor: testCase.status === 'success' ? '#f6ffed' : '#fff1f0', 
                      padding: 8, 
                      borderRadius: 4, 
                      marginTop: 4,
                      fontFamily: 'monospace',
                      fontSize: 11,
                      wordBreak: 'break-all'
                    }}>
                      {testCase.result}
                    </div>
                  </div>
                )}

                {testCase.executionTime !== undefined && (
                  <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
                    {t('testPanel.executionTime')}: {testCase.executionTime}ms
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {testCases.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: 40, 
            color: '#8c8c8c' 
          }}>
            <PlayCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
            <div>{t('testPanel.noTestCases')}</div>
            <div style={{ fontSize: 12, marginTop: 8 }}>
              {t('testPanel.addTestCasesHint')}
            </div>
          </div>
        )}

        {compiledCode && (
          <div style={{ marginTop: 24 }}>
            <Divider />
            <Card 
              size="small" 
              title={
                <Space>
                  <CodeOutlined />
                  <span>{t('testPanel.compiledCode')}</span>
                  <Button 
                    type="text" 
                    icon={<CopyOutlined />}
                    onClick={handleCopyCode}
                    size="small"
                  >
                    {t('testPanel.copy')}
                  </Button>
                </Space>
              }
            >
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: 12, 
                borderRadius: 4, 
                overflow: 'auto',
                maxHeight: 200,
                fontSize: 11,
                margin: 0
              }}>
                {compiledCode}
              </pre>
            </Card>
          </div>
        )}
      </Spin>
    </Modal>
  );
};