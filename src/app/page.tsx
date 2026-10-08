import { LandingHeader } from "@/features/landing/header";
import { LandingFooter } from "@/features/landing/footer";
import { LandingHero } from "@/features/landing/hero";
import { LandingProblem } from "@/features/landing/problem";
import { LandingSolution } from "@/features/landing/solution";
import { LandingFeatures } from "@/features/landing/features";
import { HowItWorks } from "@/features/landing/how-it-works";
import { BusinessTypes } from "@/features/landing/business-types";
import { AiPreview } from "@/features/landing/ai-preview";
import { ProductDemo } from "@/features/landing/product-demo";
import { LandingPricing } from "@/features/landing/pricing";
import { LandingFaq } from "@/features/landing/faq";
import { FinalCta } from "@/features/landing/final-cta";
export default function Page() {
  return (
    <div className="marketing-site">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingProblem />
        <LandingSolution />
        <LandingFeatures />
        <HowItWorks />
        <BusinessTypes />
        <AiPreview />
        <ProductDemo />
        <LandingPricing />
        <LandingFaq />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
