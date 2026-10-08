"use client";
import Link from "next/link";

import { SellWellaLogo } from "@/components/common/sellwella-logo";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="marketing-nav">
      <SellWellaLogo />
      <nav className={menuOpen ? "open" : ""}>
        {[
          ["Features", "features"],
          ["How It Works", "how-it-works"],
          ["Who It's For", "who-its-for"],
          ["Pricing", "pricing"],
          ["FAQs", "faqs"],
        ].map(([label, id]) => (
          <a href={`#${id}`} onClick={() => setMenuOpen(false)} key={id}>
            {label}
          </a>
        ))}
        <Link
          href="/login"
          className="mobile-signin"
          onClick={() => setMenuOpen(false)}
        >
          Sign In
        </Link>
      </nav>
      <div className="marketing-actions">
        <ThemeToggle />
        <Link href="/login">Sign In</Link>
        <Link className="marketing-primary" href="/signup">
          Get Started
        </Link>
      </div>
      <button
        className="marketing-menu"
        onClick={() => setMenuOpen((current) => !current)}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
      >
        {menuOpen ? (
          <X size={22} aria-hidden="true" />
        ) : (
          <Menu size={22} aria-hidden="true" />
        )}
      </button>
    </header>
  );
}
