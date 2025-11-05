"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/custom/Datatable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCaregiverRoles } from "@/hooks/use-caregiver-roles";
import { CaregiverRoleType } from "@/lib/types/common-settings-types";
import { createCaregiverRole } from "@/app/(dashboard)/registro/services/caregiver_roles";

const columns: ColumnDef<CaregiverRoleType>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => row.original.description ?? "—",
  },
];

export default function CaregiverRolesTable() {
  const queryClient = useQueryClient();
  const { data: roles = [], isLoading, isError } = useCaregiverRoles();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Ocurrió un error al cargar los roles.</p>;

  return (
    <div className="pt-8 grid grid-cols-2">
      <DataTable columns={columns} data={roles} />
      <div className="flex items-start p-4">
        <form
          className="w-full space-y-4 rounded-md border p-4 bg-background/60"
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg(null);
            const n = name.trim();
            const d = description.trim();
            if (!n) {
              setErrorMsg("Ingresa el nombre del rol");
              return;
            }
            try {
              setSubmitting(true);
              await createCaregiverRole({ name: n, description: d || null }, { auth: true });
              setName("");
              setDescription("");
              queryClient.invalidateQueries({ queryKey: ["caregiver_roles"] });
            } catch (err) {
              console.error(err);
              setErrorMsg("No se pudo crear el rol de cuidador");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <h3 className="font-semibold">Crear rol de cuidador</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Nombre</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Tutor legal, Apoderado"
              disabled={submitting}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Descripción (opcional)</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción del rol"
              disabled={submitting}
            />
          </div>
          {errorMsg && (
            <span className="text-sm text-destructive">{errorMsg}</span>
          )}
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={submitting} className="hover:bg-secondary">
              {submitting ? "Creando..." : "Crear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
