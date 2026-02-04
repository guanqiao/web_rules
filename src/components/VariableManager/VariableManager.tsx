import React, { useState } from 'react';
import { Modal, Table, Button, Space, Input, Select, Tag, message, Popconfirm } from 'antd';
import { 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  AppstoreOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

interface Variable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  scope: 'global' | 'session' | 'node';
  defaultValue?: any;
  description: string;
}

export interface VariableManagerProps {
  visible: boolean;
  onClose: () => void;
  variables?: Variable[];
  onSave?: (variables: Variable[]) => void;
}

export const VariableManager: React.FC<VariableManagerProps> = ({
  visible,
  onClose,
  variables: initialVariables = [],
  onSave
}) => {
  const { t } = useTranslation();
  const [variables, setVariables] = useState<Variable[]>(initialVariables);
  const [editingVariable, setEditingVariable] = useState<Variable | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [formData, setFormData] = useState<Partial<Variable>>({});

  const handleAdd = () => {
    setFormData({
      name: '',
      type: 'string',
      scope: 'global',
      description: ''
    });
    setEditingVariable(null);
    setEditModalVisible(true);
  };

  const handleEdit = (variable: Variable) => {
    setFormData({ ...variable });
    setEditingVariable(variable);
    setEditModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setVariables(variables.filter(v => v.id !== id));
    message.success(t('variableManager.variableDeleted'));
  };

  const handleCopy = (variable: Variable) => {
    const newVariable: Variable = {
      ...variable,
      id: `var-${Date.now()}`,
      name: `${variable.name}_copy`
    };
    setVariables([...variables, newVariable]);
    message.success(t('variableManager.variableCopied'));
  };

  const handleSave = () => {
    if (!formData.name || !formData.type || !formData.scope) {
      message.error(t('variableManager.fillRequiredFields'));
      return;
    }

    if (editingVariable) {
      setVariables(variables.map(v => 
        v.id === editingVariable.id ? { ...formData, id: v.id } as Variable : v
      ));
      message.success(t('variableManager.variableUpdated'));
    } else {
      const newVariable: Variable = {
        id: `var-${Date.now()}`,
        ...formData as Variable
      };
      setVariables([...variables, newVariable]);
      message.success(t('variableManager.variableAdded'));
    }
    setEditModalVisible(false);
    setFormData({});
  };

  const handleSaveAll = () => {
    if (onSave) {
      onSave(variables);
      message.success(t('variableManager.variableConfigSaved'));
      onClose();
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string': return 'blue';
      case 'number': return 'green';
      case 'boolean': return 'orange';
      case 'object': return 'purple';
      case 'array': return 'cyan';
      default: return 'default';
    }
  };

  const getScopeColor = (scope: string) => {
    switch (scope) {
      case 'global': return 'red';
      case 'session': return 'orange';
      case 'node': return 'blue';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: t('variableManager.variableName'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <code style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '2px 6px', 
          borderRadius: 4,
          fontSize: 12
        }}>
          {name}
        </code>
      )
    },
    {
      title: t('variableManager.variableType'),
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={getTypeColor(type)}>{type}</Tag>
      )
    },
    {
      title: t('variableManager.variableScope'),
      dataIndex: 'scope',
      key: 'scope',
      width: 100,
      render: (scope: string) => (
        <Tag color={getScopeColor(scope)}>{scope}</Tag>
      )
    },
    {
      title: t('variableManager.defaultValue'),
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      width: 120,
      render: (value: any) => (
        <span style={{ 
          fontSize: 12, 
          color: '#8c8c8c',
          fontFamily: 'monospace'
        }}>
          {value !== undefined ? String(value) : '-'}
        </span>
      )
    },
    {
      title: t('variableManager.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: t('variableManager.actions'),
      key: 'actions',
      width: 180,
      render: (_: any, record: Variable) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<CopyOutlined />} 
            onClick={() => handleCopy(record)}
            size="small"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title={t('variableManager.confirmDelete')}
            description={t('variableManager.confirmDeleteContent')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.confirm')}
            cancelText={t('common.cancel')}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <Modal
        title={
          <Space>
            <AppstoreOutlined style={{ color: '#1890ff' }} />
            <span>{t('variableManager.title')}</span>
          </Space>
        }
        open={visible}
        onCancel={onClose}
        width={900}
        footer={[
          <Button key="cancel" onClick={onClose}>
            {t('variableManager.close')}
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveAll}>
            {t('variableManager.saveConfig')}
          </Button>
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAdd}
          >
            {t('variableManager.addVariable')}
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={variables}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="small"
        />

        {variables.length > 0 && (
          <div style={{ 
            marginTop: 16, 
            padding: 12, 
            backgroundColor: '#f0f9ff', 
            borderRadius: 8,
            border: '1px solid #bae7ff'
          }}>
            <div style={{ fontSize: 12, color: '#595959' }}>
              <strong style={{ color: '#1890ff' }}>{t('variableManager.usageInstructions')}：</strong>
              <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                <li>{t('variableManager.usageInstructionsContent.global')}</li>
                <li>{t('variableManager.usageInstructionsContent.session')}</li>
                <li>{t('variableManager.usageInstructionsContent.node')}</li>
                <li>{t('variableManager.usageInstructionsContent.reference')}</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={editingVariable ? t('variableManager.editVariableModal') : t('variableManager.addVariableModal')}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
        width={600}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              {t('variableManager.variableName')} <span style={{ color: '#ff4d4f' }}>*</span>
            </label>
            <Input
              placeholder={t('variableManager.placeholders.variableName')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              {t('variableManager.variableType')} <span style={{ color: '#ff4d4f' }}>*</span>
            </label>
            <Select
              placeholder={t('variableManager.placeholders.selectVariableType')}
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value })}
              style={{ width: '100%' }}
            >
              <Option value="string">{t('variableManager.types.string')}</Option>
              <Option value="number">{t('variableManager.types.number')}</Option>
              <Option value="boolean">{t('variableManager.types.boolean')}</Option>
              <Option value="object">{t('variableManager.types.object')}</Option>
              <Option value="array">{t('variableManager.types.array')}</Option>
            </Select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              {t('variableManager.variableScope')} <span style={{ color: '#ff4d4f' }}>*</span>
            </label>
            <Select
              placeholder={t('variableManager.placeholders.selectVariableScope')}
              value={formData.scope}
              onChange={(value) => setFormData({ ...formData, scope: value })}
              style={{ width: '100%' }}
            >
              <Option value="global">{t('variableManager.scopes.global')}</Option>
              <Option value="session">{t('variableManager.scopes.session')}</Option>
              <Option value="node">{t('variableManager.scopes.node')}</Option>
            </Select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              {t('variableManager.defaultValue')}
            </label>
            <Input
              placeholder={t('variableManager.placeholders.defaultValue')}
              value={formData.defaultValue}
              onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              {t('variableManager.description')}
            </label>
            <Input.TextArea
              rows={3}
              placeholder={t('variableManager.placeholders.description')}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </Space>
      </Modal>
    </>
  );
};