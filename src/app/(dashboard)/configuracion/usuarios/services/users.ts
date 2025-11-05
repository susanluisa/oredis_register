import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";
import type { UserType } from "@/lib/types/user-types";

const BASE = "/auth/users"; // adjust if your backend exposes another path

export const fetchUsers = async (options?: { auth?: boolean }): Promise<UserType[]> => {
  const config = options?.auth ? withAuthHeaders() : undefined;
  const { data } = await apiPrivateClient.get<UserType[]>(`${BASE}/`, config);
  return data;
};

export const createUser = async (payload: Partial<UserType> & { password?: string }): Promise<UserType> => {
  const { data } = await apiPrivateClient.post<UserType>(`${BASE}/`, payload, withAuthHeaders());
  return data;
};

export const updateUser = async (id: number, payload: Partial<UserType>): Promise<UserType> => {
  const { data } = await apiPrivateClient.put<UserType>(`${BASE}/${id}/`, payload, withAuthHeaders());
  return data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiPrivateClient.delete(`${BASE}/${id}/`, withAuthHeaders());
};

