"use client";
import { useState } from "react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

import { PasswordField } from "@/components/public/password-field";

import { PublicStatus } from "@/components/public/public-status";
import { SellWellaLogo } from "@/components/common/sellwella-logo";

import { resetSchema, type ResetForm } from "./schemas";
export function ResetPasswordPage({
  validDemoLink,
}: {
  validDemoLink: boolean;
}) {
  const [complete, setComplete] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isReady, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirm: "" },
  });
  const submit = () => {
    reset();
    setComplete(true);
    toast.success("Password reset Successful");
  };
  return (
    <div className="focused-public-page">
      <SellWellaLogo />
      <div className="focused-card">
        <span className="focused-icon">
          <KeyRound size={28} aria-hidden="true" />
        </span>
        {!validDemoLink ? (
          <>
            <PublicStatus tone="error" title="Reset link unavailable">
              This demonstration reset link is invalid or expired.
            </PublicStatus>
            <h1>Request a new reset link</h1>
            <Link className="auth-submit link-button" href="/forgot-password">
              Return to Password Recovery
            </Link>
          </>
        ) : complete ? (
          <>
            <PublicStatus
              tone="success"
              title="Password reset demonstration complete"
            >
              No credential was stored or changed because authentication is not
              connected.
            </PublicStatus>
            <h1>Your next sign-in is ready.</h1>
            <Link className="auth-submit" href="/login">
              Go to Sign In
            </Link>
          </>
        ) : (
          <>
            <h1>Create a new password</h1>
            <p>Choose a strong password you have not used elsewhere.</p>

            <form method="post" noValidate onSubmit={handleSubmit(submit)}>
              <PasswordField
                label="New password"
                registration={register("password")}
                error={errors.password?.message}
                autoComplete="new-password"
              />
              <small className="password-requirements">
                Use at least eight characters.
              </small>
              <PasswordField
                label="Confirm password"
                registration={register("confirm")}
                error={errors.confirm?.message}
                autoComplete="new-password"
              />
              <button
                className="auth-submit"
                disabled={isSubmitting || !isReady}
              >
                Update Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
