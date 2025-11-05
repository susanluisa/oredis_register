import { useQuery } from '@tanstack/react-query';
import { CaregiverRoleType } from '@/lib/types/common-settings-types';
import { fetchCaregiverRoles } from '@/app/(dashboard)/registro/services/caregiver_roles';

export function useCaregiverRoles() {
  return useQuery<CaregiverRoleType[]>({
    queryKey: ['caregiver_roles'],
    queryFn: () => fetchCaregiverRoles({ auth: true }),
  });
}
