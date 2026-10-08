import Link from "next/link";

import { ArrowRight } from "lucide-react";

export function AiPreview() {
  return (
    <section className="landing-ai">
      <div>
        <span>SELLWELLA AI</span>
        <h2>A smarter assistant for your business.</h2>
        <p>
          Use verified catalogue information to prepare draft orders, customer
          replies and practical business insights. You stay in control of
          consequential actions.
        </p>
        <ul>
          <li>Turn enquiries into editable draft orders</li>
          <li>Suggest replies using current prices and stock</li>
          <li>Identify follow-up opportunities</li>
          <li>Explain recorded business activity</li>
        </ul>
        <Link href="/signup">
          Try the demonstration <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <div className="ai-marketing-preview">
        <header>
          <i>AB</i>
          <span>
            <strong>Aisha Bello</strong>
            <small>Instagram enquiry</small>
          </span>
        </header>
        <p>
          “Hello, I want two black handbags and one pair of white sneakers.”
        </p>
        <div>
          <span>SellWella AI · Local demonstration</span>
          <strong>Draft order prepared</strong>
          <article>
            <i>2×</i>
            <b>Classic Black Handbag</b>
            <em>₦30,000</em>
          </article>
          <article>
            <i>1×</i>
            <b>White Everyday Sneakers</b>
            <em>₦24,000</em>
          </article>
          <footer>
            <span>Total</span>
            <strong>₦54,000</strong>
          </footer>
          <Link href="/orders">Review Draft</Link>
        </div>
      </div>
    </section>
  );
}
