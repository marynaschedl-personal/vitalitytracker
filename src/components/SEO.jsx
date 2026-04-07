import { useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export function SEO() {
  const { lang, t } = useLanguage();

  useEffect(() => {
    // Update title
    document.title = t('seo_title');

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('seo_description'));
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', t('seo_keywords'));
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', t('seo_og_title'));
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', t('seo_og_description'));
    }

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', t('seo_twitter_title'));
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', t('seo_twitter_description'));
    }

    // Update language meta tag
    const langMeta = document.querySelector('meta[name="language"]');
    if (langMeta) {
      langMeta.setAttribute('content', lang === 'ru' ? 'Russian' : 'English');
    }

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Update JSON-LD schema
    const schemaScript = document.querySelector('script[type="application/ld+json"]');
    if (schemaScript) {
      const schema = JSON.parse(schemaScript.textContent);
      schema.description = t('seo_schema_description');
      schemaScript.textContent = JSON.stringify(schema);
    }
  }, [lang, t]);

  return null;
}
