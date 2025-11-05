import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QuestionTypeType } from "@/lib/types/survey-types";
import { createQuestionTypeType, deleteQuestionTypeType, fetchQuestionTypeTypes, updateQuestionTypeType } from "@/app/(dashboard)/configuracion/encuesta/services/question-type-types";

export function useQuestionTypeTypes() {
  return useQuery<QuestionTypeType[]>({
    queryKey: ["questionTypeTypes"],
    queryFn: () => fetchQuestionTypeTypes({ auth: true }),
  });
}

export function useQuestionTypeTypeMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: Partial<QuestionTypeType>) => createQuestionTypeType(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["questionTypeTypes"] }),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<QuestionTypeType> }) => updateQuestionTypeType(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["questionTypeTypes"] }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteQuestionTypeType(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["questionTypeTypes"] }),
  });

  return { create, update, remove };
}

