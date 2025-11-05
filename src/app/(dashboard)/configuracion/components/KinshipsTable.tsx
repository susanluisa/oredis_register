"use client";

import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/custom/Datatable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteModal from "@/components/custom/DeleteModal";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { KinshipType } from "@/lib/types/common-settings-types";
import { createKinship, deleteKinship, updateKinship } from "../catalogos/services/kinships_services";
import { useKinships } from "@/hooks/use-kinships";
import { useCaregiverRoles } from "@/hooks/use-caregiver-roles";
import { Combobox } from "@/components/custom/Combobox";

const columns = (
  onEdit: (item: KinshipType) => void,
  onDelete: (id: number) => Promise<void>
): ColumnDef<KinshipType>[] => [
  { accessorKey: "name", header: "Nombre" },
  { accessorKey: "description", header: "Descripción" },
  { accessorKey: "role", header: "Rol (ID)" },
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
          <DeleteModal title="¿Eliminar parentesco?" entityLabel={`${row.original.name}`} onConfirm={handleDelete} />
        </div>
      );
    },
  },
];

export default function KinshipsTable() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useKinships();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: roles = [], isLoading: loadingRoles } = useCaregiverRoles();
  const roleOptions = roles.map(r => ({ value: r.id, label: r.name }));

  const handleDelete = async (id: number) => {
    try {
      await deleteKinship(id);
      queryClient.invalidateQueries({ queryKey: ["kinships"] });
    } catch (error) {
      console.error("Error eliminando parentesco:", error);
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="pt-8 grid grid-cols-2">
      <DataTable columns={columns((item) => {
        setEditingId(item.id);
        setName(item.name);
        setDescription(item.description ?? "");
        setSelectedRole(item.role ?? null);
      }, handleDelete)} data={items} />
      <div className="flex items-start p-4">
        <form
          className="w-full space-y-4 rounded-md border p-4 bg-background/60"
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg(null);
            const n = name.trim();
            const d = description.trim();
            const r = selectedRole ?? 0;
            if (!n) {
              setErrorMsg("Ingresa el nombre");
              return;
            }
            try {
              setSubmitting(true);
              const payload = { name: n, description: d || null, role: r } as Partial<KinshipType>;
              if (editingId) {
                await updateKinship(editingId, payload);
              } else {
                await createKinship(payload);
              }
              setName("");
              setDescription("");
              setSelectedRole(null);
              setEditingId(null);
              queryClient.invalidateQueries({ queryKey: ["kinships"] });
            } catch (err) {
              console.error(err);
              setErrorMsg(editingId ? "No se pudo actualizar" : "No se pudo crear");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <h3 className="font-semibold">{editingId ? "Editar parentesco" : "Crear parentesco"}</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Nombre</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Madre, Padre" disabled={submitting} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Descripción</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción (opcional)" disabled={submitting} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Rol de cuidador</label>
            <Combobox
              options={roleOptions}
              value={selectedRole}
              onChange={(val) => setSelectedRole(val as number | null)}
              placeholder="Selecciona un rol..."
              loading={loadingRoles}
              disabled={submitting}
            />
          </div>
          {errorMsg && <span className="text-sm text-destructive">{errorMsg}</span>}
          <div className="flex justify-between gap-2">
            {editingId && (
              <Button type="button" variant="outline" className="hover:bg-secondary" onClick={() => {
                setEditingId(null); setName(""); setDescription(""); setSelectedRole(null); setErrorMsg(null);
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
