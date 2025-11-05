import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OptionType } from "@/lib/types/survey-types";
import { createOption, deleteOption, fetchOptions, updateOption } from "@/app/(dashboard)/configuracion/encuesta/services/options";

export function useOptions() {
  return useQuery<OptionType[]>({
    queryKey: ["options"],
    queryFn: () => fetchOptions({ auth: true }),
  });
}

export function useOptionMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: Partial<OptionType>) => createOption(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["options"] }),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<OptionType> }) => updateOption(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["options"] }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteOption(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["options"] }),
  });

  return { create, update, remove };
}

