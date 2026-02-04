import React from 'react';
import { Card, Form, Input, Select, InputNumber, Button, Divider } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

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
          <span style={{ color: '#999' }}>请选择一个节点以编辑属性</span>
        </Card>
      </div>
    );
  }

  const nodeType = selectedNode.type;
  const config = selectedNode.data?.config || {};

  return (
    <div style={{ padding: 16, height: '100%', overflowY: 'auto' }}>
      <Card
        title="属性配置"
        size="small"
        extra={
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          >
            删除
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
          <Form.Item label="节点名称" name="label">
            <Input placeholder="输入节点名称" />
          </Form.Item>

          <Divider />

          {nodeType === 'condition' && (
            <>
              <Form.Item label="字段" name="field">
                <Input placeholder="例如: $fact.age" />
              </Form.Item>
              <Form.Item label="操作符" name="operator">
                <Select placeholder="选择操作符">
                  <Option value="==">等于</Option>
                  <Option value="!=">不等于</Option>
                  <Option value="gt">大于</Option>
                  <Option value="lt">小于</Option>
                  <Option value="gte">大于等于</Option>
                  <Option value="lte">小于等于</Option>
                  <Option value="contains">包含</Option>
                  <Option value="in">在...中</Option>
                  <Option value="not in">不在...中</Option>
                </Select>
              </Form.Item>
              <Form.Item label="值" name="value">
                <Input placeholder="输入值" />
              </Form.Item>
              <Form.Item label="逻辑操作符" name="logicalOperator">
                <Select placeholder="选择逻辑操作符">
                  <Option value="AND">AND</Option>
                  <Option value="OR">OR</Option>
                </Select>
              </Form.Item>
            </>
          )}

          {nodeType === 'action' && (
            <>
              <Form.Item label="动作类型" name="type">
                <Select placeholder="选择动作类型">
                  <Option value="set">设置值</Option>
                  <Option value="call">调用方法</Option>
                  <Option value="insert">插入事实</Option>
                  <Option value="retract">撤回事实</Option>
                  <Option value="modify">修改事实</Option>
                </Select>
              </Form.Item>
              <Form.Item label="目标" name="target">
                <Input placeholder="例如: fieldName 或 className" />
              </Form.Item>
              <Form.Item label="值" name="value">
                <Input placeholder="输入值" />
              </Form.Item>
              <Form.Item label="方法名" name="method">
                <Input placeholder="输入方法名" />
              </Form.Item>
            </>
          )}

          {nodeType === 'decision' && (
            <>
              <Form.Item label="表达式" name="expression">
                <Input.TextArea 
                  rows={3} 
                  placeholder="例如: $fact.age > 18 && $fact.hasLicense" 
                />
              </Form.Item>
            </>
          )}

          {nodeType === 'group' && (
            <>
              <Form.Item label="分组名称" name="name">
                <Input placeholder="输入分组名称" />
              </Form.Item>
              <Form.Item label="优先级" name="salience">
                <InputNumber 
                  min={0} 
                  max={65535} 
                  style={{ width: '100%' }} 
                  placeholder="输入优先级"
                />
              </Form.Item>
              <Form.Item label="议程组" name="agendaGroup">
                <Input placeholder="输入议程组名称" />
              </Form.Item>
              <Form.Item label="激活组" name="activationGroup">
                <Input placeholder="输入激活组名称" />
              </Form.Item>
            </>
          )}

          <Divider />

          <div style={{ fontSize: 12, color: '#999' }}>
            <div>节点ID: {selectedNode.id}</div>
            <div>节点类型: {nodeType}</div>
          </div>
        </Form>
      </Card>
    </div>
  );
};
