import About from '@/components/About';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | The Victoria\'s Outcall Massage',
  description: 'Learn about our professional Thai massage services in Bangkok. Our skilled therapists bring relaxation and rejuvenation to your doorstep.',
};

export default function AboutPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  return (
    <main>
      <div className="pt-20">
        <About locale={locale} />
      </div>
    </main>
  );
} 