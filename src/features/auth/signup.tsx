"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { AuthLayout } from "@/components/public/auth-layout";
import { FormField } from "@/components/public/form-field";
import { PasswordField } from "@/components/public/password-field";

import { saveDemoSession } from "./demo-session";
import { signupSchema, type SignupForm } from "./schemas";
export function SignupPage({ invited = false }: { invited?: boolean }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    resetField,
    formState: { errors, isReady, isSubmitting: loading },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
      terms: false,
    },
  });
  const password = useWatch({ control, name: "password" }) ?? "";
  const strength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /\d/.test(password),
  ].filter(Boolean).length;

  const submit = (form: SignupForm) => {
    if (
      !saveDemoSession({
        name: form.name.trim(),
        email: form.email,
        verified: false,
        demo: true,
        invited,
      })
    ) {
      toast.error("Unable to save demo progress in this browser.");
      return;
    }
    resetField("password");
    resetField("confirm");
    toast.success("Demo account created");
    router.push(invited ? "/verify-email?invite=demo-team" : "/verify-email");
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-heading">
          <span>
            {invited ? "JOIN AN EXISTING WORKSPACE" : "START YOUR WORKSPACE"}
          </span>
          <h2>Create your account</h2>
          <p>
            {invited
              ? "Use the invited email to continue."
              : "Get started with SellWella."}
          </p>
        </div>

        <form method="post" onSubmit={handleSubmit(submit)} noValidate>
          <FormField id="name" label="Full name" error={errors.name?.message}>
            <input
              {...register("name")}
              id="name"
              aria-describedby="name-error"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              placeholder="Amina Okafor"
            />
          </FormField>
          <FormField
            id="email"
            label="Email address"
            error={errors.email?.message}
          >
            <input
              type="email"
              {...register("email")}
              id="email"
              aria-describedby="email-error"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              placeholder="amina@example.com"
            />
          </FormField>
          <PasswordField
            label="Password"
            registration={register("password")}
            error={errors.password?.message}
            autoComplete="new-password"
          />
          <div className="password-strength">
            <span>
              <i className={strength > 0 ? "active" : ""} />
              <i className={strength > 1 ? "active" : ""} />
              <i className={strength > 2 ? "active" : ""} />
            </span>
            <small>
              {strength < 2
                ? "Use 8+ characters, a number and uppercase letter."
                : strength === 2
                  ? "Good password"
                  : "Strong password"}
            </small>
          </div>
          <PasswordField
            label="Confirm password"
            registration={register("confirm")}
            error={errors.confirm?.message}
            autoComplete="new-password"
          />
          <label className="auth-checkbox">
            <input
              type="checkbox"
              {...register("terms")}
              id="terms"
              aria-invalid={!!errors.terms}
              aria-describedby="terms-error"
            />
            <span>I agree to the Terms of Service and Privacy Notice.</span>
          </label>
          {errors.terms && (
            <small id="terms-error" className="standalone-error" role="alert">
              {errors.terms.message}
            </small>
          )}
          <button className="auth-submit" disabled={loading || !isReady}>
            {loading ? "Creating demo account..." : "Create Account"}
          </button>
        </form>
        <button className="social-auth" disabled>
          Google sign-up not configured
        </button>
        <p className="auth-switch">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
