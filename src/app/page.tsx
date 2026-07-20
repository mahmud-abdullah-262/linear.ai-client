import Banner from "@/components/Banner";
import CtaSection from "@/components/CtaSection";
import Explainer from "@/components/Explainer";
import FAQ from "@/components/FAQ";
import Feature from "@/components/Feature";
import Stats from "@/components/Stats";
import TestimonialsSection from "@/components/TestimonialsSection";


export default function Home() {
  return (
    <>
      <Banner />
      <Feature />
      <Stats />
      <Explainer />
      <TestimonialsSection />
      <FAQ />
      <CtaSection />
    </>
  );
}
