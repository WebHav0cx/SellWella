import { notFound } from "next/navigation";
import { StoreConfirmation } from "@/features/storefront/confirmation";
export default async function Page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const value = Number((await params).orderId);
  if (!Number.isSafeInteger(value) || value < 1) notFound();
  return <StoreConfirmation orderId={value} />;
}
