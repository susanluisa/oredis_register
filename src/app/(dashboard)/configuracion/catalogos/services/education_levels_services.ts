import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";
import { EducationLevelType } from "@/lib/types/common-settings-types";

const route = "/api/common/educationlevel/";

export const fetchEducationLevels = async (options?: { auth?: boolean }): Promise<EducationLevelType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<EducationLevelType[]>(route, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching education levels:", error);
    throw error;
  }
};

export const createEducationLevel = async (data: Partial<EducationLevelType>): Promise<EducationLevelType> => {
  try {
    const response = await apiPrivateClient.post<EducationLevelType>(route, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error creating education level:", error);
    throw error;
  }
};

export const updateEducationLevel = async (id: number, data: Partial<EducationLevelType>): Promise<EducationLevelType> => {
  try {
    const response = await apiPrivateClient.put<EducationLevelType>(`${route}${id}/`, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating education level:", error);
    throw error;
  }
};

export const deleteEducationLevel = async (id: number): Promise<EducationLevelType> => {
  try {
    const response = await apiPrivateClient.delete<EducationLevelType>(`${route}${id}/`, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting education level:", error);
    throw error;
  }
};

