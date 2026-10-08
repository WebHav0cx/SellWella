"use client";
import type { BusinessOrder } from "./data";
import { formatMoney } from "@/lib/format-money";
import { Icon } from "@/components/ui/icon";
export function SaleReceipt({
  order,
  onNewSale,
  onViewOrder,
}: {
  order: BusinessOrder;
  onNewSale: () => void;
  onViewOrder: (id: number) => void;
}) {
  return (
    <div className="pos-success">
      <Icon name="store" size={32} />
      <p>Sale completed</p>
      <h1>{formatMoney(order.total)}</h1>
      <strong>{order.number}</strong>
      <div>
        <p>
          Payment<strong>{order.paymentMethod}</strong>
        </p>
        <p>
          Items
          <strong>
            {order.items.reduce((sum, item) => sum + item.quantity, 0)}
          </strong>
        </p>
        <p>
          Stock<strong>Updated</strong>
        </p>
      </div>
      <button onClick={() => window.print()}>Print receipt</button>
      <button onClick={() => onNewSale()}>New sale</button>
      <button onClick={() => onViewOrder(order.id)}>View order</button>
    </div>
  );
}
