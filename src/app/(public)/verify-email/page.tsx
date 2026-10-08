import { VerifyEmailPage } from "@/features/auth/verification";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string; expired?: string }>;
}) {
  const { invite, expired } = await searchParams;
  return (
    <VerifyEmailPage
      invited={invite !== undefined}
      expired={expired === "true"}
    />
  );
}
