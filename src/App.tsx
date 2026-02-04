import React from 'react';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { RuleEditorWithProvider } from '@/components/RuleEditor/RuleEditor';

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
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
