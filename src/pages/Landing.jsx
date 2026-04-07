import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import FeedbackButton from '@/components/FeedbackButton';

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">{t('landing_app_name')}</h1>
          <Button onClick={() => navigate('/login')} variant="outline">
            {t('landing_login_btn')}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">{t('landing_hero_heading')}</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t('landing_hero_paragraph')}
        </p>
        <Button onClick={() => navigate('/register')} size="lg" className="text-lg px-8">
          {t('landing_cta_start')}
        </Button>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">{t('landing_features_heading')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <article className="bg-card border border-border rounded-lg p-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-4">{t('landing_feature_nutrition_title')}</h3>
            <p className="text-muted-foreground">
              {t('landing_feature_nutrition_desc')}
            </p>
          </article>

          <article className="bg-card border border-border rounded-lg p-8">
            <div className="text-4xl mb-4">👟</div>
            <h3 className="text-xl font-bold mb-4">{t('landing_feature_steps_title')}</h3>
            <p className="text-muted-foreground">
              {t('landing_feature_steps_desc')}
            </p>
          </article>

          <article className="bg-card border border-border rounded-lg p-8">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-4">{t('landing_feature_measurements_title')}</h3>
            <p className="text-muted-foreground">
              {t('landing_feature_measurements_desc')}
            </p>
          </article>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 bg-card rounded-lg border border-border p-8">
        <h2 className="text-3xl font-bold mb-8">{t('landing_benefits_heading')}</h2>
        <ul className="space-y-4 text-lg text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>{t('landing_benefit_1')}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>{t('landing_benefit_2')}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>{t('landing_benefit_3')}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>{t('landing_benefit_4')}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>{t('landing_benefit_5')}</span>
          </li>
        </ul>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">{t('landing_ready_heading')}</h2>
        <p className="text-lg text-muted-foreground mb-8">
          {t('landing_ready_subtext')}
        </p>
        <Button onClick={() => navigate('/register')} size="lg" className="text-lg px-8">
          {t('landing_cta_create')}
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>{t('landing_footer')}</p>
        </div>
      </footer>

      <FeedbackButton />
    </div>
  );
}
