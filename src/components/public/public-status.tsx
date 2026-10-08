import { CircleCheck, TriangleAlert, CircleAlert, Info } from "lucide-react";
const icons = {
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
  info: Info,
};
export function PublicStatus({
  tone,
  title,
  children,
}: {
  tone: keyof typeof icons;
  title: string;
  children: React.ReactNode;
}) {
  const Icon = icons[tone];
  return (
    <div
      className={`public-status ${tone}`}
      role={tone === "error" ? "alert" : "status"}
    >
      <Icon size={22} aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </div>
  );
}
