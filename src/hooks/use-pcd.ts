import { createPCDRecords, deletePCDRecords, fetchPCDRecords, updatePCDRecords } from "@/app/(dashboard)/registro/services/pcd_register";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePCDRecords() {
  return useQuery({
    queryKey: ["PDCRecords"],
    queryFn: () => fetchPCDRecords({ auth: true }),
  })
}

export function useRegionMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: createPCDRecords,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["PDCRecords"] }),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<any> }) => updatePCDRecords(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["PDCRecords"] }),
  })

  const remove = useMutation({
    mutationFn: deletePCDRecords,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["PDCRecords"] }),
  })

  return { create, update, remove }
}