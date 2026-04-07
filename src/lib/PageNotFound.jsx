import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function PageNotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {t('error_page_not_found')}
        </h2>
        <p className="text-muted-foreground mb-8">
          {t('error_page_not_found_desc')}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Home className="w-4 h-4" />
          {t('error_back_home')}
        </Link>
      </div>
    </div>
  );
}
