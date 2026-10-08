import Link from "next/link";
import Image from "next/image";
export function SellWellaLogo({ light = false }: { light?: boolean }) {
  return (
    <Link
      className={`public-logo ${light ? "light" : ""}`}
      href="/"
      aria-label="SellWella home"
    >
      <Image src="/sellwella-mark.svg" alt="" width={40} height={40} priority />
      <strong>SellWella</strong>
    </Link>
  );
}
