import React from 'react';
import { Modal, Collapse, Typography, Space, Divider } from 'antd';
import { 
  QuestionCircleOutlined,
  PlayCircleOutlined,
  LinkOutlined,
  BranchesOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  KeyOutlined,
  AppstoreOutlined,
  KeyboardOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Text, Paragraph, Title } = Typography;

export interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  visible,
  onClose
}) => {
  const { t } = useTranslation();

  const helpItems = [
    {
      key: 'getting-started',
      label: (
        <Space>
          <PlayCircleOutlined style={{ color: '#52c41a' }} />
          <span>{t('help.sections.gettingStarted')}</span>
        </Space>
      ),
      children: [
        {
          key: 'welcome',
          label: t('help.welcome.label'),
          children: (
            <div>
              <Paragraph>
                {t('help.welcome.intro1')}
              </Paragraph>
              <Paragraph>
                {t('help.welcome.intro2')}
              </Paragraph>
            </div>
          )
        },
        {
          key: 'interface',
          label: t('help.interface.label'),
          children: (
            <div>
              <Paragraph>
                <Text strong>{t('help.interface.leftPalette')}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>{t('help.interface.centerCanvas')}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>{t('help.interface.rightPanel')}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>{t('help.interface.topToolbar')}</Text>
              </Paragraph>
            </div>
          )
        }
      ]
    },
    {
      key: 'creating-nodes',
      label: (
        <Space>
          <AppstoreOutlined style={{ color: '#1890ff' }} />
          <span>{t('help.sections.creatingNodes')}</span>
        </Space>
      ),
      children: [
        {
          key: 'node-types',
          label: t('help.nodeTypes.label'),
          children: (
            <div>
              <Paragraph>
                {t('help.nodeTypes.description')}
              </Paragraph>
              <ul style={{ paddingLeft: 20 }}>
                <li><Text strong>{t('help.nodeTypes.start')}</Text></li>
                <li><Text strong>{t('help.nodeTypes.end')}</Text></li>
                <li><Text strong>{t('help.nodeTypes.condition')}</Text></li>
                <li><Text strong>{t('help.nodeTypes.action')}</Text></li>
                <li><Text strong>{t('help.nodeTypes.decision')}</Text></li>
                <li><Text strong>{t('help.nodeTypes.group')}</Text></li>
              </ul>
            </div>
          )
        },
        {
          key: 'add-node',
          label: t('help.addNode.label'),
          children: (
            <div>
              <Paragraph>
                {t('help.addNode.description1')}
              </Paragraph>
              <Paragraph>
                {t('help.addNode.tip')}
              </Paragraph>
            </div>
          )
        }
      ]
    },
    {
      key: 'connecting-nodes',
      label: (
        <Space>
          <LinkOutlined style={{ color: '#faad14' }} />
          <span>{t('help.sections.connectingNodes')}</span>
        </Space>
      ),
      children: [
        {
          key: 'create-connection',
          label: t('help.connectNodes.label'),
          children: (
            <div>
              <Paragraph>
                {t('help.connectNodes.description1')}
              </Paragraph>
              <Paragraph>
                {t('help.connectNodes.description2')}
              </Paragraph>
            </div>
          )
        },
        {
          key: 'delete-connection',
          label: t('help.deleteConnection.label'),
          children: (
            <div>
              <Paragraph>
                {t('help.deleteConnection.description')}
              </Paragraph>
            </div>
          )
        }
      ]
    },
    {
      key: 'editing-properties',
      label: (
        <Space>
          <SettingOutlined style={{ color: '#722ed1' }} />
          <span>{t('help.sections.editingProperties')}</span>
        </Space>
      ),
      children: [
        {
          key: 'edit-node',
          label: t('help.editProperties.label'),
          children: (
            <div>
              <Paragraph>
                {t('help.editProperties.description1')}
              </Paragraph>
              <Paragraph>
                {t('help.editProperties.description2')}
              </Paragraph>
            </div>
          )
        },
        {
          key: 'validation',
          label: t('help.configValidation.label'),
          children: (
            <div>
              <Paragraph>
                {t('help.configValidation.description1')}
              </Paragraph>
              <ul style={{ paddingLeft: 20 }}>
                <li>{t('help.configValidation.check1')}</li>
                <li>{t('help.configValidation.check2')}</li>
                <li>{t('help.configValidation.check3')}</li>
              </ul>
            </div>
          )
        }
      ]
    },
    {
      key: 'compiling-rules',
      label: (
        <Space>
          <ThunderboltOutlined style={{ color: '#ff4d4f' }} />
          <span>{t('help.sections.compilingRules')}</span>
        </Space>
      ),
      children: [
        {
          key: 'compile-process',
          label: t('help.compileRules.label'),
          children: (
            <div>
              <Paragraph>
                {t('help.compileRules.description1')}
              </Paragraph>
              <Paragraph>
                {t('help.compileRules.description2')}
              </Paragraph>
              <ul style={{ paddingLeft: 20 }}>
                <li>{t('help.compileRules.check1')}</li>
                <li>{t('help.compileRules.check2')}</li>
              </ul>
            </div>
          )
        },
        {
          key: 'preview-drl',
          label: t('help.previewCode.label'),
          children: (
            <div>
              <Paragraph>
                {t('help.previewCode.description')}
              </Paragraph>
            </div>
          )
        }
      ]
    },
    {
      key: 'downloading-rules',
      label: (
        <Space>
          <FileTextOutlined style={{ color: '#13c2c2' }} />
          <span>{t('help.sections.downloadingRules')}</span>
        </Space>
      ),
      children: [
        {
          key: 'download-zip',
          label: t('help.downloadZip.label'),
          children: (
            <div>
              <Paragraph>
                {t('help.downloadZip.description1')}
              </Paragraph>
              <ul style={{ paddingLeft: 20 }}>
                <li><Text code>rules.drl</Text>：{t('help.downloadZip.file1')}</li>
                <li><Text code>README.md</Text>：{t('help.downloadZip.file2')}</li>
                <li><Text code>config.json</Text>：{t('help.downloadZip.file3')}</li>
              </ul>
            </div>
          )
        },
        {
          key: 'download-jar',
          label: t('help.downloadJar.label'),
          children: (
            <div>
              <Paragraph>
                {t('help.downloadJar.description1')}
              </Paragraph>
              <ul style={{ paddingLeft: 20 }}>
                <li>{t('help.downloadJar.file1')}</li>
                <li>{t('help.downloadJar.file2')}</li>
                <li>{t('help.downloadJar.file3')}</li>
                <li>MANIFEST.MF: MANIFEST.MF {t('help.downloadJar.file1')}</li>
              </ul>
              <Paragraph>
                {t('help.downloadJar.deployTip')}
              </Paragraph>
            </div>
          )
        }
      ]
    },
    {
      key: 'using-templates',
      label: (
        <Space>
          <AppstoreOutlined style={{ color: '#eb2f96' }} />
          <span>{t('help.sections.usingTemplates')}</span>
        </Space>
      ),
      children: [
        {
          key: 'template-library',
          label: t('help.useTemplates.label'),
          children: (
            <div>
              <Paragraph>
                {t('help.useTemplates.description1')}
              </Paragraph>
              <ul style={{ paddingLeft: 20 }}>
                <li><Text strong>{t('templates.categories.basic')}</Text>：{t('help.useTemplates.template1')}</li>
                <li><Text strong>{t('templates.categories.advanced')}</Text>：{t('help.useTemplates.template2')}</li>
              </ul>
              <Paragraph>
                {t('help.useTemplates.description2')}
              </Paragraph>
            </div>
          )
        }
      ]
    },
    {
      key: 'keyboard-shortcuts',
      label: (
        <Space>
          <KeyOutlined style={{ color: '#fa8c16' }} />
          <span>{t('help.sections.keyboardShortcuts')}</span>
        </Space>
      ),
      children: [
        {
          key: 'shortcuts-intro',
          label: t('help.shortcuts.label'),
          children: (
            <div>
              <Paragraph>
                {t('help.shortcuts.description1')}
              </Paragraph>
              <Paragraph>
                {t('help.shortcuts.description2')}
              </Paragraph>
              <ul style={{ paddingLeft: 20 }}>
                <li><Text code>Ctrl + Z</Text>：{t('toolbar.undo')}</li>
                <li><Text code>Ctrl + Y</Text>：{t('toolbar.redo')}</li>
                <li><Text code>Ctrl + S</Text>：{t('toolbar.save')}</li>
                <li><Text code>Delete</Text>：{t('editor.deleteNode')}</li>
                <li><Text code>Ctrl + P</Text>：{t('toolbar.preview')}</li>
                <li><Text code>Ctrl + Enter</Text>：{t('toolbar.compile')}</li>
              </ul>
            </div>
          )
        }
      ]
    }
  ];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <QuestionCircleOutlined style={{ color: '#1890ff', fontSize: 20 }} />
          <span>{t('help.title')}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 20 }}
    >
      <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Collapse
          items={helpItems}
          defaultActiveKey={['getting-started']}
          bordered={false}
          style={{ backgroundColor: 'transparent' }}
        />
        
        <Divider />
        
        <div style={{ 
          padding: 16, 
          backgroundColor: '#f0f9ff', 
          borderRadius: 8,
          border: '1px solid #bae7ff'
        }}>
          <Title level={5} style={{ marginBottom: 12, color: '#1890ff' }}>
            {t('help.resources.label')}
          </Title>
          <Paragraph style={{ marginBottom: 0, color: '#595959' }}>
            {t('help.resources.description1')}
          </Paragraph>
          <ul style={{ marginTop: 8, paddingLeft: 20, color: '#595959' }}>
            <li>{t('help.resources.link1')}</li>
            <li>{t('help.resources.link2')}</li>
            <li>{t('help.resources.link3')}</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};