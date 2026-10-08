import { MerchantShell } from "@/features/merchant/shell";
export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MerchantShell>{children}</MerchantShell>;
}
