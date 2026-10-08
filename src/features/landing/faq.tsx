"use client";

import { Plus, Minus } from "lucide-react";

import { useState } from "react";
import { faqs } from "./data";
export function LandingFaq() {
  const [faqOpen, setFaqOpen] = useState(0);
  return (
    <section className="faq-section" id="faqs">
      <div className="landing-section-heading left">
        <span>COMMON QUESTIONS</span>
        <h2>Questions, answered simply.</h2>
      </div>
      <div className="faq-list">
        {faqs.map(([question, answer], index) => (
          <article className={faqOpen === index ? "open" : ""} key={question}>
            <button
              onClick={() => setFaqOpen(faqOpen === index ? -1 : index)}
              aria-expanded={faqOpen === index}
            >
              <span>{question}</span>
              {faqOpen === index ? (
                <Minus size={18} aria-hidden="true" />
              ) : (
                <Plus size={18} aria-hidden="true" />
              )}
            </button>
            {faqOpen === index && <p>{answer}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
