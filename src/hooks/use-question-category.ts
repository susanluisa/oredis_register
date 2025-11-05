import {
  createQuestionCategory,
  deleteQuestionCategory,
  fetchQuestionCategory,
  updateQuestionCategory,
} from "@/app/(dashboard)/configuracion/encuesta/services/question-category"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useQuestionCategory() {
  return useQuery({
    queryKey: ["questionCategory"],
    queryFn: () => fetchQuestionCategory({ auth: true }),
  })
}

// Mutaciones: crear, actualizar y eliminar
export function useQuestionCategoryMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: (data: any) => createQuestionCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionCategory"] })
    },
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<any> }) =>
      updateQuestionCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionCategory"] })
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteQuestionCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionCategory"] })
    },
  })

  return { create, update, remove }
}
