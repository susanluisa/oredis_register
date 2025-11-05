import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";
import type { Office } from "@/lib/types/office-types";

const route = "/api/office/";

export const fetchOffices = async (options?: { auth?: boolean }): Promise<Office[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<Office[]>(route, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching offices:", error);
    throw error;
  }
};

export const createOffice = async (data: Partial<Office>): Promise<Office> => {
  try {
    const response = await apiPrivateClient.post<Office>(route, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error creating office:", error);
    throw error;
  }
};

export const updateOffice = async (id: number, data: Partial<Office>): Promise<Office> => {
  try {
    const response = await apiPrivateClient.put<Office>(`${route}${id}/`, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating office:", error);
    throw error;
  }
};

export const deleteOffice = async (id: number): Promise<Office> => {
  try {
    const response = await apiPrivateClient.delete<Office>(`${route}${id}/`, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting office:", error);
    throw error;
  }
};

