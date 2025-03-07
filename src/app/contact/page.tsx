import Contact from '@/components/Contact';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <main className="relative">
      <Header />
      <div className="relative z-10 pt-24 md:pt-28">
        <Contact />
      </div>
      <Footer />
    </main>
  );
} 