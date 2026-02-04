import React, { useState, useEffect } from 'react';
import { Modal, Button, Steps, Card, Typography, Space } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph, Text } = Typography;

export interface OnboardingTourProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ visible, onClose, onComplete }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: t('onboarding.steps.welcome.title'),
      content: t('onboarding.steps.welcome.content'),
      icon: <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
    },
    {
      title: t('onboarding.steps.createNode.title'),
      content: t('onboarding.steps.createNode.content'),
      icon: <CheckCircleOutlined style={{ fontSize: 48, color: '#1890ff' }} />
    },
    {
      title: t('onboarding.steps.connectNode.title'),
      content: t('onboarding.steps.connectNode.content'),
      icon: <CheckCircleOutlined style={{ fontSize: 48, color: '#faad14' }} />
    },
    {
      title: t('onboarding.steps.editProperty.title'),
      content: t('onboarding.steps.editProperty.content'),
      icon: <CheckCircleOutlined style={{ fontSize: 48, color: '#722ed1' }} />
    },
    {
      title: t('onboarding.steps.compile.title'),
      content: t('onboarding.steps.compile.content'),
      icon: <CheckCircleOutlined style={{ fontSize: 48, color: '#13c2c2' }} />
    },
    {
      title: t('onboarding.steps.download.title'),
      content: t('onboarding.steps.download.content'),
      icon: <CheckCircleOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
    },
    {
      title: t('onboarding.steps.help.title'),
      content: t('onboarding.steps.help.content'),
      icon: <CheckCircleOutlined style={{ fontSize: 48, color: '#faad14' }} />
    }
  ];

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prev = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const skip = () => {
    onClose();
  };

  useEffect(() => {
    if (visible) {
      setCurrentStep(0);
    }
  }, [visible]);

  return (
    <Modal
      title={t('onboarding.title')}
      open={visible}
      onCancel={skip}
      width={700}
      footer={
        <Space>
          <Button onClick={skip}>{t('onboarding.skip')}</Button>
          {currentStep > 0 && (
            <Button onClick={prev}>{t('onboarding.previous')}</Button>
          )}
          <Button type="primary" onClick={next}>
            {currentStep === steps.length - 1 ? t('onboarding.finish') : t('onboarding.next')}
          </Button>
        </Space>
      }
    >
      <div style={{ padding: '24px 0' }}>
        <Steps current={currentStep} style={{ marginBottom: 32 }}>
          {steps.map((step, index) => (
            <Steps.Step key={index} title={step.title} />
          ))}
        </Steps>

        <Card style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ marginBottom: 24 }}>
            {steps[currentStep].icon}
          </div>
          <Title level={4} style={{ marginBottom: 16 }}>
            {steps[currentStep].title}
          </Title>
          <Paragraph style={{ fontSize: 14, color: '#666', marginBottom: 0 }}>
            {steps[currentStep].content}
          </Paragraph>
        </Card>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {currentStep + 1} / {steps.length}
          </Text>
        </div>
      </div>
    </Modal>
  );
};
