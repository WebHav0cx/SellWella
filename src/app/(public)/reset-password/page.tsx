import { ResetPasswordPage } from "@/features/auth/reset-password";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const { demo } = await searchParams;
  return <ResetPasswordPage validDemoLink={demo === "true"} />;
}
