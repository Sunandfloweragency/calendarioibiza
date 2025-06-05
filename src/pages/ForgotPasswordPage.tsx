
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useTranslation } from 'react-i18next';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] animate-fade-in py-10">
      <div className="bg-brand-surface p-8 rounded-xl shadow-main-card-hover w-full max-w-md">
        <h1 className="text-3xl font-headings font-bold text-brand-orange text-center mb-8">{t('forgotPassword.title')}</h1>
        {submitted ? (
          <div className="text-center">
            <p className="text-brand-light mb-4">{t('forgotPassword.successMessageLine1')}</p>
            <p className="text-xs text-brand-gray mb-6">{t('forgotPassword.successMessageLine2')}</p>
            <Link to="/login">
              <Button variant="primary" size="md">{t('forgotPassword.backToLogin')}</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-brand-gray text-sm text-center">{t('forgotPassword.instructions')}</p>
            <Input
              label={t('form.email')}
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('form.submitting') : t('forgotPassword.submitButton')}
            </Button>
          </form>
        )}
        {!submitted && (
            <p className="text-center mt-6 text-brand-gray">
            <Link to="/login" className="text-brand-orange hover:underline">
                {t('forgotPassword.backToLoginShort')}
            </Link>
            </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
