import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";
import { OccupationType } from "@/lib/types/common-settings-types";

const route = "/api/common/occupation/";

export const fetchOccupations = async (options?: { auth?: boolean }): Promise<OccupationType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<OccupationType[]>(route, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching occupations:", error);
    throw error;
  }
};

export const createOccupation = async (data: Partial<OccupationType>): Promise<OccupationType> => {
  try {
    const response = await apiPrivateClient.post<OccupationType>(route, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error creating occupation:", error);
    throw error;
  }
};

export const updateOccupation = async (id: number, data: Partial<OccupationType>): Promise<OccupationType> => {
  try {
    const response = await apiPrivateClient.put<OccupationType>(`${route}${id}/`, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating occupation:", error);
    throw error;
  }
};

export const deleteOccupation = async (id: number): Promise<OccupationType> => {
  try {
    const response = await apiPrivateClient.delete<OccupationType>(`${route}${id}/`, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting occupation:", error);
    throw error;
  }
};

