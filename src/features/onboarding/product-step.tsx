"use client";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "@/components/public/form-field";
import { useMerchantStore } from "@/features/merchant/store";
import {
  firstProductSchema,
  businessCategories,
  type FirstProductForm,
} from "./schema";
import { useOnboarding } from "./store";
import { FileUpload } from "./file-upload";
export function ProductStep() {
  const data = useOnboarding((state) => state.data);
  const update = useOnboarding((state) => state.update);
  const products = useMerchantStore((state) => state.products);
  const setProducts = useMerchantStore((state) => state.setProducts);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FirstProductForm>({
    resolver: zodResolver(firstProductSchema),
    defaultValues: {
      name: "",
      price: "",
      cost: "",
      stock: "10",
      category: data.business.category || "Fashion & Accessories",
      description: "",
      imageName: "",
    },
  });
  const imageName = useWatch({ control, name: "imageName" });
  const submit = (product: FirstProductForm) => {
    const id = Math.max(0, ...products.map((item) => item.id)) + 1;
    setProducts((current) => [
      {
        id,
        name: product.name.trim(),
        category: product.category,
        sku: `ONB-${String(id).padStart(3, "0")}`,
        price: Number(product.price),
        cost: Number(product.cost || 0),
        onHand: Number(product.stock),
        reserved: 0,
        threshold: 3,
        published: true,
        image: "",
        description: product.description,
        imageName: product.imageName,
      },
      ...current,
    ]);
    update((current) => ({
      ...current,
      addedProductIds: [...current.addedProductIds, id],
      step: 4,
    }));
    toast.success("Product added to your catalogue");
  };
  return (
    <form
      className="onboarding-card product-setup-layout"
      noValidate
      onSubmit={handleSubmit(submit)}
    >
      <FileUpload
        label="Add a product photo"
        name={imageName ?? ""}
        onChange={(name) => setValue("imageName", name)}
      />
      <div className="product-setup-form">
        {(["name", "price", "cost", "stock"] as const).map((name) => (
          <FormField
            key={name}
            id={`product-${name}`}
            label={
              {
                name: "Product name",
                price: "Selling price (₦)",
                cost: "Cost price (₦), optional",
                stock: "Opening quantity",
              }[name]
            }
            error={errors[name]?.message}
          >
            <input
              id={`product-${name}`}
              type={name === "name" ? "text" : "number"}
              min={name === "name" ? undefined : 0}
              {...register(name)}
              aria-invalid={!!errors[name]}
              aria-describedby={`product-${name}-error`}
            />
          </FormField>
        ))}
        <FormField
          id="product-category"
          label="Category"
          error={errors.category?.message}
        >
          <select id="product-category" {...register("category")}>
            {businessCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </FormField>
        <FormField
          id="product-description"
          label="Description"
          error={errors.description?.message}
        >
          <textarea id="product-description" {...register("description")} />
        </FormField>
      </div>
      <div className="onboarding-footer full">
        <button
          type="button"
          className="onboarding-back"
          onClick={() => update((current) => ({ ...current, step: 2 }))}
        >
          <ArrowLeft size={18} aria-hidden="true" /> Back
        </button>
        <div>
          <button
            type="button"
            className="onboarding-skip"
            onClick={() => update((current) => ({ ...current, step: 4 }))}
          >
            Skip for now
          </button>
          <button
            className="onboarding-next"
            type="submit"
            disabled={isSubmitting}
          >
            Add Product & Continue <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </form>
  );
}
