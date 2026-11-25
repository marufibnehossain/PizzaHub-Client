export type UserRole = "customer" | "vendor" | "admin";

export type RegistrationRole = Exclude<UserRole, "admin">;

export type SocialProvider = "google" | "github";

export interface RoleTestResponse {
  success?: boolean;
  message: string;
  role?: UserRole;
}