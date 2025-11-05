import { DocumentIdType } from "@/lib/types/common-settings-types";
import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";

const route = "/api/common/document-id-types/";

export const fetchDocumentTypes = async (options?: { auth?: boolean }): Promise<DocumentIdType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<DocumentIdType[]>(route, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching document types:", error);
    throw error;
  }
};

export const createDocumentType = async (data: FormData | Partial<DocumentIdType>): Promise<DocumentIdType> => {
  try {
    const response = await apiPrivateClient.post<DocumentIdType>(route, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error creating document type:", error);
    throw error;
  }
};

export const updateDocumentType = async (id: number, data: FormData | Partial<DocumentIdType>): Promise<DocumentIdType> => {
  try {
    const response = await apiPrivateClient.put<DocumentIdType>(`${route}${id}/`, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating document type:", error);
    throw error;
  }
};

export const deleteDocumentType = async (id: number): Promise<DocumentIdType> => {
  try {
    const response = await apiPrivateClient.delete<DocumentIdType>(`${route}${id}/`, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting document type:", error);
    throw error;
  }
};

