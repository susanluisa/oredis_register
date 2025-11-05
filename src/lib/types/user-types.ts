
export interface RegisterPayloadType {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginPayloadType {
  username: string;
  password: string;
}

export interface AuthTokensType {
  accessToken: string;
  refreshToken?: string;
}


export interface PermissionType {
  id: number;
  code: string;
  description?: string | null;
}

export interface RoleType {
  id: number;
  name: string;
  description?: string | null;
  permissions?: PermissionType[]; 
}

export interface RolePermissionType {
  id: number;
  role: RoleType;
  permission: PermissionType;
}

export type UserRoleChoice =
  | "ADMIN"
  | "STAFF"
  | "VIEWER"
  | "INTERVIEWER"
  | "OMAPED_ADMIN";

export interface UserType {
  id: number;

  username: string;
  email: string;
  first_name: string;
  last_name: string;
  first_surname: string;
  second_surname?: string | null;

  phone_number?: string | null;

  role_choice?: UserRoleChoice | null;
  role?: RoleType | null;
  office?: number | null;

  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;

  last_login?: string | null;
  date_joined?: string;
  created_at: string; // DateTimeField ISO (ej: "2025-10-30T13:45:00Z")
}

export function getUserDisplayName(user: UserType): string {
  let fullName = `${user.first_name} ${user.first_surname}`;
  if (user.second_surname) {
    fullName += ` ${user.second_surname}`;
  }
  return `${fullName} (${user.username})`;
}
