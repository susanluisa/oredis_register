import { DistrictType } from "@/lib/types/common-settings-types";
import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";

const route = "/api/common/district/";

export const fetchDistricts = async (options?: { auth?: boolean }): Promise<DistrictType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<DistrictType[]>(route, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

export const fetchDistrictsByProvince = async (provinceId: string, options?: { auth?: boolean }): Promise<DistrictType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    if (!provinceId) throw new Error("provinceId requerido");
    const response = await apiPrivateClient.get<DistrictType[]>(`/api/common/province/${provinceId}/districts/`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching districts by province:", error);
    throw error;
  }
};

export const createDistricts = async (data: FormData | Partial<DistrictType>): Promise<DistrictType> => {
  try {
    const response = await apiPrivateClient.post<DistrictType>(route, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error creating district:", error);
    throw error;
  }
};

export const updateDistricts = async (id: number, data: FormData | Partial<DistrictType>): Promise<DistrictType> => {
  try {
    const response = await apiPrivateClient.put<DistrictType>(`${route}${id}/`, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating district:", error);
    throw error;
  }
};

export const deleteDistricts = async (id: number): Promise<DistrictType> => {
  try {
    const response = await apiPrivateClient.delete<DistrictType>(`${route}${id}/`, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting district:", error);
    throw error;
  }
};

