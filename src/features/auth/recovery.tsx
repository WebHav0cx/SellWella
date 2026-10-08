"use client";
import { useState } from "react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";

import { FormField } from "@/components/public/form-field";

import { PublicStatus } from "@/components/public/public-status";
import { SellWellaLogo } from "@/components/common/sellwella-logo";

import { recoverySchema, type RecoveryForm } from "./schemas";
export function ForgotPasswordPage() {
  const [complete, setComplete] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isReady, isSubmitting },
  } = useForm<RecoveryForm>({
    resolver: zodResolver(recoverySchema),
    defaultValues: { email: "" },
  });
  const submit = () => {
    setComplete(true);
    toast.info("Password recovery request recorded. No email was sent.");
  };
  return (
    <div className="focused-public-page">
      <SellWellaLogo />
      <div className="focused-card">
        <span className="focused-icon">
          <Mail size={28} aria-hidden="true" />
        </span>
        {complete ? (
          <>
            <PublicStatus
              tone="info"
              title="Request recorded for demonstration"
            >
              If an account exists, a production system would send reset
              instructions. No email was sent.
            </PublicStatus>
            <h1>Check your next step</h1>
            <p>
              Use the demonstration reset page to review the intended password
              flow.
            </p>
            <Link
              className="auth-submit link-button"
              href="/reset-password?demo=true"
            >
              Open Reset
            </Link>
            <Link className="focused-link" href="/login">
              Back to Sign In
            </Link>
          </>
        ) : (
          <>
            <h1>Forgot your password?</h1>
            <p>
              Enter your email address and we’ll prepare the next recovery step.
            </p>

            <form method="post" noValidate onSubmit={handleSubmit(submit)}>
              <FormField
                id="email"
                label="Email address"
                error={errors.email?.message}
              >
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                  placeholder="amina@example.com"
                />
              </FormField>
              <button
                className="auth-submit"
                disabled={isSubmitting || !isReady}
              >
                Send Reset Instructions
              </button>
            </form>
            <Link className="focused-link" href="/login">
              <ArrowLeft size={16} aria-hidden="true" /> Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
