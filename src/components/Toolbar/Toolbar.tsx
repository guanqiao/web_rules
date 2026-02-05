import React from 'react';
import { Space, Button, Tooltip, Modal, message, Tag, Avatar, Divider } from 'antd';
import {
  CodeOutlined,
  DownloadOutlined,
  SaveOutlined,
  ClearOutlined,
  EyeOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
  FileZipOutlined,
  UndoOutlined,
  RedoOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  KeyOutlined,
  QuestionCircleOutlined,
  ApiOutlined,
  PlayCircleOutlined,
  DatabaseOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector/LanguageSelector';
import { TemplateLibrary } from '@/components/TemplateLibrary/TemplateLibrary';
import { ShortcutsModal } from '@/components/ShortcutsModal/ShortcutsModal';
import { HelpModal } from '@/components/HelpModal/HelpModal';
import { DataModelManager } from '@/components/DataModelManager/DataModelManager';
import { useEditorStore } from '@/stores/useEditorStore';
import { DataModel } from '@/types/rule.types';

export interface ToolbarProps {
  onPreview: () => void;
  onCompile: () => void;
  onDownload: () => void;
  onDownloadJar: () => void;
  onDownloadCompiledJar?: () => void;
  isCompilerAvailable?: boolean;
  onSave: () => void;
  onClear: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  canCompile: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  saveStatus?: 'saved' | 'unsaved' | 'saving';
  lastSavedTime?: Date | null;
  onApplyTemplate?: (template: any) => void;
  onOpenVariables?: () => void;
  onOpenTest?: () => void;
  onOpenDataModels?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onPreview,
  onCompile,
  onDownload,
  onDownloadJar,
  onDownloadCompiledJar,
  isCompilerAvailable = false,
  onSave,
  onClear,
  onZoomIn,
  onZoomOut,
  onFitView,
  canCompile,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  saveStatus = 'unsaved',
  lastSavedTime,
  onApplyTemplate,
  onOpenVariables,
  onOpenTest,
  onOpenDataModels
}) => {
  const { t } = useTranslation();
  const [templateLibraryVisible, setTemplateLibraryVisible] = React.useState(false);
  const [shortcutsVisible, setShortcutsVisible] = React.useState(false);
  const [helpVisible, setHelpVisible] = React.useState(false);
  const [dataModelsVisible, setDataModelsVisible] = React.useState(false);
  
  // 从全局状态获取数据模型
  const dataModels = useEditorStore(state => state.dataModels);
  const setDataModels = useEditorStore(state => state.setDataModels);

  const handleClear = () => {
    Modal.confirm({
      title: t('toolbar.clearConfirm'),
      content: t('toolbar.clearConfirmContent'),
      okText: t('toolbar.clearConfirmOk'),
      cancelText: t('toolbar.clearConfirmCancel'),
      onOk: () => {
        onClear();
        message.success(t('toolbar.cleared'));
      }
    });
  };

  const getSaveStatusTag = () => {
    switch (saveStatus) {
      case 'saved':
        return <Tag color="success">{t('toolbar.saved')}</Tag>;
      case 'saving':
        return <Tag color="processing">{t('toolbar.saving')}</Tag>;
      default:
        return <Tag color="warning">{t('toolbar.unsaved')}</Tag>;
    }
  };

  const formatLastSavedTime = () => {
    if (!lastSavedTime) return null;
    const now = new Date();
    const diff = now.getTime() - lastSavedTime.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return t('toolbar.lastSaved', { time: t('toolbar.time.justNow') });
    if (minutes < 60) return t('toolbar.lastSaved', { time: t('toolbar.time.minutesAgo', { count: minutes }) });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t('toolbar.lastSaved', { time: t('toolbar.time.hoursAgo', { count: hours }) });
    return t('toolbar.lastSaved', { time: lastSavedTime.toLocaleDateString() });
  };

  return (
    <>
      <div style={{
        padding: '12px 24px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            {t('toolbar.title')}
          </h2>
          <Space size="small" wrap>
            {getSaveStatusTag()}
            {formatLastSavedTime() && (
              <span style={{ fontSize: 12, color: '#999' }}>
                <ClockCircleOutlined /> {formatLastSavedTime()}
              </span>
            )}
          </Space>
          <Divider type="vertical" style={{ height: 24 }} />
          <Tooltip title={t('toolbar.authorTooltip')}>
            <Space size="small" style={{ cursor: 'default' }}>
              <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <span style={{ fontSize: 13, color: '#666' }}>
                {t('toolbar.author')}: <strong style={{ color: '#1890ff' }}>JasonD</strong>
              </span>
            </Space>
          </Tooltip>
        </div>

        <Space size="small" wrap>
          <Tooltip title={t('toolbar.undo')}>
            <Button 
              icon={<UndoOutlined />} 
              onClick={onUndo}
              disabled={!canUndo}
            />
          </Tooltip>

          <Tooltip title={t('toolbar.redo')}>
            <Button 
              icon={<RedoOutlined />} 
              onClick={onRedo}
              disabled={!canRedo}
            />
          </Tooltip>

          <Tooltip title={t('toolbar.templateLibrary')}>
            <Button
              icon={<AppstoreOutlined />}
              onClick={() => setTemplateLibraryVisible(true)}
            >
              {t('toolbar.templateLibrary')}
            </Button>
          </Tooltip>

          <Tooltip title={t('toolbar.variablesTooltip')}>
            <Button 
              icon={<ApiOutlined />} 
              onClick={onOpenVariables}
            >
              {t('toolbar.variables')}
            </Button>
          </Tooltip>

          <Tooltip title={t('toolbar.dataModelsTooltip')}>
            <Button 
              icon={<DatabaseOutlined />} 
              onClick={() => setDataModelsVisible(true)}
            >
              {t('toolbar.dataModels')}
            </Button>
          </Tooltip>

          <Tooltip title={t('toolbar.testTooltip')}>
            <Button 
              icon={<PlayCircleOutlined />} 
              onClick={onOpenTest}
            >
              {t('toolbar.test')}
            </Button>
          </Tooltip>

          <Tooltip title={t('toolbar.shortcuts')}>
            <Button 
              icon={<KeyOutlined />} 
              onClick={() => setShortcutsVisible(true)}
            />
          </Tooltip>

          <Tooltip title={t('toolbar.preview')}>
            <Button 
              icon={<EyeOutlined />} 
              onClick={onPreview}
            >
              {t('toolbar.preview')}
            </Button>
          </Tooltip>

          <Tooltip title={t('toolbar.compile')}>
            <Button 
              type="primary"
              icon={<CodeOutlined />} 
              onClick={onCompile}
              disabled={!canCompile}
            >
              {t('toolbar.compile')}
            </Button>
          </Tooltip>

          <Tooltip title={t('toolbar.download')}>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={onDownload}
              disabled={!canCompile}
            >
              {t('toolbar.download')}
            </Button>
          </Tooltip>

          <Tooltip title={t('toolbar.downloadJar')}>
            <Button 
              icon={<FileZipOutlined />} 
              onClick={onDownloadJar}
              disabled={!canCompile}
            >
              {t('toolbar.downloadJar')}
            </Button>
          </Tooltip>

          {isCompilerAvailable && (
            <Tooltip title={t('toolbar.downloadCompiledJar')}>
              <Button 
                type="primary"
                ghost
                icon={<FileZipOutlined />} 
                onClick={onDownloadCompiledJar}
                disabled={!canCompile}
              >
                {t('toolbar.downloadCompiledJar')}
              </Button>
            </Tooltip>
          )}

          <Tooltip title={t('toolbar.save')}>
            <Button 
              icon={<SaveOutlined />} 
              onClick={onSave}
            >
              {t('toolbar.save')}
            </Button>
          </Tooltip>

          <Tooltip title={t('toolbar.clear')}>
            <Button 
              danger
              icon={<ClearOutlined />} 
              onClick={handleClear}
            >
              {t('toolbar.clear')}
            </Button>
          </Tooltip>

          <Tooltip title={t('toolbar.help')}>
            <Button 
              icon={<QuestionCircleOutlined />} 
              onClick={() => setHelpVisible(true)}
            />
          </Tooltip>
        </Space>

        <Space size="small">
          <LanguageSelector />

          <Tooltip title={t('toolbar.zoomIn')}>
            <Button 
              icon={<ZoomInOutlined />} 
              onClick={onZoomIn}
            />
          </Tooltip>
          <Tooltip title={t('toolbar.zoomOut')}>
            <Button 
              icon={<ZoomOutOutlined />} 
              onClick={onZoomOut}
            />
          </Tooltip>
          <Tooltip title={t('toolbar.fitView')}>
            <Button 
              icon={<FullscreenOutlined />} 
              onClick={onFitView}
            />
          </Tooltip>
        </Space>
      </div>

      <TemplateLibrary
        visible={templateLibraryVisible}
        onClose={() => setTemplateLibraryVisible(false)}
        onApplyTemplate={(template) => {
          if (onApplyTemplate) {
            onApplyTemplate(template);
          }
        }}
      />

      <ShortcutsModal
        visible={shortcutsVisible}
        onClose={() => setShortcutsVisible(false)}
      />

      <HelpModal
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
      />

      <DataModelManager
        visible={dataModelsVisible}
        onClose={() => setDataModelsVisible(false)}
        dataModels={dataModels}
        onSave={(models: DataModel[]) => {
          setDataModels(models);
        }}
      />
    </>
  );
};