import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RelatedPersonType } from '@/lib/types/pcd-types';
import { createCaregiver, deleteCaregiver, fetchCaregivers, updateCaregiver } from '@/app/(dashboard)/registro/services/caregivers';

export function useCaregivers() {
  return useQuery<RelatedPersonType[]>({
    queryKey: ['caregivers'],
    queryFn: () => fetchCaregivers({ auth: true }),
  });
}

export function useCaregiverMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createCaregiver,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['caregivers'] }),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<RelatedPersonType> }) => updateCaregiver(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['caregivers'] }),
  });

  const remove = useMutation({
    mutationFn: deleteCaregiver,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['caregivers'] }),
  });

  return { create, update, remove };
}