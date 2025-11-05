import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";
import { QuestionTypeType } from "@/lib/types/survey-types";

const route = "/api/pcd/question-type-types/";

export const fetchQuestionTypeTypes = async (options?: { auth?: boolean }): Promise<QuestionTypeType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<QuestionTypeType[]>(route, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching Question Type Types:", error);
    throw error;
  }
};

export const createQuestionTypeType = async (data: Partial<QuestionTypeType>): Promise<QuestionTypeType> => {
  try {
    const response = await apiPrivateClient.post<QuestionTypeType>(route, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error creating Question Type Type:", error);
    throw error;
  }
};

export const updateQuestionTypeType = async (id: number, data: Partial<QuestionTypeType>): Promise<QuestionTypeType> => {
  try {
    const response = await apiPrivateClient.put<QuestionTypeType>(`${route}${id}/`, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating Question Type Type:", error);
    throw error;
  }
};

export const deleteQuestionTypeType = async (id: number): Promise<QuestionTypeType> => {
  try {
    const response = await apiPrivateClient.delete<QuestionTypeType>(`${route}${id}/`, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting Question Type Type:", error);
    throw error;
  }
};

