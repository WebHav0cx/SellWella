import { notFound } from "next/navigation";
import { StorefrontShell } from "@/features/storefront/store-shell";
export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ merchantSlug: string }>;
}) {
  const { merchantSlug } = await params;
  if (merchantSlug !== "aminas-fashion") notFound();
  return <StorefrontShell slug={merchantSlug}>{children}</StorefrontShell>;
}
