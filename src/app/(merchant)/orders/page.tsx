import { OrdersPage } from "@/features/merchant/orders";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const id = Number(order);
  return (
    <OrdersPage
      key={order ?? "list"}
      initialOrderId={Number.isSafeInteger(id) && id > 0 ? id : undefined}
    />
  );
}
