"use client";

import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/custom/Datatable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteModal from "@/components/custom/DeleteModal";
import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { OptionType, QuestionType } from "@/lib/types/survey-types";
import { useOptions } from "@/hooks/use-options";
import { createOption, deleteOption, updateOption } from "../services/options";
import { useQuestions } from "@/hooks/use-questions";
import { Combobox } from "@/components/custom/Combobox";
import { useDisabilities } from "@/hooks/use-disabilities";
import { useCaregiverRoles } from "@/hooks/use-caregiver-roles";

const columns = (
  questionTextById: (id: number) => string,
  onEdit: (item: OptionType) => void,
  onDelete: (id: number) => Promise<void>
): ColumnDef<OptionType>[] => [
  { accessorKey: "text", header: "Opción" },
  { accessorKey: "question", header: "Pregunta", cell: ({ row }) => questionTextById(row.original.question) },
  { accessorKey: "allows_free_text", header: "Texto libre" },
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
          <DeleteModal title="¿Eliminar opción?" entityLabel={`${row.original.text}`} onConfirm={handleDelete} />
        </div>
      );
    },
  },
];

export default function Options() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useOptions();
  const { data: questions = [] } = useQuestions();
  const { data: disabilities = [] } = useDisabilities();
  const { data: roles = [] } = useCaregiverRoles();

  const questionOptions = useMemo(() => questions.map((q: QuestionType) => ({ value: q.id, label: q.text })), [questions]);
  const questionTextById = (id: number) => questions.find(q => q.id === id)?.text || "";
  const disabilityOptions = useMemo(() => disabilities.map(d => ({ value: d.id, label: d.type })), [disabilities]);
  const roleOptions = useMemo(() => roles.map(r => ({ value: r.id, label: r.name })), [roles]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [question, setQuestion] = useState<number | null>(null);
  const [allowsFree, setAllowsFree] = useState<boolean>(false);
  const [disability, setDisability] = useState<number | null>(null);
  const [caregiverRole, setCaregiverRole] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteOption(id);
      queryClient.invalidateQueries({ queryKey: ["options"] });
    } catch (error) {
      console.error("Error eliminando opción:", error);
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="pt-8 grid grid-cols-2">
      <DataTable columns={columns(questionTextById, (item) => {
        setEditingId(item.id);
        setText(item.text);
        setQuestion(item.question ?? null);
        setAllowsFree(!!item.allows_free_text);
        setDisability(item.disability ?? null);
        setCaregiverRole(item.caregiver_role ?? null);
      }, handleDelete)} data={items} />
      <div className="flex items-start p-4">
        <form
          className="w-full space-y-4 rounded-md border p-4 bg-background/60"
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg(null);
            const t = text.trim();
            if (!t) { setErrorMsg("Ingresa el texto de la opción"); return; }
            if (!question) { setErrorMsg("Selecciona la pregunta"); return; }
            try {
              setSubmitting(true);
              const payload: Partial<OptionType> = {
                text: t,
                question,
                allows_free_text: !!allowsFree,
                disability: disability ?? null,
                caregiver_role: caregiverRole ?? null,
              };
              if (editingId) {
                await updateOption(editingId, payload);
              } else {
                await createOption(payload);
              }
              setText(""); setQuestion(null); setAllowsFree(false); setDisability(null); setCaregiverRole(null); setEditingId(null);
              queryClient.invalidateQueries({ queryKey: ["options"] });
            } catch (err) {
              console.error(err);
              setErrorMsg(editingId ? "No se pudo actualizar" : "No se pudo crear");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <h3 className="font-semibold">{editingId ? "Editar opción" : "Crear opción"}</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Texto</label>
            <Input value={text} onChange={(e) => setText(e.target.value)} disabled={submitting} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Pregunta</label>
            <Combobox options={questionOptions} value={question} onChange={(v) => setQuestion(typeof v === 'number' ? v : v ? Number(v) : null)} disabled={submitting} />
          </div>
          <div className="flex items-center gap-2">
            <input id="allows_free" type="checkbox" checked={allowsFree} onChange={(e) => setAllowsFree(e.target.checked)} />
            <label htmlFor="allows_free" className="text-sm">Permite texto libre</label>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Discapacidad (opcional)</label>
            <Combobox options={disabilityOptions} value={disability} onChange={(v) => setDisability(typeof v === 'number' ? v : v ? Number(v) : null)} disabled={submitting} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Rol de cuidador (opcional)</label>
            <Combobox options={roleOptions} value={caregiverRole} onChange={(v) => setCaregiverRole(typeof v === 'number' ? v : v ? Number(v) : null)} disabled={submitting} />
          </div>
          {errorMsg && <span className="text-sm text-destructive">{errorMsg}</span>}
          <div className="flex justify-between gap-2">
            {editingId && (
              <Button type="button" variant="outline" className="hover:bg-secondary" onClick={() => {
                setEditingId(null); setText(""); setQuestion(null); setAllowsFree(false); setDisability(null); setCaregiverRole(null); setErrorMsg(null);
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

