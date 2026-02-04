import React from 'react';
import { Card, Form, Input, Select, InputNumber, Button, Divider, Space } from 'antd';
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { TextArea } = Input;

export interface PropertyPanelProps {
  selectedNode: any;
  onUpdateNode: (nodeId: string, data: any) => void;
  onDeleteNode: (nodeId: string) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedNode,
  onUpdateNode,
  onDeleteNode
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleValuesChange = (_changedValues: any, allValues: any) => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        ...selectedNode.data,
        config: allValues
      });
    }
  };

  const handleDelete = () => {
    if (selectedNode) {
      onDeleteNode(selectedNode.id);
    }
  };

  if (!selectedNode) {
    return (
      <div style={{ padding: 16, height: '100%' }}>
        <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#999' }}>{t('propertyPanel.selectNode')}</span>
        </Card>
      </div>
    );
  }

  const nodeType = selectedNode.type;
  const config = selectedNode.data?.config || {};

  return (
    <div style={{ padding: 16, height: '100%', overflowY: 'auto' }}>
      <Card
        title={t('propertyPanel.title')}
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
        <Form
          form={form}
          layout="vertical"
          initialValues={config}
          onValuesChange={handleValuesChange}
          size="small"
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
                rules={[{ required: true, message: t('propertyPanel.validation.required') }]}
                extra={<InfoCircleOutlined style={{ color: '#1890ff' }} />}
              >
                <Input placeholder={t('propertyPanel.condition.fieldPlaceholder')} />
              </Form.Item>
              <Form.Item 
                label={t('propertyPanel.condition.operator')} 
                name="operator"
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
                rules={[{ required: true, message: t('propertyPanel.validation.required') }]}
              >
                <Input placeholder={t('propertyPanel.action.targetPlaceholder')} />
              </Form.Item>
              <Form.Item label={t('propertyPanel.action.value')} name="value">
                <Input placeholder={t('propertyPanel.action.valuePlaceholder')} />
              </Form.Item>
              <Form.Item label={t('propertyPanel.action.method')} name="method">
                <Input placeholder={t('propertyPanel.action.methodPlaceholder')} />
              </Form.Item>
            </>
          )}

          {nodeType === 'decision' && (
            <>
              <Form.Item 
                label={t('propertyPanel.decision.expression')} 
                name="expression"
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
                rules={[{ required: true, message: t('propertyPanel.validation.required') }]}
              >
                <Input placeholder={t('propertyPanel.group.namePlaceholder')} />
              </Form.Item>
              <Form.Item 
                label={t('propertyPanel.group.priority')} 
                name="salience"
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

          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ fontSize: 12, color: '#999' }}>
              <div>{t('propertyPanel.nodeId')}: {selectedNode.id}</div>
              <div>{t('propertyPanel.nodeType')}: {nodeType}</div>
            </div>
          </Space>
        </Form>
      </Card>
    </div>
  );
};
