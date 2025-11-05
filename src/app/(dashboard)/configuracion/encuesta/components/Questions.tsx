"use client";

import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/custom/Datatable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteModal from "@/components/custom/DeleteModal";
import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { QuestionType, QuestionCategoryType, QuestionTypeType } from "@/lib/types/survey-types";
import { useQuestions } from "@/hooks/use-questions";
import { createQuestion, deleteQuestion, updateQuestion } from "../services/questions";
import { useQuestionCategory } from "@/hooks/use-question-category";
import { useQuestionTypeTypes } from "@/hooks/use-question-type-types";
import { Combobox } from "@/components/custom/Combobox";

const columns = (
  categoryNameById: (id: number) => string,
  typeCodeById: (id: number) => string,
  onEdit: (item: QuestionType) => void,
  onDelete: (id: number) => Promise<void>
): ColumnDef<QuestionType>[] => [
  { accessorKey: "text", header: "Pregunta" },
  { accessorKey: "category", header: "Categoría", cell: ({ row }) => categoryNameById(row.original.category) },
  { accessorKey: "type", header: "Tipo", cell: ({ row }) => typeCodeById(row.original.type) },
  { accessorKey: "is_required", header: "Obligatoria" },
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
          <DeleteModal title="¿Eliminar pregunta?" entityLabel={`${row.original.text}`} onConfirm={handleDelete} />
        </div>
      );
    },
  },
];

export default function Questions() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuestions();
  const { data: cats = [] } = useQuestionCategory();
  const { data: types = [] } = useQuestionTypeTypes();

  const categoryOptions = useMemo(() => cats.map((c: QuestionCategoryType) => ({ value: c.id, label: c.name })), [cats]);
  const typeOptions = useMemo(() => types.map((t: QuestionTypeType) => ({ value: t.id, label: t.code })), [types]);
  const categoryNameById = (id: number) => cats.find(c => c.id === id)?.name || "";
  const typeCodeById = (id: number) => types.find(t => t.id === id)?.code || "";

  const [editingId, setEditingId] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [category, setCategory] = useState<number | null>(null);
  const [type, setType] = useState<number | null>(null);
  const [isRequired, setIsRequired] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteQuestion(id);
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    } catch (error) {
      console.error("Error eliminando pregunta:", error);
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="pt-8 grid grid-cols-2">
      <DataTable columns={columns(categoryNameById, typeCodeById, (item) => {
        setEditingId(item.id);
        setText(item.text);
        setCategory(item.category ?? null);
        setType(item.type ?? null);
        setIsRequired(!!item.is_required);
      }, handleDelete)} data={items} />
      <div className="flex items-start p-4">
        <form
          className="w-full space-y-4 rounded-md border p-4 bg-background/60"
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg(null);
            const t = text.trim();
            if (!t) { setErrorMsg("Ingresa el texto de la pregunta"); return; }
            if (!category) { setErrorMsg("Selecciona la categoría"); return; }
            if (!type) { setErrorMsg("Selecciona el tipo"); return; }
            try {
              setSubmitting(true);
              const payload: Partial<QuestionType> = { text: t, category, type, is_required: !!isRequired };
              if (editingId) {
                await updateQuestion(editingId, payload);
              } else {
                await createQuestion(payload);
              }
              setText(""); setCategory(null); setType(null); setIsRequired(false); setEditingId(null);
              queryClient.invalidateQueries({ queryKey: ["questions"] });
            } catch (err) {
              console.error(err);
              setErrorMsg(editingId ? "No se pudo actualizar" : "No se pudo crear");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <h3 className="font-semibold">{editingId ? "Editar pregunta" : "Crear pregunta"}</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Pregunta</label>
            <Input value={text} onChange={(e) => setText(e.target.value)} disabled={submitting} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Categoría</label>
            <Combobox options={categoryOptions} value={category} onChange={(v) => setCategory(typeof v === 'number' ? v : v ? Number(v) : null)} disabled={submitting} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Tipo</label>
            <Combobox options={typeOptions} value={type} onChange={(v) => setType(typeof v === 'number' ? v : v ? Number(v) : null)} disabled={submitting} />
          </div>
          <div className="flex items-center gap-2">
            <input id="is_required" type="checkbox" checked={isRequired} onChange={(e) => setIsRequired(e.target.checked)} />
            <label htmlFor="is_required" className="text-sm">Obligatoria</label>
          </div>
          {errorMsg && <span className="text-sm text-destructive">{errorMsg}</span>}
          <div className="flex justify-between gap-2">
            {editingId && (
              <Button type="button" variant="outline" className="hover:bg-secondary" onClick={() => {
                setEditingId(null); setText(""); setCategory(null); setType(null); setIsRequired(false); setErrorMsg(null);
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

