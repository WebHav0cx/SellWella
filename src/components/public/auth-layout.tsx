import { SellWellaLogo } from "@/components/common/sellwella-logo";
import { Check } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
export function AuthLayout({
  children,
  title = "Your business deserves better.",
  description = "Bring your customers, products, orders and business operations into one connected workspace.",
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <div className="auth-layout">
      <aside className="auth-brand-panel">
        <SellWellaLogo light />
        <div className="auth-brand-copy">
          <span>MORE SALES. LESS WAHALA.</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <ul>
            {[
              "Sell across social, online and in-store channels",
              "Keep orders, customers and inventory connected",
              "Understand what needs your attention",
            ].map((text) => (
              <li key={text}>
                <Check size={18} aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div className="auth-dashboard-preview">
          <div>
            <span>Today’s sales</span>
            <strong>₦245,500</strong>
            <small>Illustrative dashboard preview</small>
          </div>
          <div className="auth-preview-bars">
            {[1, 2, 3, 4, 5, 6].map((value) => (
              <i key={value} />
            ))}
          </div>
          <div className="auth-preview-row">
            <span>
              <b>18</b> Orders
            </span>
            <span>
              <b>4</b> Need attention
            </span>
          </div>
        </div>
      </aside>
      <main className="auth-form-panel">
        <div className="auth-mobile-logo">
          <SellWellaLogo />
        </div>
        <div className="auth-theme-toggle">
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
}
