import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import { formatMoney } from "@/lib/format-money";
import type { Product } from "@/features/merchant/data";
export function StoreProductCard({
  product,
  slug,
}: {
  product: Product;
  slug: string;
}) {
  const available = product.onHand - product.reserved;
  return (
    <article className="store-product-card">
      <Link
        className="store-product-image"
        href={`/store/${slug}/product/${product.id}`}
      >
        <ProductImage product={product} />
        {available <= product.threshold && (
          <span>{available > 0 ? `Only ${available} left` : "Sold out"}</span>
        )}
      </Link>
      <div>
        <span>{product.category}</span>
        <Link href={`/store/${slug}/product/${product.id}`}>
          {product.name}
        </Link>
        <strong>{formatMoney(product.price)}</strong>
        <small>{available > 0 ? "Available" : "Sold out"}</small>
      </div>
    </article>
  );
}
