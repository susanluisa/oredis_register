import { apiPrivateClient, withAuthHeaders } from '@/lib/httpCommon';
import { RelatedPersonType } from '@/lib/types/pcd-types';

const route = '/api/pcd/related-people/';

export const fetchCaregivers = async (options?: { auth?: boolean }): Promise<RelatedPersonType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<RelatedPersonType[]>(route, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching caregivers:', error);
    throw error;
  }
};

export const createCaregiver = async (data: FormData | Partial<RelatedPersonType>): Promise<RelatedPersonType> => {
  try {
    const response = await apiPrivateClient.post<RelatedPersonType>(route, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error creating caregiver:', error);
    throw error;
  }
};

export const updateCaregiver = async (
  id: number,
  data: FormData | Partial<RelatedPersonType>
): Promise<RelatedPersonType> => {
  try {
    const response = await apiPrivateClient.put<RelatedPersonType>(`${route}${id}/`, data, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error updating caregiver:', error);
    throw error;
  }
};

export const deleteCaregiver = async (id: number): Promise<RelatedPersonType> => {
  try {
    const response = await apiPrivateClient.delete<RelatedPersonType>(`${route}${id}/`, withAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error deleting caregiver:', error);
    throw error;
  }
};