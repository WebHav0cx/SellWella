import {
  MessageSquare,
  ShoppingBag,
  Package,
  Store,
  CreditCard,
  ScanLine,
  Truck,
  ChartColumn,
  Sparkles,
  Workflow,
} from "lucide-react";
const icons = [
  MessageSquare,
  ShoppingBag,
  Package,
  Store,
  CreditCard,
  ScanLine,
  Truck,
  ChartColumn,
  Sparkles,
  Workflow,
];
export function FeatureIcon({ index }: { index: number }) {
  const Icon = icons[index] ?? Package;
  return <Icon size={24} aria-hidden="true" />;
}
