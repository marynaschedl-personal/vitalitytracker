import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '@/api/apiClient';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiClient.entities.User.forgotPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(t('forgot_error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">{t('forgot_app_name')}</h1>
          <p className="text-muted-foreground">{t('forgot_title')}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4">
          {!success ? (
            <>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {t('forgot_description')}
              </p>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('forgot_email_label')}</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t('forgot_sending') : t('forgot_button')}
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-600 font-medium">{t('forgot_success_heading')}</p>
                <p className="text-xs text-green-600 mt-1">
                  {t('forgot_success_message').replace('{email}', email)}
                </p>
              </div>
              <Button onClick={() => navigate('/login')} className="w-full">
                {t('forgot_back_to_login')}
              </Button>
            </div>
          )}

          <div className="text-center text-xs text-muted-foreground mt-4">
            <Link to="/login" className="text-primary hover:underline font-medium">
              {t('forgot_back_to_login')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
