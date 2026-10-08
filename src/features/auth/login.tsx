"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { AuthLayout } from "@/components/public/auth-layout";
import { FormField } from "@/components/public/form-field";
import { PasswordField } from "@/components/public/password-field";

import { PublicStatus } from "@/components/public/public-status";

import { saveDemoSession } from "./demo-session";
import { loginSchema, type LoginForm } from "./schemas";
import {
  onboardingComplete,
  readOnboardingProgress,
} from "@/features/onboarding/schema";
export function LoginPage({
  invited = false,
  reason,
  authState,
}: {
  invited?: boolean;
  reason?: string;
  authState?: string;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isReady, isSubmitting: loading },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const sessionNotice = reason;

  const submit = (form: LoginForm) => {
    if (
      !saveDemoSession({
        name: "Demo Merchant",
        email: form.email,
        verified: true,
        demo: true,
        invited,
      })
    ) {
      toast.error("Unable to save demo progress in this browser.");
      return;
    }
    resetField("password");
    toast.success("Demo sign-in complete");
    router.push(
      invited || onboardingComplete(readOnboardingProgress())
        ? "/app"
        : "/onboarding",
    );
  };

  return (
    <AuthLayout
      title="Welcome back to your business."
      description="Pick up where you left off and keep every sale, customer and stock update connected."
    >
      <div className="auth-card">
        <div className="auth-heading">
          <span>WELCOME BACK</span>
          <h2>Welcome back!</h2>
          <p>Sign in to manage your business.</p>
        </div>
        {sessionNotice === "expired" && (
          <PublicStatus tone="warning" title="Session expired">
            Sign in again to continue. Production session handling requires an
            authentication backend.
          </PublicStatus>
        )}
        {authState === "invalid" && (
          <PublicStatus tone="error" title="Unable to sign in">
            The demonstration could not validate those details. Production
            credential checks require an authentication backend.
          </PublicStatus>
        )}
        {authState === "unverified" && (
          <PublicStatus tone="warning" title="Email verification required">
            Complete verification before entering a production workspace.
          </PublicStatus>
        )}

        <form method="post" onSubmit={handleSubmit(submit)} noValidate>
          <FormField
            id="email"
            label="Email address"
            error={errors.email?.message}
          >
            <input
              type="email"
              {...register("email")}
              id="email"
              autoComplete="email"
              placeholder="amina@example.com"
            />
          </FormField>
          <div className="forgot-row">
            <span>Password</span>
            <Link href="/forgot-password">Forgot password?</Link>
          </div>
          <PasswordField
            label=""
            registration={register("password")}
            error={errors.password?.message}
            autoComplete="current-password"
          />
          <button className="auth-submit" disabled={loading || !isReady}>
            {loading ? "Opening demo workspace..." : "Continue in Demo Mode"}
          </button>
        </form>
        <button className="social-auth" disabled>
          Google sign-in not configured
        </button>
        <p className="auth-switch">
          New to SellWella? <Link href="/signup">Create an account</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
