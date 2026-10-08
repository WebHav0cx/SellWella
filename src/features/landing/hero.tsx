import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Plus } from "lucide-react";

import { SalesChart } from "@/components/charts/sales-chart";
import { salesPerformance } from "@/features/merchant/sales-data";
export function LandingHero() {
  return (
    <section className="landing-hero">
      <div className="landing-hero-copy">
        <span>THE SMARTER WAY TO RUN YOUR BUSINESS</span>
        <h1>
          More sales.
          <br />
          <em>Less wahala.</em>
        </h1>
        <p>
          Bring your customers, orders, payments, inventory and online store
          together in one smart platform. Spend less time managing tools and
          more time growing your business.
        </p>
        <div>
          <Link className="landing-primary" href="/signup">
            Get Started <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a className="landing-secondary" href="#how-it-works">
            See How It Works
          </a>
        </div>
        <small>
          <i /> One business. Multiple sales channels. Everything connected.
        </small>
      </div>
      <div className="hero-product-preview">
        <div className="hero-glow" />
        <div className="hero-dashboard-card">
          <header>
            <span>
              <Image src="/sellwella-mark.svg" alt="" width={30} height={30} />
              <b>SellWella</b>
            </span>
            <small>Amina’s Fashion</small>
          </header>
          <div className="hero-dash-title">
            <span>
              <small>Good morning, Amina</small>
              <strong>Your business today</strong>
            </span>
            <Link href="/orders?create=true">
              <Plus size={12} aria-hidden="true" /> Create sale
            </Link>
          </div>
          <div className="hero-kpis">
            <article>
              <span>Total sales</span>
              <strong>₦485,000</strong>
              <small>Illustrative</small>
            </article>
            <article>
              <span>Orders</span>
              <strong>32</strong>
              <small>8 awaiting payment</small>
            </article>
            <article>
              <span>Needs attention</span>
              <strong>5</strong>
              <small>Open tasks</small>
            </article>
          </div>
          <div className="hero-chart">
            <div>
              <span>Sales performance</span>
              <strong>₦2.45M</strong>
            </div>
            <SalesChart data={salesPerformance} />
          </div>
          <div className="hero-orders">
            <strong>Recent orders</strong>
            <span>
              <i>AB</i>Aisha Bello<b>₦31,000</b>
              <em>Paid</em>
            </span>
            <span>
              <i>ZY</i>Zainab Yusuf<b>₦24,000</b>
              <em>Pending</em>
            </span>
          </div>
        </div>
        <div className="hero-mobile-card">
          <header>
            <Image src="/sellwella-mark.svg" alt="" width={30} height={30} />
            <span>
              <small>Today’s sales</small>
              <strong>₦245,500</strong>
            </span>
          </header>
          <div>
            <b>Quick actions</b>
            <span>
              <Link href="/orders?create=true">New sale</Link>
              <Link href="/payments/links">Payment link</Link>
            </span>
          </div>
          <p>
            Needs your attention <strong>4</strong>
          </p>
        </div>
        <div className="hero-stock-card">
          <span>Low stock alert</span>
          <strong>Blue Linen Dress</strong>
          <small>Only 2 available</small>
        </div>
      </div>
    </section>
  );
}
