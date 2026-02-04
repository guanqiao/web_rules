import React from 'react';
import { Space, Button, Tooltip, Modal, message } from 'antd';
import {
  CodeOutlined,
  DownloadOutlined,
  SaveOutlined,
  ClearOutlined,
  EyeOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
  FileZipOutlined
} from '@ant-design/icons';

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
  canCompile
}) => {
  const handleClear = () => {
    Modal.confirm({
      title: '确认清空',
      content: '确定要清空所有节点和连线吗？此操作不可恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        onClear();
        message.success('已清空画布');
      }
    });
  };

  return (
    <div style={{
      padding: '12px 24px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
          业务规则配置系统
        </h2>
      </div>

      <Space size="small">
        <Tooltip title="预览">
          <Button 
            icon={<EyeOutlined />} 
            onClick={onPreview}
          >
            预览
          </Button>
        </Tooltip>

        <Tooltip title="编译规则">
          <Button 
            type="primary"
            icon={<CodeOutlined />} 
            onClick={onCompile}
            disabled={!canCompile}
          >
            编译
          </Button>
        </Tooltip>

        <Tooltip title="下载规则包">
          <Button 
            icon={<DownloadOutlined />} 
            onClick={onDownload}
            disabled={!canCompile}
          >
            下载
          </Button>
        </Tooltip>

        <Tooltip title="下载 JAR 包">
          <Button 
            icon={<FileZipOutlined />} 
            onClick={onDownloadJar}
            disabled={!canCompile}
          >
            下载 JAR
          </Button>
        </Tooltip>

        <Tooltip title="保存配置">
          <Button 
            icon={<SaveOutlined />} 
            onClick={onSave}
          >
            保存
          </Button>
        </Tooltip>

        <Tooltip title="清空画布">
          <Button 
            danger
            icon={<ClearOutlined />} 
            onClick={handleClear}
          >
            清空
          </Button>
        </Tooltip>
      </Space>

      <Space size="small">
        <Tooltip title="放大">
          <Button 
            icon={<ZoomInOutlined />} 
            onClick={onZoomIn}
          />
        </Tooltip>
        <Tooltip title="缩小">
          <Button 
            icon={<ZoomOutOutlined />} 
            onClick={onZoomOut}
          />
        </Tooltip>
        <Tooltip title="适应视图">
          <Button 
            icon={<FullscreenOutlined />} 
            onClick={onFitView}
          />
        </Tooltip>
      </Space>
    </div>
  );
};
