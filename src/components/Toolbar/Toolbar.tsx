import React from 'react';
import { Space, Button, Tooltip, Modal, message, Badge, Tag } from 'antd';
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
  KeyboardOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector/LanguageSelector';
import { TemplateLibrary } from '@/components/TemplateLibrary/TemplateLibrary';
import { ShortcutsModal } from '@/components/ShortcutsModal/ShortcutsModal';
import { HelpModal } from '@/components/HelpModal/HelpModal';

export interface ToolbarProps {
  onPreview: () => void;
  onCompile: () => void;
  onDownload: () => void;
  onDownloadJar: () => void;
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
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onPreview,
  onCompile,
  onDownload,
  onDownloadJar,
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
  onApplyTemplate
}) => {
  const { t } = useTranslation();
  const [templateLibraryVisible, setTemplateLibraryVisible] = React.useState(false);
  const [shortcutsVisible, setShortcutsVisible] = React.useState(false);
  const [helpVisible, setHelpVisible] = React.useState(false);

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
    
    if (minutes < 1) return t('toolbar.lastSaved', { time: '刚刚' });
    if (minutes < 60) return t('toolbar.lastSaved', { time: `${minutes}分钟前` });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t('toolbar.lastSaved', { time: `${hours}小时前` });
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
      </div>

      <Space size="small">
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

        <Tooltip title={t('toolbar.templates')}>
          <Button 
            icon={<AppstoreOutlined />} 
            onClick={() => setTemplateLibraryVisible(true)}
          >
            {t('toolbar.templates')}
          </Button>
        </Tooltip>

        <Tooltip title={t('toolbar.shortcuts')}>
          <Button 
            icon={<KeyboardOutlined />} 
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
    </>
  );
};
