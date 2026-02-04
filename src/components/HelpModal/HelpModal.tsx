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
  KeyboardOutlined,
  AppstoreOutlined
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
          label: '欢迎使用',
          children: (
            <div>
              <Paragraph>
                欢迎使用业务规则配置系统！本系统是一个可视化的Drools规则编辑器，帮助您通过拖拽节点的方式创建和管理业务规则。
              </Paragraph>
              <Paragraph>
                系统支持将可视化配置编译为标准的Drools DRL规则文件，并可直接下载为JAR包用于生产环境。
              </Paragraph>
            </div>
          )
        },
        {
          key: 'interface',
          label: '界面介绍',
          children: (
            <div>
              <Paragraph>
                <Text strong>左侧节点库：</Text>包含所有可用的节点类型，可拖拽到画布上
              </Paragraph>
              <Paragraph>
                <Text strong>中间画布：</Text>主要工作区域，用于创建和连接节点
              </Paragraph>
              <Paragraph>
                <Text strong>右侧属性面板：</Text>用于编辑选中节点的配置属性
              </Paragraph>
              <Paragraph>
                <Text strong>顶部工具栏：</Text>包含预览、编译、下载、保存等操作按钮
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
          label: '节点类型',
          children: (
            <div>
              <Paragraph>
                系统提供以下6种节点类型：
              </Paragraph>
              <ul style={{ paddingLeft: 20 }}>
                <li><Text strong>开始节点（圆形）</Text>：规则流程的起始点，每个规则必须有且只能有一个</li>
                <li><Text strong>结束节点（圆形）</Text>：规则流程的结束点，可以有多个</li>
                <li><Text strong>条件节点（矩形）</Text>：用于定义规则的条件判断，支持多种操作符</li>
                <li><Text strong>动作节点（矩形）</Text>：用于定义规则执行时的动作，如设置值、调用方法等</li>
                <li><Text strong>决策节点（菱形）</Text>：用于实现复杂的分支逻辑，基于表达式判断</li>
                <li><Text strong>分组节点（矩形）</Text>：用于组织规则，设置优先级和议程组</li>
              </ul>
            </div>
          )
        },
        {
          key: 'add-node',
          label: '添加节点',
          children: (
            <div>
              <Paragraph>
                从左侧节点库中拖拽需要的节点到画布上即可创建节点。节点会自动放置在拖拽释放的位置。
              </Paragraph>
              <Paragraph>
                提示：可以使用搜索框快速查找节点类型，或使用收藏功能保存常用节点。
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
          label: '创建连接',
          children: (
            <div>
              <Paragraph>
                点击节点的连接点（左右两侧的小圆点）并拖动到另一个节点的连接点即可创建连接。
              </Paragraph>
              <Paragraph>
                连接表示规则执行的流程方向，从源节点流向目标节点。
              </Paragraph>
            </div>
          )
        },
        {
          key: 'delete-connection',
          label: '删除连接',
          children: (
            <div>
              <Paragraph>
                点击选中连接线，然后按 Delete 键或使用右键菜单删除连接。
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
          label: '编辑节点属性',
          children: (
            <div>
              <Paragraph>
                点击节点后，右侧属性面板会显示该节点的配置选项。根据节点类型的不同，可配置的属性也有所不同。
              </Paragraph>
              <Paragraph>
                属性面板会实时验证配置的正确性，并在有错误时显示提示信息。
              </Paragraph>
            </div>
          )
        },
        {
          key: 'validation',
          label: '配置验证',
          children: (
            <div>
              <Paragraph>
                系统会自动验证节点配置的正确性：
              </Paragraph>
              <ul style={{ paddingLeft: 20 }}>
                <li>必填字段不能为空</li>
                <li>表达式语法必须正确</li>
                <li>数值范围必须有效</li>
                <li>操作符和值必须匹配</li>
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
          label: '编译规则',
          children: (
            <div>
              <Paragraph>
                点击工具栏的"编译规则"按钮，系统会将可视化配置编译为Drools DRL规则文件。
              </Paragraph>
              <Paragraph>
                编译过程中会检查：
              </Paragraph>
              <ul style={{ paddingLeft: 20 }}>
                <li>节点连接的完整性</li>
                <li>循环依赖检测</li>
                <li>配置字段的有效性</li>
                <li>DRL语法正确性</li>
              </ul>
            </div>
          )
        },
        {
          key: 'preview-drl',
          label: '预览DRL代码',
          children: (
            <div>
              <Paragraph>
                点击"预览"按钮可以查看生成的DRL规则代码。代码预览窗口支持语法高亮和复制功能。
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
          label: '下载ZIP包',
          children: (
            <div>
              <Paragraph>
                点击"下载规则包"按钮，系统会生成包含以下文件的ZIP包：
              </Paragraph>
              <ul style={{ paddingLeft: 20 }}>
                <li><Text code>rules.drl</Text>：编译后的DRL规则文件</li>
                <li><Text code>README.md</Text>：使用说明文档</li>
                <li><Text code>config.json</Text>：可视化配置备份</li>
              </ul>
            </div>
          )
        },
        {
          key: 'download-jar',
          label: '下载JAR包',
          children: (
            <div>
              <Paragraph>
                点击"下载JAR包"按钮，系统会生成可直接部署的JAR包，包含：
              </Paragraph>
              <ul style={{ paddingLeft: 20 }}>
                <li>编译后的DRL规则文件</li>
                <li>Maven POM配置文件</li>
                <li>KieModule配置文件</li>
                <li>MANIFEST.MF文件</li>
              </ul>
              <Paragraph>
                JAR包可以直接部署到Drools运行环境中使用。
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
          label: '模板库',
          children: (
            <div>
              <Paragraph>
                点击工具栏的"模板库"按钮可以访问预定义的规则模板。模板按难度分类：
              </Paragraph>
              <ul style={{ paddingLeft: 20 }}>
                <li><Text strong>基础模板</Text>：简单的单规则示例</li>
                <li><Text strong>高级模板</Text>：包含复杂逻辑的规则示例</li>
                <li><Text strong>工作流模板</Text>：完整的业务流程示例</li>
              </ul>
              <Paragraph>
                可以预览模板详情，点击"应用"按钮将模板加载到画布上。
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
          <KeyboardOutlined style={{ color: '#fa8c16' }} />
          <span>{t('help.sections.keyboardShortcuts')}</span>
        </Space>
      ),
      children: [
        {
          key: 'shortcuts-intro',
          label: '快捷键说明',
          children: (
            <div>
              <Paragraph>
                使用快捷键可以大幅提高工作效率。点击工具栏的"快捷键"按钮查看完整的快捷键列表。
              </Paragraph>
              <Paragraph>
                常用快捷键：
              </Paragraph>
              <ul style={{ paddingLeft: 20 }}>
                <li><Text code>Ctrl + Z</Text>：撤销</li>
                <li><Text code>Ctrl + Y</Text>：重做</li>
                <li><Text code>Ctrl + S</Text>：保存</li>
                <li><Text code>Delete</Text>：删除选中项</li>
                <li><Text code>Ctrl + P</Text>：预览</li>
                <li><Text code>Ctrl + Enter</Text>：编译</li>
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
            需要更多帮助？
          </Title>
          <Paragraph style={{ marginBottom: 0, color: '#595959' }}>
            如果您在使用过程中遇到问题，可以：
          </Paragraph>
          <ul style={{ marginTop: 8, paddingLeft: 20, color: '#595959' }}>
            <li>查看Drools官方文档了解规则语法</li>
            <li>参考模板库中的示例学习最佳实践</li>
            <li>使用预览功能检查生成的代码</li>
            <li>联系技术支持获取帮助</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};