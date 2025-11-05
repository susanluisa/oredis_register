"use client";

import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/custom/Datatable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteModal from "@/components/custom/DeleteModal";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DisabilityType } from "@/lib/types/pcd-types";
import { useDisabilities } from "@/hooks/use-disabilities";
import { createDisability, deleteDisability, updateDisability } from "../catalogos/services/disabilities_services";

const columns = (
  onEdit: (item: DisabilityType) => void,
  onDelete: (id: number) => Promise<void>
): ColumnDef<DisabilityType>[] => [
  { accessorKey: "type", header: "Tipo" },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => row.original.description ?? "—",
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
            title="¿Desea eliminar esta discapacidad?"
            entityLabel={row.original.type}
            onConfirm={handleDelete}
          />
        </div>
      );
    },
  },
];

export default function DisabilitiesTable() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useDisabilities();
  const [typeName, setTypeName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteDisability(id);
      queryClient.invalidateQueries({ queryKey: ["disabilities"] });
    } catch (error) {
      console.error("Error eliminando discapacidad:", error);
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="pt-8 grid grid-cols-2">
      <DataTable columns={columns((item) => {
        setEditingId(item.id);
        setTypeName(item.type);
        setDescription(item.description ?? "");
      }, handleDelete)} data={items} />
      <div className="flex items-start p-4">
        <form
          className="w-full space-y-4 rounded-md border p-4 bg-background/60"
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg(null);
            const t = typeName.trim();
            const d = description.trim();
            if (!t) {
              setErrorMsg("Ingresa el nombre del tipo");
              return;
            }
            try {
              setSubmitting(true);
              const payload = { type: t, description: d || "" } as Partial<DisabilityType>;
              if (editingId) {
                await updateDisability(editingId, payload);
              } else {
                await createDisability(payload);
              }
              setTypeName("");
              setDescription("");
              setEditingId(null);
              queryClient.invalidateQueries({ queryKey: ["disabilities"] });
            } catch (err) {
              console.error(err);
              setErrorMsg(editingId ? "No se pudo actualizar" : "No se pudo crear");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <h3 className="font-semibold">{editingId ? "Editar discapacidad" : "Crear discapacidad"}</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Tipo</label>
            <Input
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              placeholder="Ej. Motora, Visual"
              disabled={submitting}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Descripción</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción (opcional)"
              disabled={submitting}
            />
          </div>
          {errorMsg && (
            <span className="text-sm text-destructive">{errorMsg}</span>
          )}
          <div className="flex justify-between gap-2">
            {editingId && (
              <Button
                type="button"
                variant="outline"
                className="hover:bg-secondary"
                onClick={() => {
                  setEditingId(null);
                  setTypeName("");
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

