import { LoginPage } from "@/features/auth/login";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string; reason?: string; state?: string }>;
}) {
  const { invite, reason, state } = await searchParams;
  return (
    <LoginPage
      invited={invite !== undefined}
      reason={reason}
      authState={state}
    />
  );
}
