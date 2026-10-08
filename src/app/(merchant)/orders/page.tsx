import { OrdersPage } from "@/features/merchant/orders";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; create?: string }>;
}) {
  const { order, create } = await searchParams;
  const id = Number(order);
  return (
    <OrdersPage
      key={`${order ?? "list"}-${create ?? ""}`}
      initialCreating={create === "true"}
      initialOrderId={Number.isSafeInteger(id) && id > 0 ? id : undefined}
    />
  );
}
