"use client";

import { authClient } from "../../lib/auth-client";
import { Button } from "../../components/ui/button";
import type { UserRole, RoleTestResponse } from "../../types/auth";
import type { CreateMenuItemInput, MenuItemResponse, MenuItemsResponse } from "../../types/menu";


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

const testRole = async (
  role: UserRole
): Promise<void> => {
  try {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      console.error("Failed to retrieve JWT.");
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/test-${role}`,
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    );

    const result: RoleTestResponse = await res.json();

    console.log(`${role} endpoint status:`, res.status);
    console.log("Response:", result);
  } catch (error: unknown) {
    console.error("Role test failed:", error);
  }
};

const testCreateMenuItem = async (): Promise<void> => {
    try {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
            console.error("Failed to retrieve JWT.");
            return;
        }

        const menuItem: CreateMenuItemInput = {
            itemName: "Classic Margherita",
            category: "Classic Pizzas",
            description:
                "Fresh mozzarella, tomato sauce and basil on a traditional pizza crust.",
            price: 650,
            location: "Chattogram",
            images: [
                "https://example.com/margherita.jpg",
            ],
        };

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/menu-items`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${data.token}`,
                },
                body: JSON.stringify(menuItem),
            }
        );

        const result: MenuItemResponse = await res.json();

        console.log("Status:", res.status);
        console.log("Response:", result);
    } catch (error: unknown) {
        console.error("Create menu item test failed:", error);
    }
};

const testGetMyMenuItems = async (): Promise<void> => {
    try {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
            console.error("Failed to retrieve JWT.");
            return;
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/menu-items/my-items`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${data.token}`,
                },
            }
        );

        const result: MenuItemsResponse = await res.json();

        console.log("Status:", res.status);
        console.log("Response:", result);

        if (res.ok && result.success) {
            console.table(result.data);
        }

    } catch (error: unknown) {
        console.error("Get menu items test failed:", error);
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
<p>Role: {session?.user.role}</p>
<div className="flex flex-wrap gap-3">
  <Button
    variant="outline"
    onClick={() => testRole("admin")}
  >
    Test Admin API
  </Button>

  <Button
    variant="outline"
    onClick={() => testRole("vendor")}
  >
    Test Vendor API
  </Button>

  <Button
    variant="outline"
    onClick={() => testRole("customer")}
  >
    Test Customer API
  </Button>
  <Button
    variant="outline"
    onClick={testCreateMenuItem}
>
    Test Create Menu Item
</Button>
<Button
    variant="outline"
    onClick={testGetMyMenuItems}
>
    Test Get My Menu Items
</Button>
</div>
    </div>
  );
  
}