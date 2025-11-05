import { apiPrivateClient, apiPublicClient, withAuthHeaders } from "@/lib/httpCommon";
import type { AuthTokensType, LoginPayloadType, RegisterPayloadType } from "@/lib/types/user-types";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export async function register(data: RegisterPayloadType) {
  const res = await apiPublicClient.post("/api/auth/register/", data);
  return res.data as { user: any };
}

export async function login(data: LoginPayloadType) {
  const res = await apiPublicClient.post<any>("/api/auth/login/", data);
  const access = res.data?.accessToken || res.data?.access || res.data?.token || res.data?.access_token;
  const refresh = res.data?.refreshToken || res.data?.refresh || res.data?.refresh_token;

  if (typeof window !== "undefined") {
    if (access) {
      localStorage.setItem(ACCESS_TOKEN_KEY, access);
      apiPrivateClient.defaults.headers.common.Authorization = `Bearer ${access}`;
    }
    if (refresh) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    }
  }

  return res.data as AuthTokensType;
}
export async function refresh() {
  const refreshToken = typeof window !== "undefined" ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;
  if (!refreshToken) throw new Error("No hay refresh token");
  const res = await apiPublicClient.post<any>("/api/auth/refresh/", { refresh: refreshToken });
  const access = res.data?.accessToken || res.data?.access || res.data?.token || res.data?.access_token;
  if (typeof window !== "undefined" && access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    apiPrivateClient.defaults.headers.common.Authorization = `Bearer ${access}`;
  }
  return res.data as AuthTokensType;
}

export async function me<T = any>() {
  const res = await apiPrivateClient.get<T>("/api/auth/me/", withAuthHeaders());
  return res.data;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
