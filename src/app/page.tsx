import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Introduction from '@/components/Introduction';
import Services from '@/components/Services';
import Therapists from '@/components/Therapists';
import Testimonials from '@/components/Testimonials';
import CallToAction from '@/components/CallToAction';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <div className="relative z-10">
        <About />
        <Introduction />
        <Services />
        <Therapists />
        <Testimonials />
        <CallToAction />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
