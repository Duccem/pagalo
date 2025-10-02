import CTA from "@/components/pages/home/cta";
import Features from "@/components/pages/home/features";
import Footer from "@/components/pages/home/footer";
import Hero from "@/components/pages/home/hero";
import HowItWorks from "@/components/pages/home/how-it-works";

export default function Home() {
  return (
    <div className="min-h-screen mx-auto max-w-7xl">
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}

