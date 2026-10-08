import { ROUTES } from "@/lib/routes";
import type { IconName } from "@/components/ui/icon";
export const navGroups = [
  {
    label: "Workspace",
    items: [
      { icon: "home" as IconName, label: "Overview" },
      { icon: "bell" as IconName, label: "Activity Centre" },
    ],
  },
  {
    label: "Sales & Customers",
    items: [
      { icon: "inbox" as IconName, label: "Unified Inbox", count: 3 },
      { icon: "customers" as IconName, label: "Customers & CRM" },
      { icon: "orders" as IconName, label: "Orders" },
      { icon: "card" as IconName, label: "Point of Sale" },
      { icon: "trend" as IconName, label: "Sales Recovery" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { icon: "products" as IconName, label: "Products" },
      { icon: "inventory" as IconName, label: "Inventory" },
      { icon: "store" as IconName, label: "Storefront" },
      { icon: "sparkles" as IconName, label: "Promotions" },
    ],
  },
  {
    label: "Finance",
    items: [
      { icon: "payments" as IconName, label: "Payments" },
      { icon: "card" as IconName, label: "Payment Links" },
      { icon: "orders" as IconName, label: "Quotations & Invoices" },
      { icon: "wallet" as IconName, label: "Expenses & Accounting" },
    ],
  },
  {
    label: "Operations",
    items: [
      { icon: "package" as IconName, label: "Deliveries & Fulfilment" },
      { icon: "arrow" as IconName, label: "Returns" },
      { icon: "customers" as IconName, label: "Team Management" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { icon: "reports" as IconName, label: "Reports & Analytics" },
      { icon: "sparkles" as IconName, label: "SellWella AI" },
      { icon: "settings" as IconName, label: "Automation Centre" },
    ],
  },
  {
    label: "Administration",
    items: [
      { icon: "settings" as IconName, label: "Settings & Integrations" },
      { icon: "card" as IconName, label: "Subscription" },
      { icon: "message" as IconName, label: "Help & Support" },
    ],
  },
];

export const routeByLabel: Record<string, string> = {
  Overview: ROUTES.OVERVIEW,
  "Activity Centre": ROUTES.ACTIVITY,
  "Unified Inbox": ROUTES.INBOX,
  "Customers & CRM": ROUTES.CUSTOMERS,
  Orders: ROUTES.ORDERS,
  "Point of Sale": ROUTES.POS,
  "Sales Recovery": ROUTES.SALES_RECOVERY,
  Products: ROUTES.PRODUCTS,
  Inventory: ROUTES.INVENTORY,
  Storefront: ROUTES.STOREFRONT,
  Promotions: ROUTES.PROMOTIONS,
  Payments: ROUTES.PAYMENTS,
  "Payment Links": ROUTES.PAYMENT_LINKS,
  "Quotations & Invoices": ROUTES.INVOICES,
  "Expenses & Accounting": ROUTES.FINANCES,
  "Deliveries & Fulfilment": ROUTES.FULFILMENT,
  Returns: ROUTES.RETURNS,
  "Team Management": ROUTES.TEAM,
  "Reports & Analytics": ROUTES.ANALYTICS,
  "SellWella AI": ROUTES.AI_ASSISTANT,
  "Automation Centre": ROUTES.AUTOMATIONS,
  "Settings & Integrations": ROUTES.SETTINGS,
  Subscription: ROUTES.BILLING,
  "Help & Support": ROUTES.SUPPORT,
};

export const labelByRoute = Object.fromEntries(
  Object.entries(routeByLabel).map(([label, route]) => [route, label]),
);
