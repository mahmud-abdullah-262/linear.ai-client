import React from "react";
import Banner from "@/components/Banner";
import Feature from "@/components/Feature";
import Stats from "@/components/Stats";
import Explainer from "@/components/Explainer";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero Banner (exact 65vh) */}
      <Banner />
      
      {/* Feature Grid */}
      <Feature />
      
      {/* Live Stats Mock Chart */}
      <Stats />
      
      {/* AI Capabilities Explainer */}
      <Explainer />
      
      {/* FAQ Accordion */}
      <FAQ />
    </div>
  );
}
