import type { FieldError as ValidationError } from "react-hook-form";
export function FieldError({
  error,
  id,
}: {
  error?: ValidationError;
  id: string;
}) {
  return error?.message ? (
    <span id={id} role="alert" className="mt-1 block text-xs text-danger">
      {error.message}
    </span>
  ) : null;
}
