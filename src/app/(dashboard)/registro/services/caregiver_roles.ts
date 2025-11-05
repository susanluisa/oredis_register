import { apiPrivateClient, withAuthHeaders } from '@/lib/httpCommon';
import { CaregiverRoleType } from '@/lib/types/common-settings-types';

const route = '/api/common/caregiver-roles/';

export const fetchCaregiverRoles = async (options?: { auth?: boolean }): Promise<CaregiverRoleType[]> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.get<CaregiverRoleType[]>(route, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching caregiver roles:', error);
    throw error;
  }
};

export const createCaregiverRole = async (
  payload: { name: string; description?: string | null },
  options?: { auth?: boolean }
): Promise<CaregiverRoleType> => {
  try {
    const config = options?.auth ? withAuthHeaders() : undefined;
    const response = await apiPrivateClient.post<CaregiverRoleType>(route, payload, config);
    return response.data;
  } catch (error) {
    console.error('Error creating caregiver role:', error);
    throw error;
  }
};
