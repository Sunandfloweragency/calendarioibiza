
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useTranslation } from 'react-i18next';
import { DJ_GENRES, EVENT_TYPES, USER_PROFILE_TYPES } from '../constants';
import { UserData } from '../types';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState(''); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [preferredStyles, setPreferredStyles] = useState<string[]>([]);
  const [userProfileType, setUserProfileType] = useState<UserData['userProfileType']>('consumer');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handlePreferredStyleChange = (style: string) => {
    setPreferredStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) {
        setError(t('register.error.usernameRequired'));
        return;
    }
    if (password !== confirmPassword) {
      setError(t('register.error.passwordsDontMatch'));
      return;
    }
    if (!acceptedTerms) {
      setError(t('register.error.terms'));
      return;
    }
    setIsRegistering(true);
    try {
      const newUser = await register(
        username, 
        email, 
        password, 
        name,
        country,
        preferredStyles,
        userProfileType
      );
      if (newUser) {
        navigate('/user/dashboard'); 
      } else {
        setError(t('register.error.generic'));
      }
    } catch (err: any) {
      if (err.message === 'Username already in use.') {
        setError(t('register.error.usernameTaken'));
      } else if (err.message === 'Email already in use.') {
        setError(t('register.error.emailTaken'));
      }
      else {
        setError(err.message || t('register.error.generic'));
      }
    }
    setIsRegistering(false);
  };
  
  const allStyles = Array.from(new Set([...DJ_GENRES, ...EVENT_TYPES])).sort();
  const commonInputClass = "w-full px-3 py-2 bg-brand-surface-variant border border-brand-surface rounded-md text-brand-light focus:ring-brand-orange focus:border-brand-orange transition-colors";
  const checkboxLabelClass = "flex items-center space-x-2 text-sm text-brand-light cursor-pointer";
  const checkboxClass = "form-checkbox h-4 w-4 text-brand-orange bg-brand-surface-variant border-brand-surface rounded focus:ring-brand-orange";


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] animate-fade-in py-10">
      <div className="bg-brand-surface p-8 rounded-xl shadow-main-card-hover w-full max-w-lg"> {/* Increased max-w */}
        <h1 className="text-3xl font-headings font-bold text-brand-orange text-center mb-8">{t('register.title')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label={t('form.username')} 
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
            <Input
              label={t('form.fullNameOptional')}
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <Input
            label={t('form.email')}
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
           <div className="grid md:grid-cols-2 gap-4">
            <Input
                label={t('form.password')}
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
            />
            <Input
                label={t('form.confirmPassword')}
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
            />
          </div>
          
          <Input
            label={t('form.country')}
            type="text"
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            autoComplete="country-name"
          />

          <div>
            <label className="block text-sm font-medium text-brand-gray mb-1">{t('form.userProfileType.label')}</label>
            <select 
              name="userProfileType" 
              value={userProfileType} 
              onChange={(e) => setUserProfileType(e.target.value as UserData['userProfileType'])}
              className={commonInputClass}
            >
              {USER_PROFILE_TYPES.map(type => (
                <option key={type.value} value={type.value}>{t(type.labelKey)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-gray mb-2">{t('form.preferredStyles.label')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 max-h-48 overflow-y-auto p-3 bg-brand-surface-variant/50 rounded custom-scrollbar">
              {allStyles.map(style => (
                <label key={style} className={checkboxLabelClass}>
                  <input 
                    type="checkbox" 
                    value={style}
                    checked={preferredStyles.includes(style)}
                    onChange={() => handlePreferredStyleChange(style)}
                    className={checkboxClass}
                  />
                  <span>{style}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className={checkboxClass}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-brand-gray">
              {t('terms.accept')}{' '}
              <Link to="/privacy-policy" className="text-brand-orange hover:underline" target="_blank">{t('footer.privacyPolicy')}</Link> &amp;{' '}
              <Link to="/legal-notice" className="text-brand-orange hover:underline" target="_blank">{t('footer.legalNotice')}</Link>.
            </label>
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isRegistering}>
            {isRegistering ? t('form.submitting') : t('nav.register')}
          </Button>
        </form>
         <p className="text-center mt-6 text-brand-gray">
          {t('register.haveAccount')}{' '}
          <Link to="/login" className="text-brand-orange hover:underline">
            {t('nav.login')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
