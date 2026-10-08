import { toast } from "sonner";

export async function copyToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success("Payment link copied");
  } catch {
    toast.error("Could not copy the payment link. Please copy it manually.");
  }
}
