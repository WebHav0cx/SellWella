"use client";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { PaymentsPage } from "./payments";
export function PaymentScreen({
  initialTab,
}: {
  initialTab: "links" | "transactions";
}) {
  const router = useRouter();
  return (
    <PaymentsPage
      initialTab={initialTab}
      onOpenOrder={(order) => router.push(ROUTES.ORDER_DETAIL(order.id))}
    />
  );
}
