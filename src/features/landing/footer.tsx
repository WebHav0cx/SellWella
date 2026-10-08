import Link from "next/link";

import { SellWellaLogo } from "@/components/common/sellwella-logo";
export function LandingFooter() {
  return (
    <footer className="marketing-footer">
      <div>
        <SellWellaLogo light />
        <p>
          An intelligent commerce workspace for small businesses selling across
          social, online and physical channels.
        </p>
      </div>
      <div>
        <strong>Product</strong>
        <a href="#features">Features</a>
        <a href="#how-it-works">How it works</a>
        <a href="#pricing">Pricing</a>
        <Link href="/app">Demo workspace</Link>
      </div>
      <div>
        <strong>Company</strong>
        <a href="#who-its-for">Who it’s for</a>
        <a href="#faqs">FAQs</a>
        <Link href="/support">Help & Support</Link>
      </div>
      <div>
        <strong>Legal</strong>
        <span>Privacy Policy · Pending publication</span>
        <span>Terms of Service · Pending publication</span>
        <span>Legal pages will be linked when approved.</span>
      </div>
      <small>© 2026 SellWella demonstration. More sales. Less wahala.</small>
    </footer>
  );
}
