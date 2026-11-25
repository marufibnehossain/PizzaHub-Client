"use client";

import { authClient } from "../../lib/auth-client";
import { Button } from "../../components/ui/button";

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

  const testProtectedRoute = async () => {
  try {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      console.error("Failed to retrieve JWT.");
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/test-protected`,
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    );

    const result = await res.json();

    console.log("Status:", res.status);
    console.log("Response:", result);
  } catch (error) {
    console.error("Protected request failed:", error);
  }
};

  return (
    <div>
      <h1>Authentication Test</h1>

      {session ? (
        <p>Logged in as: {session.user.email}</p>
      ) : (
        <p>No user is currently logged in.</p>
      )}
      <Button onClick={testProtectedRoute}>
  Test Protected API
</Button>
    </div>
  );
}