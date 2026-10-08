import { notFound } from "next/navigation";
import { StoreProductDetails } from "@/features/storefront/product-details";
export default async function Page({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const value = Number((await params).productId);
  if (!Number.isSafeInteger(value) || value < 1) notFound();
  return <StoreProductDetails productId={value} />;
}
