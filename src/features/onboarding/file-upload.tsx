"use client";
import { Check, Upload } from "lucide-react";
import { toast } from "sonner";
export function FileUpload({
  label,
  name,
  onChange,
  compact = false,
}: {
  label: string;
  name: string;
  onChange: (name: string) => void;
  compact?: boolean;
}) {
  return (
    <label className={`file-upload ${compact ? "compact" : ""}`}>
      <input
        type="file"
        aria-label={label}
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            onChange("");
            return;
          }
          if (
            !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
            file.size > 5 * 1024 * 1024
          ) {
            toast.error("Choose a PNG, JPG or WebP image under 5 MB.");
            event.target.value = "";
            return;
          }
          onChange(file.name);
        }}
      />
      {name ? (
        <Check size={24} aria-hidden="true" />
      ) : (
        <Upload size={24} aria-hidden="true" />
      )}
      <span>
        <strong>{name || label}</strong>
        <small>Filename saved for this demo; no file is uploaded.</small>
      </span>
    </label>
  );
}
