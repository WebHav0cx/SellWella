import { toast } from "sonner";

export async function copyToClipboard(value: string, label = "Payment link") {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  } catch {
    toast.error(
      `Could not copy ${label.toLowerCase()}. Please copy it manually.`,
    );
  }
}
