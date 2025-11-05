import { ProvinceType } from "@/lib/types/common-settings-types";
import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";

const route = "/api/common/province/";

export const fetchProvinces = async (options?: { auth?: boolean }): Promise<ProvinceType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<ProvinceType[]>(route, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

export const fetchProvincesByRegion = async (regionId: string, options?: { auth?: boolean }): Promise<ProvinceType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    if (!regionId) throw new Error("regionId requerido");
    const response = await apiPrivateClient.get<ProvinceType[]>(`/api/common/region/${regionId}/provinces/`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces by region:", error);
    throw error;
  }
};

export const createProvinces = async (data: FormData | Partial<ProvinceType>): Promise<ProvinceType> => {
  try {
    const response = await apiPrivateClient.post<ProvinceType>(route, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error creating province:", error);
    throw error;
  }
};

export const updateProvinces = async (id: number, data: FormData | Partial<ProvinceType>): Promise<ProvinceType> => {
  try {
    const response = await apiPrivateClient.put<ProvinceType>(`${route}${id}/`, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating province:", error);
    throw error;
  }
};

export const deleteProvinces = async (id: number): Promise<ProvinceType> => {
  try {
    const response = await apiPrivateClient.delete<ProvinceType>(`${route}${id}/`, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting province:", error);
    throw error;
  }
};

