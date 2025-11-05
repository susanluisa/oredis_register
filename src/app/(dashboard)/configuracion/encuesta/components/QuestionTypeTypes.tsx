"use client";

import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/custom/Datatable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteModal from "@/components/custom/DeleteModal";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { QuestionTypeType } from "@/lib/types/survey-types";
import { useQuestionTypeTypes } from "@/hooks/use-question-type-types";
import { createQuestionTypeType, deleteQuestionTypeType, updateQuestionTypeType } from "../services/question-type-types";

const columns = (
  onEdit: (item: QuestionTypeType) => void,
  onDelete: (id: number) => Promise<void>
): ColumnDef<QuestionTypeType>[] => [
  { accessorKey: "code", header: "Código" },
  { accessorKey: "description", header: "Descripción" },
  {
    accessorKey: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const handleDelete = async () => { await onDelete(row.original.id); };
      return (
        <div className="flex gap-2 justify-center">
          <Button className="hover:bg-secondary" variant="outline" onClick={() => onEdit(row.original)}>
            Editar
          </Button>
          <DeleteModal title="¿Eliminar tipo de pregunta?" entityLabel={`${row.original.code}`} onConfirm={handleDelete} />
        </div>
      );
    },
  },
];

export default function QuestionTypeTypes() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuestionTypeTypes();
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteQuestionTypeType(id);
      queryClient.invalidateQueries({ queryKey: ["questionTypeTypes"] });
    } catch (error) {
      console.error("Error eliminando tipo de pregunta:", error);
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="pt-8 grid grid-cols-2">
      <DataTable columns={columns((item) => {
        setEditingId(item.id);
        setCode(item.code);
        setDescription(item.description ?? "");
      }, handleDelete)} data={items} />
      <div className="flex items-start p-4">
        <form
          className="w-full space-y-4 rounded-md border p-4 bg-background/60"
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg(null);
            const c = code.trim();
            const d = description.trim();
            if (!c) { setErrorMsg("Ingresa el código"); return; }
            try {
              setSubmitting(true);
              const payload = { code: c, description: d || undefined } as Partial<QuestionTypeType>;
              if (editingId) {
                await updateQuestionTypeType(editingId, payload);
              } else {
                await createQuestionTypeType(payload);
              }
              setCode("");
              setDescription("");
              setEditingId(null);
              queryClient.invalidateQueries({ queryKey: ["questionTypeTypes"] });
            } catch (err) {
              console.error(err);
              setErrorMsg(editingId ? "No se pudo actualizar" : "No se pudo crear");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <h3 className="font-semibold">{editingId ? "Editar tipo de pregunta" : "Crear tipo de pregunta"}</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Código</label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} disabled={submitting} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Descripción</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} disabled={submitting} />
          </div>
          {errorMsg && <span className="text-sm text-destructive">{errorMsg}</span>}
          <div className="flex justify-between gap-2">
            {editingId && (
              <Button type="button" variant="outline" className="hover:bg-secondary" onClick={() => {
                setEditingId(null); setCode(""); setDescription(""); setErrorMsg(null);
              }} disabled={submitting}>Cancelar</Button>
            )}
            <div className="flex-1" />
            <Button type="submit" disabled={submitting} className="hover:bg-secondary">
              {submitting ? (editingId ? "Actualizando..." : "Creando...") : (editingId ? "Actualizar" : "Crear")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

