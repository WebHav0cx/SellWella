"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { navGroups } from "@/features/merchant/navigation";
export function Sidebar({
  sidebarOpen,
  onClose,
}: {
  sidebarOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const active =
    navGroups
      .flatMap((group) => group.items)
      .find((item) => item.href === pathname)?.label ?? "Overview";
  const [openGroups, setOpenGroups] = useState(
    () => new Set(["Workspace", "Sales & Customers", "Commerce"]),
  );

  const toggleGroup = (label: string) => {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <Image
            src="/sellwella-mark.svg"
            alt=""
            width={34}
            height={34}
            className="shrink-0"
            priority
          />
          <div className="brand-name">SellWella</div>
          <button
            className="mobile-close"
            onClick={() => onClose()}
            aria-label="Close menu"
          >
            <Icon name="close" />
          </button>
        </div>

        <button className="workspace-card">
          <span className="workspace-avatar">AF</span>
          <span className="workspace-copy">
            <strong>Amina&apos;s Fashion</strong>
            <small>Business workspace</small>
          </span>
          <Icon name="chevron" size={16} />
        </button>

        <nav className="side-nav">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <button
                className="nav-group-toggle"
                onClick={() => toggleGroup(group.label)}
                aria-expanded={openGroups.has(group.label)}
              >
                <span>{group.label}</span>
                <Icon name="chevron" size={13} />
              </button>
              {openGroups.has(group.label) && (
                <div className="nav-group-items">
                  {group.items.map((item) => (
                    <Link
                      href={item.href}
                      aria-current={active === item.label ? "page" : undefined}
                      className={`nav-item ${
                        active === item.label ? "active" : ""
                      }`}
                      key={item.label}
                      onClick={() => {
                        onClose();
                      }}
                    >
                      <Icon name={item.icon} />
                      <span>{item.label}</span>
                      {item.count && (
                        <span className="nav-count">{item.count}</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link
            href="/settings"
            className={`nav-item ${
              active === "Settings & Integrations" ? "active" : ""
            }`}
          >
            <Icon name="settings" />
            <span>Settings</span>
          </Link>
          <div className="help-card">
            <div className="help-icon">
              <Icon name="sparkles" size={17} />
            </div>
            <strong>Need help?</strong>
            <p>Visit our help centre or chat with support.</p>
            <button>
              Get support <Icon name="arrow" size={15} />
            </button>
          </div>
          <div className="user-card">
            <span className="user-avatar">AO</span>
            <span>
              <strong>Amina Okafor</strong>
              <small>Business owner</small>
            </span>
            <Icon name="more" size={18} />
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          onClick={() => onClose()}
          aria-label="Close navigation"
        />
      )}
    </>
  );
}
