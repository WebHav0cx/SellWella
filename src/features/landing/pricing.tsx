import Link from "next/link";

export function LandingPricing() {
  return (
    <section className="pricing-section" id="pricing">
      <div className="landing-section-heading">
        <span>PRICING</span>
        <h2>A plan for every stage of your business.</h2>
        <p>
          Commercial pricing and plan entitlements are still being prepared. We
          will not invent fees before they are approved.
        </p>
      </div>
      <div className="pricing-card">
        <span>PRICING COMING SOON</span>
        <h3>Join the early-access list.</h3>
        <p>
          Tell us you are interested and be among the first to hear when
          SellWella plans become available.
        </p>
        <Link href="/signup">Express interest</Link>
        <small>
          Payment-processing, messaging and third-party service fees will be
          described separately where applicable.
        </small>
      </div>
    </section>
  );
}
