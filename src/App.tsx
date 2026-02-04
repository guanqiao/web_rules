import React from 'react';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { RuleEditorWithProvider } from '@/components/RuleEditor/RuleEditor';
import '@/i18n';
import { useTranslation } from 'react-i18next';

const App: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <ConfigProvider
      locale={i18n.language === 'zh-CN' ? zhCN : enUS}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <RuleEditorWithProvider />
      </div>
    </ConfigProvider>
  );
};

export default App;
