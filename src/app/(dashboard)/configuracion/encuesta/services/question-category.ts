import { } from "@/lib/types/common-settings-types";
import { apiPrivateClient, withAuthHeaders } from "@/lib/httpCommon";
import { QuestionCategoryType } from "@/lib/types/survey-types";

const route = "/api/pcd/question-categories/";

export const fetchQuestionCategory = async (options?: { auth?: boolean }): Promise<QuestionCategoryType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<QuestionCategoryType[]>(route, config);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching Question Category:", error);
    throw error;
  }
};

export const createQuestionCategory = async (data: FormData | Partial<QuestionCategoryType>): Promise<QuestionCategoryType> => {
  try {
    const response = await apiPrivateClient.post<QuestionCategoryType>(route, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error creating Question Category:", error);
    throw error;
  }
};

export const updateQuestionCategory = async (id: number, data: FormData | Partial<QuestionCategoryType>): Promise<QuestionCategoryType> => {
  try {
    const response = await apiPrivateClient.put<QuestionCategoryType>(`${route}${id}/`, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating Question Category:", error);
    throw error;
  } 
};

export const deleteQuestionCategory = async (id: number): Promise<QuestionCategoryType> => {
  try {
    const response = await apiPrivateClient.delete<QuestionCategoryType>(`${route}${id}/`, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting Question Category:", error);
    throw error;
  }
};
