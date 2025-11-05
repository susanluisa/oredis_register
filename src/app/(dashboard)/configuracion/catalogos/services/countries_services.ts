import { CountryType } from "@/lib/types/common-settings-types";
import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";

const route = "/api/common/country/";

export const fetchCountries = async (options?: { auth?: boolean }): Promise<CountryType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<CountryType[]>(route, config);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching country:", error);
    throw error;
  }
};

export const createCountries = async (data: FormData | Partial<CountryType>): Promise<CountryType> => {
  try {
    const response = await apiPrivateClient.post<CountryType>(route, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error creating country:", error);
    throw error;
  }
};

export const updateCountries = async (id: number, data: FormData | Partial<CountryType>): Promise<CountryType> => {
  try {
    const response = await apiPrivateClient.put<CountryType>(`${route}${id}/`, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating country:", error);
    throw error;
  }
};

export const deleteCountries = async (id: number): Promise<CountryType> => {
  try {
    const response = await apiPrivateClient.delete<CountryType>(`${route}${id}/`, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting country:", error);
    throw error;
  }
};
