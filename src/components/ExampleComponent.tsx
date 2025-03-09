import { useTranslations } from 'next-intl';
import { useLocale } from '../hooks/useLocale';

export default function ExampleComponent() {
  const locale = useLocale();
  const t = useTranslations('ExampleComponent');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
} 