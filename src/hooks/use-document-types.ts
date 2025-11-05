import {
  createDocumentType,
  deleteDocumentType,
  fetchDocumentTypes,
  updateDocumentType,
} from "@/app/(dashboard)/configuracion/catalogos/services/document_types_services";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentIdType } from "@/lib/types/common-settings-types";

export function useDocumentTypes() {
  return useQuery<DocumentIdType[]>({
    queryKey: ["document_types"],
    queryFn: () => fetchDocumentTypes({ auth: true }),
  });
}

export function useDocumentTypeMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createDocumentType,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["document_types"] }),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DocumentIdType> }) =>
      updateDocumentType(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["document_types"] }),
  });

  const remove = useMutation({
    mutationFn: deleteDocumentType,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["document_types"] }),
  });

  return { create, update, remove };
}

