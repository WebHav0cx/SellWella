"use client";
import { useState } from "react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail } from "lucide-react";

import { FormField } from "@/components/public/form-field";

import { PublicStatus } from "@/components/public/public-status";
import { SellWellaLogo } from "@/components/common/sellwella-logo";
import { saveDemoSession, readDemoSession } from "./demo-session";
import { useDemoSession } from "./session-provider";
import { verificationSchema, type VerificationForm } from "./schemas";
export function VerifyEmailPage({
  invited = false,
  expired = false,
}: {
  invited?: boolean;
  expired?: boolean;
}) {
  const email = useDemoSession(
    (state) => state.session?.email ?? "your email address",
  );
  const [state, setState] = useState<"idle" | "success" | "expired">(
    expired ? "expired" : "idle",
  );
  const [resent, setResent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isReady, isSubmitting },
  } = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { code: "" },
  });
  const verify = () => {
    const session = readDemoSession();
    if (!session) {
      toast.error("Create an account or sign in before verifying.");
      return;
    }
    if (!saveDemoSession({ ...session, verified: true })) {
      toast.error("Unable to save verification.");
      return;
    }
    setState("success");
    toast.success(" Verification complete");
  };
  return (
    <div className="focused-public-page">
      <SellWellaLogo />
      <div className="focused-card">
        <span className="focused-icon">
          <Mail size={28} aria-hidden="true" />
        </span>
        {state === "success" ? (
          <>
            <PublicStatus tone="success" title="Demo verification complete">
              No real email service was contacted.
            </PublicStatus>
            <h1>Email verified</h1>
            <p>Continue to set up your business workspace.</p>
            <Link
              className="auth-submit"
              href={invited ? "/app" : "/onboarding"}
            >
              {invited
                ? "Continue to Invited Workspace"
                : "Continue to Business Setup"}
            </Link>
          </>
        ) : (
          <>
            <h1>Verify your email.</h1>
            <p>
              A production account would receive a verification email at{" "}
              <strong>{email}</strong>. Email delivery is not connected in this
              demonstration.
            </p>

            <form method="post" noValidate onSubmit={handleSubmit(verify)}>
              <FormField
                id="code"
                label="Verification code"
                error={errors.code?.message}
                hint="Enter any six digits, or leave blank for demo verification."
              >
                <input
                  id="code"
                  className="verification-code"
                  {...register("code")}
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  aria-invalid={!!errors.code}
                  aria-describedby={errors.code ? "code-error" : "code-hint"}
                />
              </FormField>
              {state === "expired" && (
                <PublicStatus tone="error" title="Code expired">
                  Request another demonstration code.
                </PublicStatus>
              )}
              <button
                className="auth-submit"
                disabled={isSubmitting || !isReady || state === "expired"}
              >
                Continue Verification
              </button>
            </form>
            <button
              className="focused-link"
              onClick={() => {
                setResent(true);
                setState("idle");
                reset();
                toast.info(" Verification code refreshed. No email was sent.");
              }}
            >
              {resent ? "Verification code refreshed" : "Resend verification"}
            </button>
            <Link className="focused-link" href="/signup">
              Change email
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
