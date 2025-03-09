import Therapists from '@/components/Therapists';

export default function TherapistsPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  return (
    <main className="pt-20">
      <Therapists locale={locale} />
    </main>
  );
} 