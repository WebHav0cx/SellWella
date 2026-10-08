"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Users } from "lucide-react";

import { PublicStatus } from "@/components/public/public-status";
import { SellWellaLogo } from "@/components/common/sellwella-logo";

export function InvitationPage({ token }: { token: string }) {
  const router = useRouter();
  const invalid = token === "invalid";
  const expired = token === "expired";
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="focused-public-page invite-page">
      <SellWellaLogo />
      <div className="focused-card">
        <span className="focused-icon">
          <Users size={28} aria-hidden="true" />
        </span>
        {invalid || expired ? (
          <>
            <PublicStatus
              tone="error"
              title={expired ? "Invitation expired" : "Invitation unavailable"}
            >
              {expired
                ? "Ask the business owner to issue another invitation."
                : "This invitation token could not be validated."}
            </PublicStatus>
            <h1>You cannot join this workspace yet.</h1>
            <Link className="focused-link" href="/login">
              Go to Sign In
            </Link>
          </>
        ) : accepted ? (
          <>
            <PublicStatus tone="success" title="Invitation acknowledged">
              Production membership still requires a server-validated
              invitation.
            </PublicStatus>
            <h1>Continue with your account</h1>
            <p>
              Sign in or create an account using the invited email. You will not
              be asked to create another business.
            </p>
            <button
              className="auth-submit"
              onClick={() => router.push("/login?invite=demo-team")}
            >
              Sign In to Continue
            </button>
            <Link className="focused-link" href="/signup?invite=demo-team">
              Create Account
            </Link>
          </>
        ) : (
          <>
            <span className="invite-label">YOU’VE BEEN INVITED</span>
            <h1>Join Amina’s Fashion</h1>
            <p>
              Amina Okafor invited you to collaborate in an existing SellWella
              workspace.
            </p>
            <div className="invite-details">
              <span>
                Invited email<strong>team.member@example.com</strong>
              </span>
              <span>
                Assigned role<strong>Sales Agent</strong>
              </span>
              <span>
                Status<strong>Pending acceptance</strong>
              </span>
            </div>

            <button className="auth-submit" onClick={() => setAccepted(true)}>
              Accept Invitation
            </button>
            <small className="invite-security">
              A production invitation must be validated by the server.
              Client-side role values are never trusted as membership.
            </small>
          </>
        )}
      </div>
    </div>
  );
}
