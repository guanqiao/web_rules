import React from 'react';
import { Modal, Typography, Card, Collapse } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

export interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();

  const sections = [
    {
      key: 'gettingStarted',
      title: t('help.sections.gettingStarted'),
      content: t('help.gettingStarted.content')
    },
    {
      key: 'creatingNodes',
      title: t('help.sections.creatingNodes'),
      content: t('help.creatingNodes.content')
    },
    {
      key: 'connectingNodes',
      title: t('help.sections.connectingNodes'),
      content: t('help.connectingNodes.content')
    },
    {
      key: 'editingProperties',
      title: t('help.sections.editingProperties'),
      content: t('help.editingProperties.content')
    },
    {
      key: 'compilingRules',
      title: t('help.sections.compilingRules'),
      content: t('help.compilingRules.content')
    },
    {
      key: 'downloadingRules',
      title: t('help.sections.downloadingRules'),
      content: t('help.downloadingRules.content')
    },
    {
      key: 'usingTemplates',
      title: t('help.sections.usingTemplates'),
      content: t('help.usingTemplates.content')
    },
    {
      key: 'keyboardShortcuts',
      title: t('help.sections.keyboardShortcuts'),
      content: t('help.keyboardShortcuts.content')
    }
  ];

  return (
    <Modal
      title={t('help.title')}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <Collapse defaultActiveKey={['gettingStarted']} ghost>
          {sections.map(section => (
            <Panel header={<Text strong>{section.title}</Text>} key={section.key}>
              <Card size="small" style={{ marginBottom: 12 }}>
                <Title level={5} style={{ marginTop: 0, marginBottom: 8 }}>
                  {section.title}
                </Title>
                <Paragraph style={{ marginBottom: 0 }}>
                  {section.content}
                </Paragraph>
              </Card>
            </Panel>
          ))}
        </Collapse>

        <div style={{ marginTop: 24, padding: 16, backgroundColor: '#f6f8fa', borderRadius: 8 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <Text strong>{t('common.tip')}：</Text>
            {t('common.info')} - 更多帮助请查看项目文档或联系技术支持。
          </Text>
        </div>
      </div>
    </Modal>
  );
};
