import React from 'react';
import { Modal, Table, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { getDefaultShortcuts, Shortcut } from '@/utils/shortcuts';

const { Text, Paragraph } = Typography;

export interface ShortcutHelpProps {
  visible: boolean;
  onClose: () => void;
}

export const ShortcutHelp: React.FC<ShortcutHelpProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const defaultShortcuts = getDefaultShortcuts();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'edit': return 'blue';
      case 'view': return 'green';
      case 'file': return 'orange';
      case 'help': return 'purple';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: t('common.edit'),
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => (
        <Tag color={getCategoryColor(category)}>
          {category}
        </Tag>
      )
    },
    {
      title: t('shortcuts.title'),
      dataIndex: 'key',
      key: 'key',
      width: 150,
      render: (key: string) => (
        <code style={{ 
          backgroundColor: '#f6f8fa', 
          padding: '2px 8px', 
          borderRadius: 4,
          fontSize: 12,
          fontFamily: 'monospace'
        }}>
          {key}
        </code>
      )
    },
    {
      title: t('shortcuts.description'),
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => t(description)
    }
  ];

  return (
    <Modal
      title={t('shortcuts.title')}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <Paragraph type="secondary">
        {t('shortcuts.description')}
      </Paragraph>

      <Table
        dataSource={defaultShortcuts}
        columns={columns}
        rowKey="key"
        pagination={false}
        size="small"
      />

      <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f6f8fa', borderRadius: 8 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          <Text strong>Tip:</Text> {t('common.tip')} - {t('shortcuts.description')}
        </Text>
      </div>
    </Modal>
  );
};
