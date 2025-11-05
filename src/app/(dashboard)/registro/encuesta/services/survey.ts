import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";
import { SurveyPCDType } from "@/lib/types/survey-types";

export const fetchSurveys = async (options?: { auth?: boolean }): Promise<SurveyPCDType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<SurveyPCDType[]>("/api/surveys/", config);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching Surveys:", error);
    throw error;
  }
};

export const createSurveys = async (data: FormData | Partial<SurveyPCDType>): Promise<SurveyPCDType> => {
  try {
    const response = await apiPrivateClient.post<SurveyPCDType>(
      "/api/surveys/",
      data,
      withAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error("Error creating Survey:", error);
    throw error;
  }
};

export const updateSurveys = async (id: number, data: FormData | Partial<SurveyPCDType>): Promise<SurveyPCDType> => {
  try {
    const response = await apiPrivateClient.put<SurveyPCDType>(
      `/api/surveys/${id}/`,
      data,
      withAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error("Error updating Survey:", error);
    throw error;
  }
};

export const deleteSurveys = async (id: number): Promise<SurveyPCDType> => {
  try {
    const response = await apiPrivateClient.delete<SurveyPCDType>(
      `/api/surveys/${id}/`,
      withAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting Survey:", error);
    throw error;
  }
};
