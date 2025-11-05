import {
  createProvinces,
  deleteProvinces,
  fetchProvinces,
  updateProvinces,
  fetchProvincesByRegion,
} from "@/app/(dashboard)/configuracion/catalogos/services/provinces_services";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProvinceType } from "@/lib/types/common-settings-types";

export function useProvinces() {
  return useQuery<ProvinceType[]>({
    queryKey: ["provinces"],
    queryFn: () => fetchProvinces({ auth: true }),
  });
}

export function useProvincesByRegion(regionId?: number) {
  return useQuery<ProvinceType[]>({
    queryKey: ["provinces", regionId],
    queryFn: async () => {
      if (!regionId) return [];
      return fetchProvincesByRegion(String(regionId), { auth: true });
    },
    enabled: !!regionId,
  });
}

export function useProvinceMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createProvinces,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provinces"] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProvinceType> }) =>
      updateProvinces(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["provinces"] });
      queryClient.invalidateQueries({ queryKey: ["provinces", variables?.data?.region] });
    },
  });

  const remove = useMutation({
    mutationFn: deleteProvinces,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provinces"] });
    },
  });

  return { create, update, remove };
}

