"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  checkoutSchema,
  type CheckoutForm,
} from "@/features/merchant/connected-schemas";
import { useMerchantStore } from "@/features/merchant/store";
import { FieldError } from "@/components/ui/field-error";
import { formatMoney } from "@/lib/format-money";
import { useCartDetails, useStoreCart } from "./cart-store";
import { StoreOrderSummary } from "./order-summary";
export function StoreCheckout() {
  const router = useRouter();
  const slug = useStoreCart((state) => state.slug);
  const clear = useStoreCart((state) => state.clear);
  const createOrder = useMerchantStore((state) => state.createOrder);
  const { lines, subtotal } = useCartDetails();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      delivery: "Home delivery",
    },
  });
  const delivery = useWatch({ control, name: "delivery" });
  const deliveryFee = delivery === "Store pickup" ? 0 : 2500;
  const submit = (values: CheckoutForm) => {
    const result = createOrder({
      source: "Storefront",
      customer: {
        name: values.name,
        phone: values.phone,
        email: values.email,
        location: values.address,
      },
      items: lines.map((line) => ({
        productId: line.productId,
        quantity: line.quantity,
        variant: line.variant,
      })),
      deliveryFee: values.delivery === "Store pickup" ? 0 : 2500,
      deliveryMethod: values.delivery,
      mode: "link",
    });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    clear();
    toast.success("Order reserved");
    router.push(`/store/${slug}/confirmation/${result.order.id}`);
  };
  return (
    <main className="store-checkout-layout">
      <form
        className="store-checkout-form"
        noValidate
        onSubmit={handleSubmit(submit)}
      >
        <Link className="store-back" href={`/store/${slug}/cart`}>
          <ArrowLeft size={16} aria-hidden="true" /> Back to bag
        </Link>
        <h1>Checkout</h1>
        <div className="store-form-section">
          <h2>Contact</h2>
          <div>
            {(["name", "phone"] as const).map((name) => (
              <label key={name}>
                {name === "name" ? "Full name" : "Phone number"}
                <input
                  {...register(name)}
                  autoComplete={name === "name" ? "name" : "tel"}
                  aria-invalid={!!errors[name]}
                  aria-describedby={`${name}-error`}
                />
                <FieldError error={errors[name]} id={`${name}-error`} />
              </label>
            ))}
          </div>
          <label>
            Email <span>Optional</span>
            <input
              type="email"
              autoComplete="email"
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
            />
            <FieldError error={errors.email} id="email-error" />
          </label>
        </div>
        <div className="store-form-section">
          <h2>Delivery</h2>
          <div className="delivery-options">
            {(["Home delivery", "Store pickup"] as const).map((method) => (
              <button
                type="button"
                key={method}
                aria-pressed={delivery === method}
                className={delivery === method ? "active" : ""}
                onClick={() => setValue("delivery", method)}
              >
                {method}
                <small>
                  {method === "Store pickup" ? "Free" : formatMoney(2500)}
                </small>
              </button>
            ))}
          </div>
          <label>
            {delivery === "Store pickup"
              ? "Pickup contact details"
              : "Delivery address"}
            <input
              {...register("address")}
              aria-invalid={!!errors.address}
              aria-describedby="address-error"
              placeholder={
                delivery === "Store pickup"
                  ? "Pickup contact details"
                  : "Street, area and city"
              }
            />
            <FieldError error={errors.address} id="address-error" />
          </label>
        </div>
        <div className="demo-payment-box">
          <strong>Payment</strong>
          <p>
            This checkout creates a order and reserves stock. No money is
            collected; confirm payment on the next screen.
          </p>
        </div>
        {!lines.length && (
          <p className="store-error" role="alert">
            Your bag is empty. Add a product before checkout.
          </p>
        )}
        <button
          className="store-primary"
          disabled={!lines.length || isSubmitting}
          type="submit"
        >
          Place order · {formatMoney(subtotal + deliveryFee)}
        </button>
      </form>
      <StoreOrderSummary
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        lines={lines}
      />
    </main>
  );
}
