export function FormField({
  label,
  error,
  hint,
  id,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className={`public-field ${error ? "has-error" : ""}`}>
      <span>{label}</span>
      {children}
      {error ? (
        <small id={`${id}-error`} className="field-error" role="alert">
          {error}
        </small>
      ) : hint ? (
        <small id={`${id}-hint`}>{hint}</small>
      ) : null}
    </label>
  );
}
