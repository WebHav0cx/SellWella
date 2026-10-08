import Image from "next/image";
import type { Product } from "@/features/merchant/data";
export function ProductImage({ product }: { product: Product }) {
  return product.image ? (
    <Image
      src={product.image}
      alt={product.name}
      width={600}
      height={600}
      sizes="(max-width: 760px) 100vw, 25vw"
    />
  ) : (
    <span className="product-placeholder">{product.name.slice(0, 2)}</span>
  );
}
