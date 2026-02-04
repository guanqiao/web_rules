import React from 'react';
import { Modal, Table, Tag } from 'antd';
import { 
  KeyOutlined,
  UndoOutlined,
  RedoOutlined,
  SaveOutlined,
  DeleteOutlined,
  CopyOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
  EyeOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export interface ShortcutsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  visible,
  onClose
}) => {
  const { t } = useTranslation();

  const shortcuts = [
    {
      category: '编辑操作',
      items: [
        { key: 'undo', action: t('shortcuts.undo'), shortcut: 'Ctrl + Z', icon: <UndoOutlined /> },
        { key: 'redo', action: t('shortcuts.redo'), shortcut: 'Ctrl + Y', icon: <RedoOutlined /> },
        { key: 'save', action: t('shortcuts.save'), shortcut: 'Ctrl + S', icon: <SaveOutlined /> },
        { key: 'delete', action: t('shortcuts.delete'), shortcut: 'Delete / Backspace', icon: <DeleteOutlined /> },
        { key: 'copy', action: t('shortcuts.copy'), shortcut: 'Ctrl + C', icon: <CopyOutlined /> },
        { key: 'paste', action: t('shortcuts.paste'), shortcut: 'Ctrl + V', icon: <CopyOutlined /> }
      ]
    },
    {
      category: '视图操作',
      items: [
        { key: 'zoomIn', action: t('shortcuts.zoomIn'), shortcut: 'Ctrl + +', icon: <ZoomInOutlined /> },
        { key: 'zoomOut', action: t('shortcuts.zoomOut'), shortcut: 'Ctrl + -', icon: <ZoomOutOutlined /> },
        { key: 'fitView', action: t('shortcuts.fitView'), shortcut: 'Ctrl + 0', icon: <FullscreenOutlined /> }
      ]
    },
    {
      category: '功能操作',
      items: [
        { key: 'preview', action: t('shortcuts.preview'), shortcut: 'Ctrl + P', icon: <EyeOutlined /> },
        { key: 'compile', action: t('shortcuts.compile'), shortcut: 'Ctrl + Enter', icon: <CodeOutlined /> }
      ]
    },
    {
      category: '节点操作',
      items: [
        { key: 'selectAll', action: t('shortcuts.selectAll'), shortcut: 'Ctrl + A', icon: <KeyOutlined /> },
        { key: 'search', action: t('shortcuts.search'), shortcut: 'Ctrl + F', icon: <KeyOutlined /> },
        { key: 'help', action: t('shortcuts.help'), shortcut: 'F1', icon: <KeyOutlined /> }
      ]
    }
  ];

  const columns = [
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 60,
      render: (icon: React.ReactNode) => (
        <span style={{ fontSize: 16 }}>{icon}</span>
      )
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 200
    },
    {
      title: '快捷键',
      dataIndex: 'shortcut',
      key: 'shortcut',
      render: (shortcut: string) => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {shortcut.split(' + ').map((key, index) => (
            <React.Fragment key={index}>
              <Tag 
                color="blue" 
                style={{ 
                  margin: 0,
                  fontFamily: 'monospace',
                  fontSize: 12,
                  padding: '2px 8px',
                  borderRadius: 4,
                  border: '1px solid #d9d9d9'
                }}
              >
                {key.trim()}
              </Tag>
              {index < shortcut.split(' + ').length - 1 && <span style={{ color: '#8c8c8c' }}>+</span>}
            </React.Fragment>
          ))}
        </div>
      )
    }
  ];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <KeyOutlined style={{ color: '#1890ff', fontSize: 20 }} />
          <span>{t('shortcuts.title')}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <div style={{ marginBottom: 16, color: '#595959', fontSize: 13 }}>
        {t('shortcuts.description')}
      </div>

      {shortcuts.map((category, index) => (
        <div key={category.category} style={{ marginBottom: index < shortcuts.length - 1 ? 24 : 0 }}>
          <h4 style={{ 
            marginBottom: 12, 
            color: '#262626', 
            fontSize: 14, 
            fontWeight: 600,
            borderBottom: '2px solid #1890ff',
            paddingBottom: 8,
            display: 'inline-block'
          }}>
            {category.category}
          </h4>
          <Table
            columns={columns}
            dataSource={category.items}
            pagination={false}
            size="small"
            rowKey="key"
            showHeader={false}
            style={{ marginBottom: 0 }}
          />
        </div>
      ))}

      <div style={{ 
        marginTop: 24, 
        padding: 12, 
        backgroundColor: '#f0f9ff', 
        borderRadius: 8,
        border: '1px solid #bae7ff'
      }}>
        <div style={{ fontSize: 12, color: '#595959', lineHeight: 1.6 }}>
          <strong>提示：</strong>
          <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
            <li>快捷键组合中的 "+" 表示需要同时按下的键</li>
            <li>部分快捷键可能因浏览器设置而有所不同</li>
            <li>在输入框中输入时，快捷键可能不会触发</li>
            <li>可以通过工具栏按钮执行相同的操作</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};