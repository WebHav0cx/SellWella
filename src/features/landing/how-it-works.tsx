import Link from "next/link";

import { ArrowRight } from "lucide-react";

export function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="landing-section-heading">
        <span>GET STARTED SIMPLY</span>
        <h2>Start selling smarter in four simple steps.</h2>
      </div>
      <div className="steps-grid">
        {[
          [
            "1",
            "Create your business account",
            "Set up your profile without completing a long business form.",
          ],
          [
            "2",
            "Add products and your store",
            "Build your shared catalogue and choose what customers can see.",
          ],
          [
            "3",
            "Manage every sale",
            "Handle available social, online and walk-in workflows together.",
          ],
          [
            "4",
            "Understand your business",
            "Track orders, payments, stock and actions requiring attention.",
          ],
        ].map(([number, title, text]) => (
          <article key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <Link className="landing-primary" href="/signup">
        Create your account <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
