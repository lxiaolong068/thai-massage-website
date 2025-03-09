import Contact from '@/components/Contact';

export default function ContactPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  return (
    <main className="pt-20">
      <Contact locale={locale} />
    </main>
  );
} 