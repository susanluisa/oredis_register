import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";
import { OptionType } from "@/lib/types/survey-types";

const route = "/api/pcd/options/";

export const fetchOptions = async (options?: { auth?: boolean }): Promise<OptionType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<OptionType[]>(route, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching Options:", error);
    throw error;
  }
};

export const createOption = async (data: Partial<OptionType>): Promise<OptionType> => {
  try {
    const response = await apiPrivateClient.post<OptionType>(route, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error creating Option:", error);
    throw error;
  }
};

export const updateOption = async (id: number, data: Partial<OptionType>): Promise<OptionType> => {
  try {
    const response = await apiPrivateClient.put<OptionType>(`${route}${id}/`, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating Option:", error);
    throw error;
  }
};

export const deleteOption = async (id: number): Promise<OptionType> => {
  try {
    const response = await apiPrivateClient.delete<OptionType>(`${route}${id}/`, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting Option:", error);
    throw error;
  }
};

