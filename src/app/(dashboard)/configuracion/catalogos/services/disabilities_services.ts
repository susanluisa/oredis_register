import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";
import { DisabilityType } from "@/lib/types/pcd-types";

const route = "/api/pcd/disabilities/";

export const fetchDisabilities = async (options?: { auth?: boolean }): Promise<DisabilityType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<DisabilityType[]>(route, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching disabilities:", error);
    throw error;
  }
};

export const createDisability = async (data: FormData | Partial<DisabilityType>): Promise<DisabilityType> => {
  try {
    const response = await apiPrivateClient.post<DisabilityType>(route, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error creating disability:", error);
    throw error;
  }
};

export const updateDisability = async (id: number, data: FormData | Partial<DisabilityType>): Promise<DisabilityType> => {
  try {
    const response = await apiPrivateClient.put<DisabilityType>(`${route}${id}/`, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating disability:", error);
    throw error;
  }
};

export const deleteDisability = async (id: number): Promise<DisabilityType> => {
  try {
    const response = await apiPrivateClient.delete<DisabilityType>(`${route}${id}/`, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting disability:", error);
    throw error;
  }
};

