import { ArrowRight } from "lucide-react";

export function LandingSolution() {
  return (
    <section className="connected-solution">
      <div className="landing-section-heading light">
        <span>THE CONNECTED SOLUTION</span>
        <h2>One platform. Every part of your business.</h2>
        <p>
          A customer conversation can become an order, a payment, an inventory
          movement and a fulfilment task without re-entering the same sale.
        </p>
      </div>
      <div className="commerce-flow">
        {[
          "Customer Enquiry",
          "Order",
          "Payment",
          "Inventory",
          "Fulfilment",
          "Business Insights",
        ].map((item, index) => (
          <div key={item}>
            <i>{String(index + 1).padStart(2, "0")}</i>
            <strong>{item}</strong>
            {index < 5 && <ArrowRight size={18} aria-hidden="true" />}
          </div>
        ))}
      </div>
    </section>
  );
}
