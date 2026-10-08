import { SignupPage } from "@/features/auth/signup";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const { invite } = await searchParams;
  return <SignupPage invited={invite !== undefined} />;
}
