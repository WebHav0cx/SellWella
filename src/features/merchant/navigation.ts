import type { IconName } from "@/components/ui/icon";
export const navGroups = [
  {
    label: "Workspace",
    items: [
      { icon: "home" as IconName, label: "Overview", href: "/" },
      { icon: "bell" as IconName, label: "Activity Centre", href: "/activity" },
    ],
  },
  {
    label: "Sales & Customers",
    items: [
      {
        icon: "inbox" as IconName,
        label: "Unified Inbox",
        href: "/inbox",
        count: 3,
      },
      {
        icon: "customers" as IconName,
        label: "Customers & CRM",
        href: "/customers",
      },
      { icon: "orders" as IconName, label: "Orders", href: "/orders" },
      { icon: "card" as IconName, label: "Point of Sale", href: "/pos" },
      {
        icon: "trend" as IconName,
        label: "Sales Recovery",
        href: "/sales-recovery",
      },
    ],
  },
  {
    label: "Commerce",
    items: [
      { icon: "products" as IconName, label: "Products", href: "/products" },
      { icon: "inventory" as IconName, label: "Inventory", href: "/inventory" },
      { icon: "store" as IconName, label: "Storefront", href: "/storefront" },
      {
        icon: "sparkles" as IconName,
        label: "Promotions",
        href: "/promotions",
      },
    ],
  },
  {
    label: "Finance",
    items: [
      { icon: "payments" as IconName, label: "Payments", href: "/payments" },
      {
        icon: "card" as IconName,
        label: "Payment Links",
        href: "/payments/links",
      },
      {
        icon: "orders" as IconName,
        label: "Quotations & Invoices",
        href: "/invoices",
      },
      {
        icon: "wallet" as IconName,
        label: "Expenses & Accounting",
        href: "/finances",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        icon: "package" as IconName,
        label: "Deliveries & Fulfilment",
        href: "/fulfilment",
      },
      { icon: "arrow" as IconName, label: "Returns", href: "/returns" },
      {
        icon: "customers" as IconName,
        label: "Team Management",
        href: "/team",
      },
    ],
  },
  {
    label: "Intelligence",
    items: [
      {
        icon: "reports" as IconName,
        label: "Reports & Analytics",
        href: "/analytics",
      },
      {
        icon: "sparkles" as IconName,
        label: "SellWella AI",
        href: "/ai-assistant",
      },
      {
        icon: "settings" as IconName,
        label: "Automation Centre",
        href: "/automations",
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        icon: "settings" as IconName,
        label: "Settings & Integrations",
        href: "/settings",
      },
      { icon: "card" as IconName, label: "Subscription", href: "/billing" },
      {
        icon: "message" as IconName,
        label: "Help & Support",
        href: "/support",
      },
    ],
  },
];
