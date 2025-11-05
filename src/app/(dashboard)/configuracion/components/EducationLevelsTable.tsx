"use client";

import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/custom/Datatable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteModal from "@/components/custom/DeleteModal";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { EducationLevelType } from "@/lib/types/common-settings-types";
import { createEducationLevel, deleteEducationLevel, updateEducationLevel } from "../catalogos/services/education_levels_services";
import { useEducationLevels } from "@/hooks/use-education-levels";

const columns = (
  onEdit: (item: EducationLevelType) => void,
  onDelete: (id: number) => Promise<void>
): ColumnDef<EducationLevelType>[] => [
  { accessorKey: "code", header: "Código" },
  { accessorKey: "name", header: "Nombre" },
  { accessorKey: "order", header: "Orden" },
  { accessorKey: "is_active", header: "Activo" },
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
          <DeleteModal title="¿Eliminar nivel educativo?" entityLabel={`${row.original.name}`} onConfirm={handleDelete} />
        </div>
      );
    },
  },
];

export default function EducationLevelsTable() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useEducationLevels();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [order, setOrder] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteEducationLevel(id);
      queryClient.invalidateQueries({ queryKey: ["education_levels"] });
    } catch (error) {
      console.error("Error eliminando nivel educativo:", error);
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="pt-8 grid grid-cols-2">
      <DataTable columns={columns((item) => {
        setEditingId(item.id);
        setCode(item.code);
        setName(item.name);
        setOrder(String(item.order ?? ""));
        setIsActive(!!item.is_active);
      }, handleDelete)} data={items} />
      <div className="flex items-start p-4">
        <form
          className="w-full space-y-4 rounded-md border p-4 bg-background/60"
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg(null);
            const c = code.trim();
            const n = name.trim();
            const o = order ? Number(order) : 0;
            if (!c || !n) {
              setErrorMsg("Completa código y nombre");
              return;
            }
            try {
              setSubmitting(true);
              const payload = { code: c, name: n, order: o, is_active: isActive } as Partial<EducationLevelType>;
              if (editingId) {
                await updateEducationLevel(editingId, payload);
              } else {
                await createEducationLevel(payload);
              }
              setCode("");
              setName("");
              setOrder("");
              setIsActive(true);
              setEditingId(null);
              queryClient.invalidateQueries({ queryKey: ["education_levels"] });
            } catch (err) {
              console.error(err);
              setErrorMsg(editingId ? "No se pudo actualizar" : "No se pudo crear");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <h3 className="font-semibold">{editingId ? "Editar nivel educativo" : "Crear nivel educativo"}</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Código</label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ej. SEC" disabled={submitting} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Nombre</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Secundaria" disabled={submitting} />
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">Orden</label>
              <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} placeholder="Ej. 1" disabled={submitting} />
            </div>
            <div className="flex items-end gap-2">
              <input id="is_active" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <label htmlFor="is_active" className="text-sm">Activo</label>
            </div>
          </div>
          {errorMsg && <span className="text-sm text-destructive">{errorMsg}</span>}
          <div className="flex justify-between gap-2">
            {editingId && (
              <Button type="button" variant="outline" className="hover:bg-secondary" onClick={() => {
                setEditingId(null); setCode(""); setName(""); setOrder(""); setIsActive(true); setErrorMsg(null);
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

