import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { Icon } from "@/components/ui/icon";
export function PlannedModule({ name }: { name: string }) {
  return (
    <div className="planned-module">
      <span>
        <Icon name="sparkles" size={25} />
      </span>
      <p className="module-kicker">SellWella workspace</p>
      <h1>{name}</h1>
      <p>
        This module is next in the connected commerce rollout. Products and
        Inventory are now live and share the same catalogue data.
      </p>
      <Link
        href={ROUTES.OVERVIEW}
        className="secondary-button inline-flex items-center"
      >
        Back to overview
      </Link>
    </div>
  );
}
