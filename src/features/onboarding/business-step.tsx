"use client";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, Plus, Store } from "lucide-react";
import { FormField } from "@/components/public/form-field";
import { useOnboarding } from "./store";
import {
  businessSchema,
  businessCategories,
  salesChannels,
  type BusinessForm,
} from "./schema";
export function BusinessStep() {
  const data = useOnboarding((state) => state.data);
  const update = useOnboarding((state) => state.update);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    subscribe,
    formState: { errors },
  } = useForm<BusinessForm>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      ...data.business,
      category: businessCategories.find(
        (name) => name === data.business.category,
      ),
    },
  });
  const category = useWatch({ control, name: "category" });
  const channels = useWatch({ control, name: "channels" }) ?? [];
  useEffect(
    () =>
      subscribe({
        formState: { values: true },
        callback: ({ values }) =>
          update((current) => ({
            ...current,
            business: { ...values, category: values.category ?? "" },
          })),
      }),
    [subscribe, update],
  );
  return (
    <form
      className="onboarding-card"
      noValidate
      onSubmit={handleSubmit((business) =>
        update((current) => ({ ...current, business, step: 2 })),
      )}
    >
      <div className="onboarding-form-grid">
        {(["name", "phone", "location"] as const).map((name) => (
          <FormField
            key={name}
            id={`business-${name}`}
            label={
              {
                name: "Business name",
                phone: "Business phone",
                location: "Business location",
              }[name]
            }
            error={errors[name]?.message}
          >
            <input
              id={`business-${name}`}
              {...register(name)}
              aria-invalid={!!errors[name]}
              aria-describedby={`business-${name}-error`}
            />
          </FormField>
        ))}
        <FormField id="business-type" label="Business type">
          <select id="business-type" {...register("type")}>
            {[
              "Sole Proprietor",
              "Registered Business",
              "Partnership",
              "Limited Company",
              "Other",
            ].map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </FormField>
      </div>
      <fieldset className="onboarding-group">
        <legend>What type of business do you run?</legend>
        <p>Choose the closest category.</p>
        <input type="hidden" {...register("category")} />
        <div className="category-selector">
          {businessCategories.map((name) => (
            <button
              type="button"
              aria-pressed={category === name}
              className={category === name ? "active" : ""}
              key={name}
              onClick={() =>
                setValue("category", name, { shouldValidate: true })
              }
            >
              <Store size={22} aria-hidden="true" />
              <strong>{name}</strong>
            </button>
          ))}
        </div>
        {errors.category && (
          <small role="alert" className="onboarding-error">
            {errors.category.message}
          </small>
        )}
      </fieldset>
      <fieldset className="onboarding-group">
        <legend>Where do you currently sell?</legend>
        <p>Select all channels that apply.</p>
        <div className="channel-selector">
          {salesChannels.map((channel) => (
            <button
              type="button"
              key={channel}
              aria-pressed={channels.includes(channel)}
              className={channels.includes(channel) ? "active" : ""}
              onClick={() =>
                setValue(
                  "channels",
                  channels.includes(channel)
                    ? channels.filter((item) => item !== channel)
                    : [...channels, channel],
                  { shouldValidate: true },
                )
              }
            >
              {channels.includes(channel) ? (
                <Check size={16} aria-hidden="true" />
              ) : (
                <Plus size={16} aria-hidden="true" />
              )}
              {channel}
            </button>
          ))}
        </div>
        {errors.channels && (
          <small role="alert" className="onboarding-error">
            {errors.channels.message}
          </small>
        )}
      </fieldset>
      <div className="onboarding-footer">
        <span />
        <button type="submit" className="onboarding-next">
          Continue <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
