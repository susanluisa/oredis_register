import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";
import { SocioeconomicStatusType } from "@/lib/types/common-settings-types";

const route = "/api/common/socioeconomicstatus/";

export const fetchSocioeconomicStatuses = async (options?: { auth?: boolean }): Promise<SocioeconomicStatusType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<SocioeconomicStatusType[]>(route, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching socioeconomic statuses:", error);
    throw error;
  }
};

export const createSocioeconomicStatus = async (data: Partial<SocioeconomicStatusType>): Promise<SocioeconomicStatusType> => {
  try {
    const response = await apiPrivateClient.post<SocioeconomicStatusType>(route, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error creating socioeconomic status:", error);
    throw error;
  }
};

export const updateSocioeconomicStatus = async (id: number, data: Partial<SocioeconomicStatusType>): Promise<SocioeconomicStatusType> => {
  try {
    const response = await apiPrivateClient.put<SocioeconomicStatusType>(`${route}${id}/`, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating socioeconomic status:", error);
    throw error;
  }
};

export const deleteSocioeconomicStatus = async (id: number): Promise<SocioeconomicStatusType> => {
  try {
    const response = await apiPrivateClient.delete<SocioeconomicStatusType>(`${route}${id}/`, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting socioeconomic status:", error);
    throw error;
  }
};

