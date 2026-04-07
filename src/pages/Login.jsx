import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(t('login_error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">{t('login_app_name')}</h1>
          <p className="text-muted-foreground">{t('login_tagline')}</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('login_email_label')}</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('login_password_label')}</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="demo123"
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

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t('login_logging_in') : t('login_login_btn')}
          </Button>

          <div className="text-center text-xs">
            <Link to="/forgot-password" className="text-primary hover:underline font-medium">
              {t('login_forgot_password')}
            </Link>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground text-center mt-4">
            <p>
              {t('login_demo_hint')}
            </p>
            <p>
              {t('login_no_account')}{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                {t('login_create_account')}
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-muted-foreground text-sm mb-6 text-center">{t('login_features_intro')}</p>

          <div className="space-y-3 text-xs text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <span>📊</span>
              <span>{t('login_feature_nutrition')}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span>👟</span>
              <span>{t('login_feature_steps')}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span>📈</span>
              <span>{t('login_feature_measurements')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
