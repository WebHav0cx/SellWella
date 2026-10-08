"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { FormField } from "./form-field";
export function PasswordField({
  label,
  registration,
  error,
  autoComplete,
}: {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  const id = registration.name;
  return (
    <FormField id={id} label={label || "Password"} error={error}>
      <div className="password-control">
        <input
          {...registration}
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? (
            <EyeOff size={18} aria-hidden="true" />
          ) : (
            <Eye size={18} aria-hidden="true" />
          )}
        </button>
      </div>
    </FormField>
  );
}
