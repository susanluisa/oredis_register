import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";
import { OrganizationType } from "@/lib/types/org-types";

export const fetchOrgs = async (options?: { auth?: boolean }): Promise<OrganizationType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<OrganizationType[]>("/api/organizations/", config);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching Orgs:", error);
    throw error;
  }
};

export const createOrgs = async (data: FormData | Partial<OrganizationType>): Promise<OrganizationType> => {
  try {
    const response = await apiPrivateClient.post<OrganizationType>(
      "/api/organizations/",
      data,
      withAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error("Error creating orgs:", error);
    throw error;
  }
};

export const updateOrgs = async (id: number, data: FormData | Partial<OrganizationType>): Promise<OrganizationType> => {
  try {
    const response = await apiPrivateClient.put<OrganizationType>(
      `/api/organizations/${id}/`,
      data,
      withAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error("Error updating Orgs:", error);
    throw error;
  }
};

export const deleteOrgs = async (id: number): Promise<OrganizationType> => {
  try {
    const response = await apiPrivateClient.delete<OrganizationType>(
      `/api/organizations/${id}/`,
      withAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting Orgs:", error);
    throw error;
  }
};
