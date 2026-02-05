import React, { useState } from 'react';
import { Modal, Table, Button, Space, Input, Select, Tag, message, Popconfirm, Tabs, Form, Checkbox, InputNumber, message as messageApi } from 'antd';
import { useMessage } from 'antd/es/message/useMessage';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  AppstoreOutlined,
  CodeOutlined,
  NumberOutlined,
  AlignLeftOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  AppstoreAddOutlined,
  UnorderedListOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { DataModel, DataModelField } from '@/types/rule.types';

const { Option } = Select;
const { TextArea } = Input;

interface DataModelManagerProps {
  visible: boolean;
  onClose: () => void;
  dataModels?: DataModel[];
  onSave?: (dataModels: DataModel[]) => void;
}

export const DataModelManager: React.FC<DataModelManagerProps> = ({
  visible,
  onClose,
  dataModels: initialDataModels = [],
  onSave
}) => {
  const { t } = useTranslation();
  const [dataModels, setDataModels] = useState<DataModel[]>(initialDataModels);
  const [selectedModel, setSelectedModel] = useState<DataModel | null>(null);
  const [editingModel, setEditingModel] = useState<DataModel | null>(null);
  const [editingField, setEditingField] = useState<DataModelField | null>(null);
  const [modelModalVisible, setModelModalVisible] = useState(false);
  const [fieldModalVisible, setFieldModalVisible] = useState(false);
  const [modelForm] = Form.useForm();
  const [fieldForm] = Form.useForm();
  const [message, contextHolder] = messageApi.useMessage();

  const handleAddModel = () => {
    const now = new Date().toISOString();
    const newModel: DataModel = {
      id: `model-${Date.now()}`,
      name: '',
      packageName: 'com.model',
      fields: [],
      version: '1.0.0',
      createdAt: now,
      updatedAt: now
    };
    setEditingModel(null);
    modelForm.setFieldsValue(newModel);
    setModelModalVisible(true);
  };

  const handleEditModel = (model: DataModel) => {
    setEditingModel(model);
    modelForm.setFieldsValue(model);
    setModelModalVisible(true);
  };

  const handleDeleteModel = (id: string) => {
    setDataModels(dataModels.filter(m => m.id !== id));
    if (selectedModel?.id === id) {
      setSelectedModel(null);
    }
    message.success(t('dataModelManager.modelDeleted'));
  };

  const handleCopyModel = (model: DataModel) => {
    const now = new Date().toISOString();
    const newModel: DataModel = {
      ...model,
      id: `model-${Date.now()}`,
      name: `${model.name}_copy`,
      createdAt: now,
      updatedAt: now
    };
    setDataModels([...dataModels, newModel]);
    message.success(t('dataModelManager.modelCopied'));
  };

  const handleSaveModel = () => {
    modelForm.validateFields().then(values => {
      const now = new Date().toISOString();
      if (editingModel) {
        const updatedModel: DataModel = {
          ...values,
          id: editingModel.id,
          updatedAt: now
        };
        setDataModels(dataModels.map(m => 
          m.id === editingModel.id ? updatedModel : m
        ));
        if (selectedModel?.id === editingModel.id) {
          setSelectedModel(updatedModel);
        }
        message.success(t('dataModelManager.modelUpdated'));
      } else {
        const newModel: DataModel = {
          ...values,
          id: `model-${Date.now()}`,
          createdAt: now,
          updatedAt: now
        };
        setDataModels([...dataModels, newModel]);
        message.success(t('dataModelManager.modelAdded'));
      }
      setModelModalVisible(false);
      modelForm.resetFields();
    }).catch(error => {
      message.error(t('dataModelManager.fillRequiredFields'));
    });
  };

  const handleAddField = () => {
    if (!selectedModel) {
      message.error(t('dataModelManager.selectModelFirst'));
      return;
    }
    setEditingField(null);
    // 重置表单并设置默认值
    fieldForm.resetFields();
    fieldForm.setFieldsValue({
      name: '',
      type: undefined,
      required: false,
      defaultValue: '',
      description: ''
    });
    setFieldModalVisible(true);
  };

  const handleEditField = (field: DataModelField) => {
    setEditingField(field);
    // 只设置表单中存在的字段，避免额外字段导致验证问题
    fieldForm.setFieldsValue({
      name: field.name,
      type: field.type,
      required: field.required,
      defaultValue: field.defaultValue,
      description: field.description
    });
    setFieldModalVisible(true);
  };

  const handleDeleteField = (fieldId: string) => {
    if (!selectedModel) return;
    const updatedModel: DataModel = {
      ...selectedModel,
      fields: selectedModel.fields.filter(f => f.id !== fieldId),
      updatedAt: new Date().toISOString()
    };
    setSelectedModel(updatedModel);
    setDataModels(dataModels.map(m => 
      m.id === selectedModel.id ? updatedModel : m
    ));
    message.success(t('dataModelManager.fieldDeleted'));
  };

  const handleSaveField = async () => {
    try {
      const values = await fieldForm.validateFields();
      
      if (!selectedModel) {
        message.error('请先选择数据模型');
        return;
      }
      
      const now = new Date().toISOString();
      // 确保 required 字段有默认值 false
      const fieldValues = {
        ...values,
        required: values.required !== undefined ? values.required : false
      };
      
      // 确保 fields 是数组
      const currentFields = selectedModel.fields || [];
      
      let updatedFields: DataModelField[];
      if (editingField) {
        updatedFields = currentFields.map(f => 
          f.id === editingField.id ? { ...fieldValues, id: f.id } as DataModelField : f
        );
      } else {
        const newField: DataModelField = {
          ...fieldValues,
          id: `field-${Date.now()}`
        } as DataModelField;
        updatedFields = [...currentFields, newField];
      }
      
      const updatedModel: DataModel = {
        ...selectedModel,
        fields: updatedFields,
        updatedAt: now
      };
      
      setSelectedModel(updatedModel);
      setDataModels(dataModels.map(m => 
        m.id === selectedModel.id ? updatedModel : m
      ));
      setFieldModalVisible(false);
      fieldForm.resetFields();
      message.success(editingField ? t('dataModelManager.fieldUpdated') : t('dataModelManager.fieldAdded'));
    } catch (error: any) {
      // 表单验证失败
      if (error.errorFields && error.errorFields.length > 0) {
        message.error(t('dataModelManager.fillRequiredFields'));
      } else {
        console.error('保存字段失败:', error);
        message.error('保存失败，请检查控制台错误信息');
      }
    }
  };

  const handleSaveAll = () => {
    if (onSave) {
      onSave(dataModels);
      message.success(t('dataModelManager.modelConfigSaved'));
      onClose();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'string': return <AlignLeftOutlined />;
      case 'number': return <NumberOutlined />;
      case 'boolean': return <CheckCircleOutlined />;
      case 'date': return <CalendarOutlined />;
      case 'object': return <AppstoreAddOutlined />;
      case 'array': return <UnorderedListOutlined />;
      case 'enum': return <MenuOutlined />;
      default: return <AlignLeftOutlined />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string': return 'blue';
      case 'number': return 'green';
      case 'boolean': return 'orange';
      case 'date': return 'purple';
      case 'object': return 'cyan';
      case 'array': return 'geekblue';
      case 'enum': return 'magenta';
      default: return 'default';
    }
  };

  const modelColumns = [
    {
      title: t('dataModelManager.modelName'),
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
      title: t('dataModelManager.packageName'),
      dataIndex: 'packageName',
      key: 'packageName',
      width: 200,
      ellipsis: true
    },
    {
      title: t('dataModelManager.fieldCount'),
      dataIndex: 'fields',
      key: 'fieldCount',
      width: 100,
      render: (fields: DataModelField[]) => fields?.length || 0
    },
    {
      title: t('dataModelManager.version'),
      dataIndex: 'version',
      key: 'version',
      width: 80
    },
    {
      title: t('dataModelManager.actions'),
      key: 'actions',
      width: 180,
      render: (_: any, record: DataModel) => (
        <Space size="small">
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => handleCopyModel(record)}
            size="small"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditModel(record)}
            size="small"
          />
          <Popconfirm
            title={t('dataModelManager.confirmDelete')}
            description={t('dataModelManager.confirmDeleteModel')}
            onConfirm={() => handleDeleteModel(record.id)}
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

  const fieldColumns = [
    {
      title: t('dataModelManager.fieldName'),
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
      title: t('dataModelManager.fieldType'),
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => (
        <Tag icon={getTypeIcon(type)} color={getTypeColor(type)}>{type}</Tag>
      )
    },
    {
      title: t('dataModelManager.required'),
      dataIndex: 'required',
      key: 'required',
      width: 80,
      render: (required: boolean) => (
        <Checkbox checked={required} disabled />
      )
    },
    {
      title: t('dataModelManager.defaultValue'),
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      width: 120,
      ellipsis: true,
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
      title: t('dataModelManager.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: t('dataModelManager.actions'),
      key: 'actions',
      width: 120,
      render: (_: any, record: DataModelField) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditField(record)}
            size="small"
          />
          <Popconfirm
            title={t('dataModelManager.confirmDelete')}
            description={t('dataModelManager.confirmDeleteField')}
            onConfirm={() => handleDeleteField(record.id)}
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
      {contextHolder}
      <Modal
        title={
          <Space>
            <AppstoreOutlined style={{ color: '#1890ff' }} />
            <span>{t('dataModelManager.title')}</span>
          </Space>
        }
        open={visible}
        onCancel={onClose}
        width={1000}
        footer={[
          <Button key="cancel" onClick={onClose}>
            {t('dataModelManager.close')}
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveAll}>
            {t('dataModelManager.saveConfig')}
          </Button>
        ]}
      >
        <Tabs 
          defaultActiveKey="models"
          items={[
            {
              key: 'models',
              label: t('dataModelManager.modelsTab'),
              children: (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddModel}
                    >
                      {t('dataModelManager.addModel')}
                    </Button>
                  </div>

                  <Table
                    columns={modelColumns}
                    dataSource={dataModels}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    size="small"
                    onRow={(record) => ({
                      onClick: () => setSelectedModel(record)
                    })}
                    rowSelection={{
                      type: 'radio',
                      selectedRowKeys: selectedModel ? [selectedModel.id] : [],
                      onChange: (selectedRowKeys) => {
                        if (selectedRowKeys.length > 0) {
                          const model = dataModels.find(m => m.id === selectedRowKeys[0]);
                          if (model) setSelectedModel(model);
                        }
                      }
                    }}
                  />
                </>
              )
            },
            {
              key: 'fields',
              label: t('dataModelManager.fieldsTab'),
              children: (
                <>
                  {selectedModel ? (
                    <>
                      <div style={{ marginBottom: 16 }}>
                        <Space>
                          <span style={{ fontWeight: 500 }}>
                            {t('dataModelManager.selectedModel')}: {selectedModel.name}
                          </span>
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddField}
                          >
                            {t('dataModelManager.addField')}
                          </Button>
                        </Space>
                      </div>

                      <Table
                        columns={fieldColumns}
                        dataSource={selectedModel.fields}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        size="small"
                      />
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 40, color: '#8c8c8c' }}>
                      {t('dataModelManager.noModelSelected')}
                    </div>
                  )}
                </>
              )
            }
          ]}
        />

        {dataModels.length > 0 && (
          <div style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: '#f0f9ff',
            borderRadius: 8,
            border: '1px solid #bae7ff'
          }}>
            <div style={{ fontSize: 12, color: '#595959' }}>
              <strong style={{ color: '#1890ff' }}>{t('dataModelManager.usageInstructions')}：</strong>
              <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                <li>{t('dataModelManager.usageInstructionsContent.modelDefinition')}</li>
                <li>{t('dataModelManager.usageInstructionsContent.fieldTypes')}</li>
                <li>{t('dataModelManager.usageInstructionsContent.packageName')}</li>
                <li>{t('dataModelManager.usageInstructionsContent.javaGeneration')}</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={editingModel ? t('dataModelManager.editModelModal') : t('dataModelManager.addModelModal')}
        open={modelModalVisible}
        onCancel={() => setModelModalVisible(false)}
        onOk={handleSaveModel}
        width={600}
      >
        <Form form={modelForm} layout="vertical">
          <Form.Item
            name="name"
            label={t('dataModelManager.modelName')}
            rules={[{ required: true, message: t('dataModelManager.enterModelName') }]}
          >
            <Input placeholder={t('dataModelManager.placeholders.modelName')} />
          </Form.Item>

          <Form.Item
            name="packageName"
            label={t('dataModelManager.packageName')}
            rules={[{ required: true, message: t('dataModelManager.enterPackageName') }]}
          >
            <Input placeholder={t('dataModelManager.placeholders.packageName')} />
          </Form.Item>

          <Form.Item
            name="version"
            label={t('dataModelManager.version')}
            rules={[{ required: true, message: t('dataModelManager.enterVersion') }]}
          >
            <Input placeholder={t('dataModelManager.placeholders.version')} />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('dataModelManager.description')}
          >
            <TextArea rows={3} placeholder={t('dataModelManager.placeholders.description')} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingField ? t('dataModelManager.editFieldModal') : t('dataModelManager.addFieldModal')}
        open={fieldModalVisible}
        onCancel={() => {
          setFieldModalVisible(false);
          fieldForm.resetFields();
        }}
        onOk={handleSaveField}
        width={600}
        destroyOnClose
      >
        <Form form={fieldForm} layout="vertical">
          <Form.Item
            name="name"
            label={t('dataModelManager.fieldName')}
            rules={[{ required: true, message: t('dataModelManager.enterFieldName') }]}
          >
            <Input placeholder={t('dataModelManager.placeholders.fieldName')} />
          </Form.Item>

          <Form.Item
            name="type"
            label={t('dataModelManager.fieldType')}
            rules={[{ required: true, message: t('dataModelManager.selectFieldType') }]}
          >
            <Select placeholder={t('dataModelManager.placeholders.selectFieldType')}>
              <Option value="string">{t('dataModelManager.types.string')}</Option>
              <Option value="number">{t('dataModelManager.types.number')}</Option>
              <Option value="boolean">{t('dataModelManager.types.boolean')}</Option>
              <Option value="date">{t('dataModelManager.types.date')}</Option>
              <Option value="enum">{t('dataModelManager.types.enum')}</Option>
              <Option value="object">{t('dataModelManager.types.object')}</Option>
              <Option value="array">{t('dataModelManager.types.array')}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="required"
            label={t('dataModelManager.required')}
            valuePropName="checked"
            initialValue={false}
          >
            <Checkbox />
          </Form.Item>

          <Form.Item
            name="defaultValue"
            label={t('dataModelManager.defaultValue')}
          >
            <Input placeholder={t('dataModelManager.placeholders.defaultValue')} />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('dataModelManager.description')}
          >
            <TextArea rows={3} placeholder={t('dataModelManager.placeholders.description')} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
