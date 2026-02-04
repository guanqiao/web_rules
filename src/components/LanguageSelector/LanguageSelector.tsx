import React from 'react';
import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <Select
      value={i18n.language}
      onChange={handleLanguageChange}
      style={{ width: 120 }}
      suffixIcon={<GlobalOutlined />}
    >
      <Option value="zh-CN">中文</Option>
      <Option value="en-US">English</Option>
    </Select>
  );
};
