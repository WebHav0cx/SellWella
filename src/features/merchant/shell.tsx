"use client";
import { useState, type ReactNode } from "react";
import { Command } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Sidebar } from "@/components/common/sidebar";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
export function MerchantShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-shell">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Icon name="menu" />
          </button>
          <div className="search-box">
            <Icon name="search" size={19} />
            <span>Search orders, customers, products...</span>
            <kbd className="inline-flex items-center gap-1">
              <Command size={12} aria-hidden="true" /> K
            </kbd>
          </div>
          <div className="topbar-actions">
            <ThemeToggle />
            <Link
              href="/activity"
              className="icon-button"
              aria-label="Notifications"
            >
              <Icon name="bell" />
              <span className="notification-dot" />
            </Link>
            <Link href="/orders?create=true" className="create-button">
              <Icon name="plus" size={19} /> Create sale
            </Link>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
