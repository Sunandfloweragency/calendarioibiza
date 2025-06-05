import React from 'react';
import { useTranslation } from 'react-i18next';
import { PRIVACY_POLICY_TEXT_EN, PRIVACY_POLICY_TEXT_ES } from '../constants';

const PrivacyPolicyPage: React.FC = () => {
  const { i18n } = useTranslation(); // t function not used directly here
  const content = i18n.language.startsWith('es') ? PRIVACY_POLICY_TEXT_ES : PRIVACY_POLICY_TEXT_EN;

  return (
    <div className="bg-brand-surface p-6 sm:p-8 rounded-xl shadow-main-card max-w-3xl mx-auto animate-fade-in prose-custom">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default PrivacyPolicyPage;