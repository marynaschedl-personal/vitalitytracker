import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!email || !password || !confirmPassword) {
      setError(t('register_error_all_fields'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('register_error_passwords_match'));
      return;
    }

    if (password.length < 6) {
      setError(t('register_error_password_length'));
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(t('register_error_invalid_email'));
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setError(err.message || t('register_error_failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">{t('register_app_name')}</h1>
          <p className="text-muted-foreground">{t('register_title')}</p>
        </div>

        {success ? (
          <div className="bg-card border border-border rounded-lg p-12 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mb-6" />
            <h2 className="text-xl font-bold text-foreground mb-2">{t('register_loading_heading')}</h2>
            <p className="text-sm text-muted-foreground text-center">{t('register_loading_message')}</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('register_email_label')}</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('register_email_placeholder')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('register_password_label')}</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('register_password_placeholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('register_confirm_password_label')}</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('register_confirm_password_placeholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? t('register_creating') : t('register_register_btn')}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              {t('register_have_account')}{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                {t('register_login_link')}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
