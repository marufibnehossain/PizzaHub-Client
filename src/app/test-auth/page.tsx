"use client";

import { authClient } from "../../lib/auth-client";

export default function TestAuthPage() {
  const {
    data: session,
    isPending,
    error,
  } = authClient.useSession();

  if (isPending) {
    return <div>Loading session...</div>;
  }

  if (error) {
    return <div>Auth error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Authentication Test</h1>

      {session ? (
        <p>Logged in as: {session.user.email}</p>
      ) : (
        <p>No user is currently logged in.</p>
      )}
    </div>
  );
}