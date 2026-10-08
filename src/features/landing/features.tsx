import { features } from "./data";
import { FeatureIcon } from "./feature-icon";
export function LandingFeatures() {
  return (
    <section className="landing-features" id="features">
      <div className="landing-section-heading">
        <span>BUILT TO WORK TOGETHER</span>
        <h2>Everything you need to sell and grow.</h2>
        <p>
          Start with the essentials. Add more operational depth as your business
          grows.
        </p>
      </div>
      <div className="feature-grid">
        {features.map(([number, title, text]) => (
          <article key={title}>
            <span>{number}</span>
            <div className="feature-symbol">
              <FeatureIcon index={Number(number) - 1} />
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
            <small>Explore capability</small>
          </article>
        ))}
      </div>
    </section>
  );
}
