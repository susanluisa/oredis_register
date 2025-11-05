import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QuestionType } from "@/lib/types/survey-types";
import { createQuestion, deleteQuestion, fetchQuestions, updateQuestion } from "@/app/(dashboard)/configuracion/encuesta/services/questions";

export function useQuestions() {
  return useQuery<QuestionType[]>({
    queryKey: ["questions"],
    queryFn: () => fetchQuestions({ auth: true }),
  });
}

export function useQuestionMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: Partial<QuestionType>) => createQuestion(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["questions"] }),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<QuestionType> }) => updateQuestion(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["questions"] }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteQuestion(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["questions"] }),
  });

  return { create, update, remove };
}

