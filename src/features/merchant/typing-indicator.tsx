import { Ellipsis } from "lucide-react";

export function TypingIndicator({ name }: { name: string }) {
  return (
    <div
      className="message-bubble customer flex items-center gap-2 text-xs text-muted"
      role="status"
    >
      <Ellipsis
        size={20}
        aria-hidden="true"
        className="motion-safe:animate-pulse"
      />
      {name} is typing…
    </div>
  );
}
