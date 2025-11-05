import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";
import { QuestionType } from "@/lib/types/survey-types";

const route = "/api/pcd/questions/";

export const fetchQuestions = async (options?: { auth?: boolean }): Promise<QuestionType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<QuestionType[]>(route, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching Questions:", error);
    throw error;
  }
};

export const createQuestion = async (data: Partial<QuestionType>): Promise<QuestionType> => {
  try {
    const response = await apiPrivateClient.post<QuestionType>(route, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error creating Question:", error);
    throw error;
  }
};

export const updateQuestion = async (id: number, data: Partial<QuestionType>): Promise<QuestionType> => {
  try {
    const response = await apiPrivateClient.put<QuestionType>(`${route}${id}/`, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating Question:", error);
    throw error;
  }
};

export const deleteQuestion = async (id: number): Promise<QuestionType> => {
  try {
    const response = await apiPrivateClient.delete<QuestionType>(`${route}${id}/`, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting Question:", error);
    throw error;
  }
};

