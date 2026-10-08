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
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(merchantSlug) ||
    merchantSlug.length < 3 ||
    merchantSlug.length > 40
  )
    notFound();
  return <StorefrontShell slug={merchantSlug}>{children}</StorefrontShell>;
}
