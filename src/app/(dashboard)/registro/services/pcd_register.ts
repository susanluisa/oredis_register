import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";
import { PCDType } from "@/lib/types/pcd-types";

const route = "/api/pcd/";

export const fetchPCDRecords = async (options?: { auth?: boolean }): Promise<PCDType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<PCDType[]>(route, config);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching Orgs:", error);
    throw error;
  }
};

export const createPCDRecords = async (data: FormData | Partial<PCDType>): Promise<PCDType> => {
  try {
    const response = await apiPrivateClient.post<PCDType>(
      route,
      data,
      withAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error("Error creating orgs:", error);
    throw error;
  }
};

export const updatePCDRecords = async (id: number, data: FormData | Partial<PCDType>): Promise<PCDType> => {
  try {
    const response = await apiPrivateClient.put<PCDType>(
      `${route}${id}/`,
      data,
      withAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error("Error updating Orgs:", error);
    throw error;
  }
};

export const deletePCDRecords = async (id: number): Promise<PCDType> => {
  try {
    const response = await apiPrivateClient.delete<PCDType>(
      `${route}${id}/`,
      withAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting Orgs:", error);
    throw error;
  }
};
