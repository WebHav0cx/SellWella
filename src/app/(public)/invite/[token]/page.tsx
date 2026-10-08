import { InvitationPage } from "@/features/auth/invitation";
export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return <InvitationPage token={(await params).token} />;
}
