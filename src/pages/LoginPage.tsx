
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ADMIN_USERNAME } from '../constants'; 
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useTranslation } from 'react-i18next';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, currentUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    
    try {
        const loggedInUser = await login(username, password); 
        
        if (loggedInUser) {
          if (loggedInUser.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/user/dashboard');
          }
        } else {
          setError(t('login.error.credentials'));
          setPassword('');
        }
    } catch (err: any) {
        setError(err.message || t('login.error.generic'));
        setPassword('');
    }
    setIsLoggingIn(false);
  };

  if (authLoading) {
    return <div className="text-center py-10">{t('page.loading')}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] animate-fade-in py-10">
      <div className="bg-brand-surface p-8 rounded-xl shadow-2xl w-full max-w-md border border-brand-gold/20">
        <h1 className="text-3xl font-headings font-bold text-brand-orange text-center mb-8">
          {username.toLowerCase() === ADMIN_USERNAME.toLowerCase() ? t('login.adminTitle') : t('login.title')}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            label={t('form.password')}
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div className="text-right">
            <Link to="/forgot-password" className="text-xs text-brand-gray hover:text-brand-orange hover:underline">
              {t('login.forgotPassword')}
            </Link>
          </div>
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoggingIn}>
            {isLoggingIn ? t('form.submitting') : (username.toLowerCase() === ADMIN_USERNAME.toLowerCase() ? t('login.adminTitle') : t('login.title'))}
          </Button>
        </form>
        <p className="text-center mt-6 text-brand-gray">
          {t('register.dontHaveAccount')}{' '}
          <Link to="/register" className="text-brand-orange hover:underline">
            {t('nav.register')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
