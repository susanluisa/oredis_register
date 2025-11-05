import { RegionType } from "@/lib/types/common-settings-types";
import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";

const route = "/api/common/region/";

export const fetchRegions = async (options?: { auth?: boolean }): Promise<RegionType[]> => {

  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<RegionType[]>(route, config);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching region:", error);
    throw error;
  }
};

export const createRegions = async (data: FormData | Partial<RegionType>): Promise<RegionType> => {
  try {
    const response = await apiPrivateClient.post<RegionType>(
      route,
      data,
      withAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error("Error creating region:", error);
    throw error;
  }
};

export const updateRegions = async (id: number, data: FormData | Partial<RegionType>): Promise<RegionType> => {
  try {
    const response = await apiPrivateClient.put<RegionType>(`${route}${id}/`, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating region:", error);
    throw error;
  }
};

export const deleteRegions = async (id: number): Promise<RegionType> => {
  try {
    const response = await apiPrivateClient.delete<RegionType>(`${route}${id}/`, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting region:", error);
    throw error;
  }
};

export const fetchRegionsByCountry = async (id: string, options?: { auth?: boolean }): Promise<RegionType[]> => {

  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    if (!id || !route) {
      throw new Error("error en Id o ruta.");
    }
    const response = await apiPrivateClient.get<RegionType[]>(`/api/common/country/${id}/regions/`, config);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching region:", error);
    throw error;
  }
};
