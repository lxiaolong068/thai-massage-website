import { useTranslations } from 'next-intl';

type ExampleComponentProps = {
  locale?: string;
};

export default function ExampleComponent({ locale = 'en' }: ExampleComponentProps) {
  const t = useTranslations('ExampleComponent');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
} 