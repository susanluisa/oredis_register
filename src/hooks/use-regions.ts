import {
  createRegions,
  deleteRegions,
  fetchRegions,
  updateRegions,
  fetchRegionsByCountry,
} from "@/app/(dashboard)/configuracion/catalogos/services/regions_services"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { RegionType } from "@/lib/types/common-settings-types"

export function useRegions() {
  return useQuery<RegionType[]>({
    queryKey: ["regions"],
    queryFn: () => fetchRegions({ auth: true }),
  })
}

export function useRegionsByCountry(countryId?: number) {
  return useQuery<RegionType[]>({
    queryKey: ["regions", countryId],
    queryFn: async () => {
      if (!countryId) return []
      return fetchRegionsByCountry(String(countryId), { auth: true })
    },
    enabled: !!countryId,
  })
}


export function useRegionMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: createRegions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] })
    },
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<RegionType> }) =>
      updateRegions(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["regions"] })
      queryClient.invalidateQueries({ queryKey: ["regions", variables?.data?.country] })
    },
  })

  const remove = useMutation({
    mutationFn: deleteRegions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] })
    },
  })

  return { create, update, remove }
}
