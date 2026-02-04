import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhCN from './locales/zh-CN';
import enUS from './locales/en-US';

const resources = {
  'zh-CN': zhCN,
  'en-US': enUS
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'zh-CN',
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
