import React, { useState, useEffect, useMemo } from 'react';
import { Card, Form, Input, Select, InputNumber, Button, Divider, Space, Alert, Collapse, Tag, Tooltip, message, Empty } from 'antd';
import { DeleteOutlined, InfoCircleOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, CopyOutlined, DatabaseOutlined, FieldStringOutlined, FieldNumberOutlined, FieldBinaryOutlined, CalendarOutlined, ProfileOutlined, UnorderedListOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useEditorStore } from '@/stores/useEditorStore';
import { DataModel, DataModelField } from '@/types/rule.types';

const { Option } = Select;
const { TextArea } = Input;

export interface PropertyPanelProps {
  selectedNode: any;
  selectedEdge: any;
  onUpdateNode: (nodeId: string, data: any) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
}

// 字段类型图标映射
const getFieldTypeIcon = (type: DataModelField['type']) => {
  switch (type) {
    case 'string':
      return <FieldStringOutlined style={{ color: '#52c41a' }} />;
    case 'number':
      return <FieldNumberOutlined style={{ color: '#1890ff' }} />;
    case 'boolean':
      return <FieldBinaryOutlined style={{ color: '#722ed1' }} />;
    case 'date':
      return <CalendarOutlined style={{ color: '#fa8c16' }} />;
    case 'enum':
      return <ProfileOutlined style={{ color: '#eb2f96' }} />;
    case 'object':
      return <DatabaseOutlined style={{ color: '#13c2c2' }} />;
    case 'array':
      return <UnorderedListOutlined style={{ color: '#fa541c' }} />;
    default:
      return <QuestionCircleOutlined style={{ color: '#999' }} />;
  }
};

