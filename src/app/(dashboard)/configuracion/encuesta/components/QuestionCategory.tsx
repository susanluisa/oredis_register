"use client";

import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/custom/Datatable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteModal from "@/components/custom/DeleteModal";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { QuestionCategoryType } from "@/lib/types/survey-types";
import { createQuestionCategory, updateQuestionCategory, fetchQuestionCategory, deleteQuestionCategory } from "../services/question-category";
import { useQuestionCategory } from "@/hooks/use-question-category";

const QuestionCategory_columns = (
  onEdit: (item: QuestionCategoryType) => void,
  onDelete: (id: number) => Promise<void>
): ColumnDef<QuestionCategoryType>[] => [
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "description",
      header: "Descripción",
    },
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const handleDelete = async () => {
          await onDelete(row.original.id);
        };
        return (
          <div className="flex gap-2 justify-center">
            <Button className="hover:bg-secondary" variant="outline" onClick={() => onEdit(row.original)}>
              Editar
            </Button>
            <DeleteModal
              title="Desea eliminar este Categoría?"
              entityLabel={row.original.name}
              onConfirm={handleDelete}
            />
          </div>
        );
      }
    }
  ];

export default function QuestionCategory() {
  const queryClient = useQueryClient();
  const { data: questionCategory = [], isLoading: loadingQuestionsCategory } = useQuestionCategory();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteQuestionCategory(id);
      queryClient.invalidateQueries({ queryKey: ["questionCategory"] });
    } catch (error) {
      console.error("Error eliminando Categoría:", error);
    }
  };

  if (loadingQuestionsCategory) return <p>Cargando...</p>;

  return (
    <div className="pt-8 grid grid-cols-2">
      <DataTable
        columns={QuestionCategory_columns((item) => {
          setEditingId(item.id);
          setName(item.name);
          setDescription(item.description ?? "");
        }, handleDelete)}
        data={questionCategory}
      />
      <div className="flex items-start p-4">
        <form
          className="w-full space-y-4 rounded-md border p-4 bg-background/60"
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg(null);
            const n = name.trim();
            const d = description.trim();
            if (!d) {
              setErrorMsg("Ingrese la Descripción");
              return;
            }
            if (!n) {
              setErrorMsg("Ingresa el nombre");
              return;
            }
            try {
              setSubmitting(true);
              if (editingId) {
                await updateQuestionCategory(editingId, { name: n, description: d });
              } else {
                await createQuestionCategory({ name: n, description: d });
              }
              setName("");
              setDescription("");
              setEditingId(null);
              queryClient.invalidateQueries({ queryKey: ["questionCategory"] });
            } catch (err) {
              console.error(err);
              setErrorMsg(editingId ? "No se pudo actualizar la categoría" : "No se pudo crear la categoría");
            } finally {
              setSubmitting(false)
            }
          }}
        >
          <h3 className="font-semibold">{editingId ? "Editar Categoría" : "Crear Categoría"}</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Nombre</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} disabled={submitting} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Descripción</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} disabled={submitting} />
          </div>
          {errorMsg && <span className="text-sm text-destructive">{errorMsg}</span>}
          <div className="flex justify-between gap-2">
            {editingId && (
              <Button
                type="button"
                variant="outline"
                className="hover:bg-secondary"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setDescription("");
                  setErrorMsg(null);
                }}
                disabled={submitting}
              >
                Cancelar
              </Button>
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

