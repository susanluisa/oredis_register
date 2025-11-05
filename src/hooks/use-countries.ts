import { createCountries, deleteCountries, fetchCountries, updateCountries } from "@/app/(dashboard)/configuracion/catalogos/services/countries_services"
import { createRegions, deleteRegions, fetchRegions, updateRegions } from "@/app/(dashboard)/configuracion/catalogos/services/regions_services"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"


export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: () => fetchCountries({ auth: true }),
  })
}

export function useRegionMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: createCountries,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["regions"] }),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<any> }) => updateCountries(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["regions"] }),
  })

  const remove = useMutation({
    mutationFn: deleteCountries,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["regions"] }),
  })

  return { create, update, remove }
}