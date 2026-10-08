import Link from "next/link";

import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="landing-final-cta">
      <span>READY WHEN YOU ARE</span>
      <h2>Your business deserves a better way to grow.</h2>
      <p>
        Start bringing your sales, customers and business operations together
        with SellWella.
      </p>
      <Link href="/signup">
        Get Started <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
