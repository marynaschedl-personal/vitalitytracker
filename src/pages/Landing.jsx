import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import FeedbackButton from '@/components/FeedbackButton';
import { motion } from 'framer-motion';
import { Salad, Footprints, Ruler, UserPlus, ClipboardList, TrendingUp, Check, ArrowRight } from 'lucide-react';

const colors = {
  bg: '#F8FAFC',
  white: '#FFFFFF',
  primary: '#10B981',
  primaryLight: '#F0FDF4',
  text: '#0F172A',
  muted: '#64748B',
  border: '#E2E8F0',
  green100: '#DCFCE7',
  green500: '#22C55E',
  green600: '#16A34A',
};

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login } = useAuth();

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      console.log('Starting demo login...');
      const result = await login('demo@example.com', 'demo123');
      console.log('Login successful:', result);
      navigate('/');
    } catch (err) {
      console.error('Demo login failed:', err);
      alert('Demo login failed: ' + err.message);
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div style={{ background: colors.bg, minHeight: '100vh' }}>
      {/* Header */}
      <header
        style={{
          background: colors.white,
          borderBottom: `1px solid ${colors.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: colors.primary,
            }}
          >
            {t('landing_app_name')}
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button
              onClick={() => navigate('/login')}
              style={{
                background: colors.primary,
                color: 'white',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {t('landing_login_btn')}
            </Button>
            <Button
              type="button"
              onClick={handleDemoLogin}
              style={{
                background: '#3B82F6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '4rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
        }}
        className="lg:grid-cols-2 grid-cols-1"
      >
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <h2
            style={{
              fontSize: '3.5rem',
              fontWeight: 800,
              color: colors.text,
              lineHeight: 1.1,
              marginBottom: '1rem',
            }}
          >
            Track Your Health Journey
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              color: colors.muted,
              marginBottom: '2rem',
              lineHeight: 1.6,
            }}
          >
            {t('landing_hero_paragraph')}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button
              onClick={() => navigate('/register')}
              style={{
                background: colors.primary,
                color: 'white',
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {t('landing_cta_start')} <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
            </Button>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            background: `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.white} 100%)`,
            borderRadius: '1.5rem',
            padding: '2rem',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: colors.white, padding: '1.25rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: '0.875rem', color: colors.muted }}>Calories</p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: colors.text }}>2,450</p>
              <p style={{ fontSize: '0.75rem', color: colors.muted }}>of 2,000 goal</p>
            </div>
            <div style={{ background: colors.white, padding: '1.25rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: '0.875rem', color: colors.muted }}>Steps</p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: colors.text }}>8,234</p>
              <p style={{ fontSize: '0.75rem', color: colors.muted }}>of 7,000 goal</p>
            </div>
          </div>
          <div style={{ background: colors.white, padding: '1.25rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '0.875rem', color: colors.muted }}>Weight</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: colors.text }}>78.5 kg</p>
            <p style={{ fontSize: '0.75rem', color: colors.muted }}>↓ 2.3 kg this month</p>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        style={{
          maxWidth: '1280px',
          margin: '4rem auto 0',
          padding: '4rem 1.5rem',
          background: colors.white,
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              color: colors.text,
              marginBottom: '0.5rem',
            }}
          >
            {t('landing_features_heading')}
          </h2>
          <p style={{ color: colors.muted }}>Everything you need to take control of your health</p>
        </motion.div>

        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
          }}
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="md:grid-cols-3 sm:grid-cols-1"
        >
          {[
            { icon: Salad, title: t('landing_feature_nutrition_title'), desc: t('landing_feature_nutrition_desc') },
            { icon: Footprints, title: t('landing_feature_steps_title'), desc: t('landing_feature_steps_desc') },
            { icon: Ruler, title: t('landing_feature_measurements_title'), desc: t('landing_feature_measurements_desc') },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={fadeInUp}
                style={{
                  background: colors.white,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '1rem',
                  padding: '2rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
              >
                <div
                  style={{
                    background: colors.primaryLight,
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}
                >
                  <Icon size={24} color={colors.primary} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.text, marginBottom: '0.5rem' }}>
                  {feature.title}
                </h3>
                <p style={{ color: colors.muted, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* How It Works */}
      <section
        style={{
          maxWidth: '1280px',
          margin: '4rem auto',
          padding: '4rem 1.5rem',
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              color: colors.text,
            }}
          >
            {t('landing_how_title')}
          </h2>
        </motion.div>

        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
          }}
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="md:grid-cols-3 sm:grid-cols-1"
        >
          {[
            { icon: UserPlus, title: t('landing_step1_title'), desc: t('landing_step1_desc'), step: 1 },
            { icon: ClipboardList, title: t('landing_step2_title'), desc: t('landing_step2_desc'), step: 2 },
            { icon: TrendingUp, title: t('landing_step3_title'), desc: t('landing_step3_desc'), step: 3 },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div key={idx} variants={fadeInUp} style={{ position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      background: colors.primary,
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1.25rem',
                    }}
                  >
                    {item.step}
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: colors.text, marginBottom: '0.5rem', textAlign: 'center' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: colors.muted, textAlign: 'center', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section
        style={{
          maxWidth: '1280px',
          margin: '4rem auto',
          padding: '4rem 1.5rem',
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              color: colors.text,
            }}
          >
            {t('landing_pricing_title')}
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            background: colors.white,
            border: `2px solid ${colors.primary}`,
            borderRadius: '1.5rem',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              background: colors.green100,
              color: colors.primary,
              display: 'inline-block',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            {t('landing_pricing_badge')}
          </div>
          <h3
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: colors.text,
              marginBottom: '1rem',
            }}
          >
            $0
          </h3>
          <p style={{ color: colors.muted, marginBottom: '2rem' }}>
            {t('landing_pricing_desc')}
          </p>
          <ul style={{ textAlign: 'left', marginBottom: '2rem' }}>
            {['Nutrition tracking', 'Step counter', 'Body measurements', 'Goal setting', 'Privacy-first design'].map((item, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0',
                  color: colors.text,
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <Check size={20} color={colors.primary} />
                {item}
              </li>
            ))}
          </ul>
          <Button
            onClick={() => navigate('/register')}
            style={{
              background: colors.primary,
              color: 'white',
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {t('landing_cta_start')}
          </Button>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.green600} 100%)`,
          color: 'white',
          padding: '4rem 1.5rem',
          textAlign: 'center',
          margin: '4rem 0 0',
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
        >
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            {t('landing_ready_heading')}
          </h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.95 }}>
            {t('landing_cta_banner')}
          </p>
          <Button
            onClick={() => navigate('/register')}
            style={{
              background: 'white',
              color: colors.primary,
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {t('landing_cta_create')} <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: colors.white,
          borderTop: `1px solid ${colors.border}`,
          padding: '2rem 1.5rem',
          textAlign: 'center',
          color: colors.muted,
        }}
      >
        <p>{t('landing_footer')}</p>
      </footer>

      <FeedbackButton />
    </div>
  );
}
