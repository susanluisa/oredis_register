import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";
import { KinshipType } from "@/lib/types/common-settings-types";

const route = "/api/common/kinship/";

export const fetchKinships = async (options?: { auth?: boolean }): Promise<KinshipType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<KinshipType[]>(route, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching kinships:", error);
    throw error;
  }
};

export const createKinship = async (data: Partial<KinshipType>): Promise<KinshipType> => {
  try {
    const response = await apiPrivateClient.post<KinshipType>(route, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error creating kinship:", error);
    throw error;
  }
};

export const updateKinship = async (id: number, data: Partial<KinshipType>): Promise<KinshipType> => {
  try {
    const response = await apiPrivateClient.put<KinshipType>(`${route}${id}/`, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating kinship:", error);
    throw error;
  }
};

export const deleteKinship = async (id: number): Promise<KinshipType> => {
  try {
    const response = await apiPrivateClient.delete<KinshipType>(`${route}${id}/`, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting kinship:", error);
    throw error;
  }
};

