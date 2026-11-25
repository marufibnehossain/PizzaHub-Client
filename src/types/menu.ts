export const MENU_CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet",
  "Sides & Appetizers",
  "Beverages & Desserts",
] as const;

export type MenuCategory =
  (typeof MENU_CATEGORIES)[number];

export type MenuStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "inactive";

export interface MenuItem {
  _id: string;
  vendorId: string;
  itemName: string;
  category: MenuCategory;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: MenuStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuItemInput {
  itemName: string;
  category: MenuCategory;
  description: string;
  price: number;
  location: string;
  images: string[];
}

export type UpdateMenuItemInput =
  Partial<CreateMenuItemInput>;

export interface MenuItemResponse {
  success: boolean;
  message: string;
  data?: MenuItem;
}

export interface MenuItemsResponse {
  success: boolean;
  message: string;
  data: MenuItem[];
}