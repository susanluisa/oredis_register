import {
  createDistricts,
  deleteDistricts,
  fetchDistricts,
  updateDistricts,
  fetchDistrictsByProvince,
} from "@/app/(dashboard)/configuracion/catalogos/services/districts_services";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DistrictType } from "@/lib/types/common-settings-types";

export function useDistricts() {
  return useQuery<DistrictType[]>({
    queryKey: ["districts"],
    queryFn: () => fetchDistricts({ auth: true }),
  });
}

export function useDistrictsByProvince(provinceId?: number) {
  return useQuery<DistrictType[]>({
    queryKey: ["districts", provinceId],
    queryFn: async () => {
      if (!provinceId) return [];
      return fetchDistrictsByProvince(String(provinceId), { auth: true });
    },
    enabled: !!provinceId,
  });
}

export function useDistrictMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createDistricts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["districts"] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DistrictType> }) =>
      updateDistricts(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["districts"] });
      queryClient.invalidateQueries({ queryKey: ["districts", variables?.data?.province] });
    },
  });

  const remove = useMutation({
    mutationFn: deleteDistricts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["districts"] });
    },
  });

  return { create, update, remove };
}

