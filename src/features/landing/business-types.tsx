import Image from "next/image";
import { Check } from "lucide-react";

export function BusinessTypes() {
  return (
    <section className="business-types" id="who-its-for">
      <div className="business-photo">
        <Image
          src="https://images.unsplash.com/photo-1751276651319-d311a9d0b8af?auto=format&fit=crop&w=1200&q=85"
          alt="Business owner browsing clothing in a retail shop"
          width={1200}
          height={1200}
          sizes="(max-width: 760px) 100vw, 50vw"
        />
        <span>Built for everyday commerce</span>
      </div>
      <div>
        <div className="landing-section-heading left">
          <span>BUILT FOR YOUR BUSINESS</span>
          <h2>Whatever you sell, SellWella helps you run it.</h2>
          <p>
            From your first social sale to a growing retail operation, keep your
            business records connected.
          </p>
        </div>
        <ul>
          {[
            "Instagram and WhatsApp vendors",
            "Fashion and accessories businesses",
            "Beauty and lifestyle retailers",
            "Physical shops",
            "Growing multichannel businesses",
          ].map((item) => (
            <li key={item}>
              <Check size={18} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
