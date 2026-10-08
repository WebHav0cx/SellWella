"use client";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { FormField } from "@/components/public/form-field";
import { storeSchema, brandThemes, type StoreForm } from "./schema";
import { useOnboarding } from "./store";
import { BrandPreview, brandClasses } from "./brand-preview";
import { FileUpload } from "./file-upload";
export function StoreStep() {
  const data = useOnboarding((state) => state.data);
  const update = useOnboarding((state) => state.update);
  const {
    register,
    handleSubmit,
    setValue,
    subscribe,
    control,
    formState: { errors },
  } = useForm<StoreForm>({
    resolver: zodResolver(storeSchema),
    defaultValues: data.store,
  });
  const colour = useWatch({ control, name: "colour" });
  const logoName = useWatch({ control, name: "logoName" });
  const coverName = useWatch({ control, name: "coverName" });
  useEffect(
    () =>
      subscribe({
        formState: { values: true },
        callback: ({ values }) =>
          update((current) => ({ ...current, store: values })),
      }),
    [subscribe, update],
  );
  const next = handleSubmit((store) =>
    update((current) => ({ ...current, store, step: 3 })),
  );
  return (
    <form
      className="onboarding-card store-setup-layout"
      noValidate
      onSubmit={next}
    >
      <div className="store-setup-form">
        <FileUpload
          label="Business logo"
          name={logoName ?? ""}
          onChange={(name) => setValue("logoName", name)}
        />
        <FormField
          id="slug"
          label="Store URL"
          error={errors.slug?.message}
          hint="This preview does not register a public domain."
        >
          <div className="slug-control">
            <span>sellwella.demo/store/</span>
            <input
              id="slug"
              {...register("slug", {
                setValueAs: (value) =>
                  typeof value === "string"
                    ? value.toLowerCase().replace(/\s+/g, "-")
                    : value,
              })}
              aria-invalid={!!errors.slug}
              aria-describedby={errors.slug ? "slug-error" : "slug-hint"}
            />
          </div>
        </FormField>
        <FormField
          id="description"
          label="Store description"
          error={errors.description?.message}
        >
          <textarea id="description" {...register("description")} />
        </FormField>
        <fieldset className="brand-colour-picker">
          <legend>Brand colour</legend>
          {brandThemes.map((theme) => (
            <button
              type="button"
              key={theme}
              aria-label={`${theme} brand colour`}
              aria-pressed={colour === theme}
              className={brandClasses[theme]}
              onClick={() => setValue("colour", theme)}
            >
              {colour === theme && <Check size={18} aria-hidden="true" />}
            </button>
          ))}
        </fieldset>
        <FileUpload
          compact
          label="Cover image (optional)"
          name={coverName ?? ""}
          onChange={(name) => setValue("coverName", name)}
        />
      </div>
      <BrandPreview data={data} />
      <div className="onboarding-footer full">
        <button
          type="button"
          className="onboarding-back"
          onClick={() => update((current) => ({ ...current, step: 1 }))}
        >
          <ArrowLeft size={18} aria-hidden="true" /> Back
        </button>
        <div>
          <button type="button" className="onboarding-skip" onClick={next}>
            Skip optional branding
          </button>
          <button type="submit" className="onboarding-next">
            Continue <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </form>
  );
}