// 字段类型颜色映射
const getFieldTypeColor = (type: DataModelField['type']) => {
  switch (type) {
    case 'string':
      return 'green';
    case 'number':
      return 'blue';
    case 'boolean':
      return 'purple';
    case 'date':
      return 'orange';
    case 'enum':
      return 'magenta';
    case 'object':
      return 'cyan';
    case 'array':
      return 'volcano';
    default:
      return 'default';
  }
};

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onDeleteNode,
  onDeleteEdge
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setPreviewVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // 从 store 获取数据模型
  const dataModels = useEditorStore((state) => state.dataModels);

  // 生成字段选项（按数据模型分组）
  const fieldOptions = useMemo(() => {
    return dataModels.map((model: DataModel) => ({
      label: (
        <span>
          <DatabaseOutlined style={{ marginRight: 4 }} />
          {model.name}
        </span>
      ),
      options: model.fields.map((field: DataModelField) => ({
        label: (
          <Space size="small">
            {getFieldTypeIcon(field.type)}
            <span>{field.name}</span>
            <Tag color={getFieldTypeColor(field.type)}>{field.type}</Tag>
            {field.required && <Tag color="red">{t('propertyPanel.fieldRequired')}</Tag>}
          </Space>
        ),
        value: field.name,
        field: field,
        model: model
      }))
    }));
  }, [dataModels, t]);

  // 生成简单的字段列表（用于动作节点）
  const simpleFieldOptions = useMemo(() => {
    const options: { label: React.ReactNode; value: string; field: DataModelField; model: DataModel }[] = [];
    dataModels.forEach((model: DataModel) => {
      model.fields.forEach((field: DataModelField) => {
        options.push({
          label: (
            <Space size="small">
              {getFieldTypeIcon(field.type)}
              <span>{field.name}</span>
              <Tag color={getFieldTypeColor(field.type)}>{field.type}</Tag>
              <span style={{ color: '#999', fontSize: 12 }}>({model.name})</span>
            </Space>
          ),
          value: field.name,
          field: field,
          model: model
        });
      });
    });
    return options;
  }, [dataModels]);

  const handleValuesChange = (_changedValues: any, allValues: any) => {
    if (selectedNode) {
      const { label, ...config } = allValues;
      const errors = validateConfig(selectedNode.type, config);
      setValidationErrors(errors);
      onUpdateNode(selectedNode.id, {
        ...selectedNode.data,
        label,
        config
      });
    }
  };

  const handleDelete = () => {
    if (selectedNode) {
      onDeleteNode(selectedNode.id);
    } else if (selectedEdge) {
      onDeleteEdge(selectedEdge.id);
    }
  };

  const validateConfig = (nodeType: string, config: any): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (nodeType === 'condition') {
      if (!config.field) errors.field = t('propertyPanel.validation.fieldRequired');
      if (!config.operator) errors.operator = t('propertyPanel.validation.operatorRequired');
      if (config.value === undefined || config.value === '') errors.value = t('propertyPanel.validation.valueRequired');
      
      if (config.operator === 'in' || config.operator === 'not in') {
        if (typeof config.value === 'string' && config.value.split(',').length < 2) {
          errors.value = t('propertyPanel.validation.inOperatorRequired');
        }
      }
    }
    
    if (nodeType === 'action') {
      if (!config.type) errors.type = t('propertyPanel.validation.actionTypeRequired');
      if (!config.target) errors.target = t('propertyPanel.validation.targetRequired');
      if (config.type === 'call' && !config.method) {
        errors.method = t('propertyPanel.validation.methodRequired');
      }
    }
    
    if (nodeType === 'decision') {
      if (!config.expression) errors.expression = t('propertyPanel.validation.expressionRequired');
      try {
        if (config.expression) {
          new Function(`return ${config.expression}`);
        }
      } catch (e) {
        errors.expression = t('propertyPanel.validation.expressionSyntaxError');
      }
    }
    
    if (nodeType === 'group') {
      if (!config.name) errors.name = t('propertyPanel.validation.groupNameRequired');
      if (config.salience !== undefined && (config.salience < 0 || config.salience > 65535)) {
        errors.salience = t('propertyPanel.validation.salienceRangeError');
      }
    }
    
    return errors;
  };

  const generatePreviewCode = () => {
    if (!selectedNode) return '';
    const config = selectedNode.data?.config || {};
    const nodeType = selectedNode.type;
    
    switch (nodeType) {
      case 'condition':
        return `$${config.field} ${config.operator} ${config.value}`;
      case 'action':
        return `${config.type}(${config.target}${config.value ? `, ${config.value}` : ''}${config.method ? `, ${config.method}` : ''})`;
      case 'decision':
        return `if (${config.expression}) { ... }`;
      case 'group':
        return `agenda-group "${config.agendaGroup || 'default'}" ${config.salience !== undefined ? `salience ${config.salience}` : ''}`;
      default:
        return '';
    }
  };

  const copyToClipboard = () => {
    const code = generatePreviewCode();
    navigator.clipboard.writeText(code);
    message.success(t('propertyPanel.configCopied'));
  };

  useEffect(() => {
    if (selectedNode) {
      const config = selectedNode.data?.config || {};
      const formValues = {
        label: selectedNode.data?.label,
        ...config
      };
      form.setFieldsValue(formValues);
      const errors = validateConfig(selectedNode.type, config);
      setValidationErrors(errors);
    }
  }, [selectedNode, form]);

  if (!selectedNode && !selectedEdge) {
    return (
      <div style={{ padding: 16, height: '100%' }}>
        <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#999' }}>{t('propertyPanel.selectNode')}</span>
        </Card>
      </div>
    );
  }

  if (selectedEdge) {
    return (
      <div style={{ padding: 16, height: '100%' }}>
        <Card
          title={t('propertyPanel.edgeTitle')}
          size="small"
          extra={
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              onClick={handleDelete}
            >
              {t('propertyPanel.delete')}
            </Button>
          }
        >
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ fontSize: 12, color: '#999' }}>
              <div>{t('propertyPanel.edgeId')}: {selectedEdge.id}</div>
              <div style={{ marginTop: 8 }}>
                {t('propertyPanel.source')}: 
                <Tag color="blue">{selectedEdge.source}</Tag>
              </div>
              <div style={{ marginTop: 8 }}>
                {t('propertyPanel.target')}: 
                <Tag color="green">{selectedEdge.target}</Tag>
              </div>
            </div>
          </Space>
        </Card>
      </div>
    );
  }

  const nodeType = selectedNode.type;
  const config = selectedNode.data?.config || {};
  const hasErrors = Object.keys(validationErrors).length > 0;

  return (
    <div style={{ padding: 16, height: '100%', overflowY: 'auto' }}>
      <Card
        title={t('propertyPanel.title')}
        size="small"
        extra={
          <Space>
            <Tooltip title={t('propertyPanel.copyConfig')}>
              <Button 
                type="text" 
                icon={<CopyOutlined />}
                onClick={copyToClipboard}
              />
            </Tooltip>
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              onClick={handleDelete}
            >
              {t('propertyPanel.delete')}
            </Button>
          </Space>
        }
      >
        {hasErrors && (
          <Alert
            message={t('propertyPanel.configError')}
            description={t('propertyPanel.configErrorDescription')}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            icon={<CloseCircleOutlined />}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          initialValues={{ label: selectedNode.data?.label, ...config }}
          onValuesChange={handleValuesChange}
          size="small"
          validateTrigger="onChange"
        >
          <Form.Item 
            label={t('propertyPanel.nodeName')} 
            name="label"
            rules={[{ required: true, message: t('propertyPanel.validation.required') }]}
          >
            <Input placeholder={t('propertyPanel.nodeNamePlaceholder')} />
          </Form.Item>

          <Divider />

          {nodeType === 'condition' && (
            <>
              <Form.Item 
                label={t('propertyPanel.condition.field')} 
                name="field"
                validateStatus={validationErrors.field ? 'error' : ''}
                help={validationErrors.field}
                rules={[{ required: true, message: t('propertyPanel.validation.required') }]}
                extra={
                  <Tooltip title={t('propertyPanel.condition.fieldTooltip')}>
                    <InfoCircleOutlined style={{ color: '#1890ff' }} />
                  </Tooltip>
                }
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={t('propertyPanel.condition.fieldPlaceholder')}
                  options={fieldOptions}
                  optionFilterProp="value"
                  filterOption={(input, option) => {
                    if (!option) return false;
                    // 对于分组选项，检查选项的 value 或 label 文本
                    const optionValue = (option as any).value || '';
                    const optionLabel = (option as any).label || '';
                    const searchText = typeof optionLabel === 'string' ? optionLabel : optionValue;
                    return searchText.toLowerCase().includes(input.toLowerCase());
                  }}
                  notFoundContent={
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={t('propertyPanel.noDataModels')}
                    />
                  }
                  dropdownRender={(menu) => (
                    <div>
                      {dataModels.length === 0 && (
                        <div style={{ padding: '8px 12px', color: '#999', fontSize: 12 }}>
                          {t('propertyPanel.noDataModelsHint')}
                        </div>
                      )}
                      {menu}
                    </div>
                  )}
                />
              </Form.Item>
              <Form.Item 
                label={t('propertyPanel.condition.operator')} 
                name="operator"
                validateStatus={validationErrors.operator ? 'error' : ''}
                help={validationErrors.operator}
                rules={[{ required: true, message: t('propertyPanel.validation.required') }]}
              >
                <Select placeholder={t('propertyPanel.condition.operatorPlaceholder')}>
                  <Option value="==">{t('propertyPanel.condition.operators.eq')}</Option>
                  <Option value="!=">{t('propertyPanel.condition.operators.neq')}</Option>
                  <Option value="gt">{t('propertyPanel.condition.operators.gt')}</Option>
                  <Option value="lt">{t('propertyPanel.condition.operators.lt')}</Option>
                  <Option value="gte">{t('propertyPanel.condition.operators.gte')}</Option>
                  <Option value="lte">{t('propertyPanel.condition.operators.lte')}</Option>
                  <Option value="contains">{t('propertyPanel.condition.operators.contains')}</Option>
                  <Option value="in">{t('propertyPanel.condition.operators.in')}</Option>
                  <Option value="not in">{t('propertyPanel.condition.operators.notIn')}</Option>
                </Select>
              </Form.Item>
              <Form.Item 
                label={t('propertyPanel.condition.value')} 
                name="value"
                validateStatus={validationErrors.value ? 'error' : ''}
                help={validationErrors.value}
                rules={[{ required: true, message: t('propertyPanel.validation.required') }]}
              >
                <Input placeholder={t('propertyPanel.condition.valuePlaceholder')} />
              </Form.Item>
              <Form.Item 
                label={t('propertyPanel.condition.logicalOperator')} 
                name="logicalOperator"
              >
                <Select placeholder={t('propertyPanel.condition.logicalOperatorPlaceholder')}>
                  <Option value="AND">{t('propertyPanel.condition.logicalOperators.and')}</Option>
                  <Option value="OR">{t('propertyPanel.condition.logicalOperators.or')}</Option>
                </Select>
              </Form.Item>
            </>
          )}

          {nodeType === 'action' && (
            <>
              <Form.Item 
                label={t('propertyPanel.action.type')} 
                name="type"
                validateStatus={validationErrors.type ? 'error' : ''}
                help={validationErrors.type}
                rules={[{ required: true, message: t('propertyPanel.validation.required') }]}
              >
                <Select placeholder={t('propertyPanel.action.typePlaceholder')}>
                  <Option value="set">{t('propertyPanel.action.types.set')}</Option>
                  <Option value="call">{t('propertyPanel.action.types.call')}</Option>
                  <Option value="insert">{t('propertyPanel.action.types.insert')}</Option>
                  <Option value="retract">{t('propertyPanel.action.types.retract')}</Option>
                  <Option value="modify">{t('propertyPanel.action.types.modify')}</Option>
                </Select>
              </Form.Item>
              <Form.Item 
                label={t('propertyPanel.action.target')} 
                name="target"
                validateStatus={validationErrors.target ? 'error' : ''}
                help={validationErrors.target}
                rules={[{ required: true, message: t('propertyPanel.validation.required') }]}
                extra={
                  <Tooltip title={t('propertyPanel.action.targetTooltip')}>
                    <InfoCircleOutlined style={{ color: '#1890ff' }} />
                  </Tooltip>
                }
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={t('propertyPanel.action.targetPlaceholder')}
                  options={simpleFieldOptions}
                  optionFilterProp="value"
                  filterOption={(input, option) => {
                    if (!option) return false;
                    const optionValue = (option as any).value || '';
                    return optionValue.toLowerCase().includes(input.toLowerCase());
                  }}
                  notFoundContent={
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={t('propertyPanel.noDataModels')}
                    />
                  }
                  dropdownRender={(menu) => (
                    <div>
                      {dataModels.length === 0 && (
                        <div style={{ padding: '8px 12px', color: '#999', fontSize: 12 }}>
                          {t('propertyPanel.noDataModelsHint')}
                        </div>
                      )}
                      {menu}
                    </div>
                  )}
                />
              </Form.Item>
              <Form.Item label={t('propertyPanel.action.value')} name="value">
                <Input placeholder={t('propertyPanel.action.valuePlaceholder')} />
              </Form.Item>
              <Form.Item 
                label={t('propertyPanel.action.method')} 
                name="method"
                validateStatus={validationErrors.method ? 'error' : ''}
                help={validationErrors.method}
              >
                <Input placeholder={t('propertyPanel.action.methodPlaceholder')} />
              </Form.Item>
            </>
          )}

          {nodeType === 'decision' && (
            <>
              <Form.Item 
                label={t('propertyPanel.decision.expression')} 
                name="expression"
                validateStatus={validationErrors.expression ? 'error' : ''}
                help={validationErrors.expression}
                rules={[{ required: true, message: t('propertyPanel.validation.required') }]}
              >
                <TextArea 
                  rows={3} 
                  placeholder={t('propertyPanel.decision.expressionPlaceholder')} 
                />
              </Form.Item>
            </>
          )}

          {nodeType === 'group' && (
            <>
              <Form.Item 
                label={t('propertyPanel.group.name')} 
                name="name"
                validateStatus={validationErrors.name ? 'error' : ''}
                help={validationErrors.name}
                rules={[{ required: true, message: t('propertyPanel.validation.required') }]}
              >
                <Input placeholder={t('propertyPanel.group.namePlaceholder')} />
              </Form.Item>
              <Form.Item 
                label={t('propertyPanel.group.priority')} 
                name="salience"
                validateStatus={validationErrors.salience ? 'error' : ''}
                help={validationErrors.salience}
              >
                <InputNumber 
                  min={0} 
                  max={65535} 
                  style={{ width: '100%' }} 
                  placeholder={t('propertyPanel.group.priorityPlaceholder')}
                />
              </Form.Item>
              <Form.Item label={t('propertyPanel.group.agendaGroup')} name="agendaGroup">
                <Input placeholder={t('propertyPanel.group.agendaGroupPlaceholder')} />
              </Form.Item>
              <Form.Item label={t('propertyPanel.group.activationGroup')} name="activationGroup">
                <Input placeholder={t('propertyPanel.group.activationGroupPlaceholder')} />
              </Form.Item>
            </>
          )}

          <Divider />

          <Collapse 
            ghost
            items={[
              {
                key: 'preview',
                label: (
                  <Space>
                    <EyeOutlined />
                    <span>{t('propertyPanel.preview')}</span>
                    {!hasErrors && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  </Space>
                ),
                children: (
                  <div style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: 12, 
                    borderRadius: 4, 
                    fontFamily: 'monospace',
                    fontSize: 12,
                    wordBreak: 'break-all'
                  }}>
                    {generatePreviewCode()}
                  </div>
                )
              }
            ]}
          />

          <Divider />

          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ fontSize: 12, color: '#999' }}>
              <div>{t('propertyPanel.nodeId')}: {selectedNode.id}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {t('propertyPanel.nodeType')}: 
                <Tag color="blue">{nodeType}</Tag>
              </div>
            </div>
          </Space>
        </Form>
      </Card>
    </div>
  );
};
