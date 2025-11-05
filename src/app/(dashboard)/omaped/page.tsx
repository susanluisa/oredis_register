"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/custom/Datatable";
import { Button } from "@/components/ui/button";
import DeleteModal from "@/components/custom/DeleteModal";
import { useState, useMemo } from "react";
import type { Office } from "@/lib/types/office-types";
import { useOffices } from "@/hooks/use-offices";
import { deleteOffice } from "./services/offices_services";
import { useDistricts } from "@/hooks/use-districts";
import OfficeCreateDrawer from "./components/OfficeCreateDrawer";
import OfficeEditDrawer from "./components/OfficeEditDrawer";

const columns = (
  districtNameById: (id: number) => string,
  onEdit: (item: Office) => void,
  onDelete: (id: number) => Promise<void>
): ColumnDef<Office>[] => [
  { accessorKey: "name", header: "Nombre" },
  { accessorKey: "type", header: "Tipo" },
  {
    accessorKey: "district",
    header: "Distrito",
    cell: ({ row }) => districtNameById(row.original.district) || row.original.district,
  },
  { accessorKey: "address", header: "Dirección" },
  { accessorKey: "phone_number", header: "Teléfono" },
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
          <DeleteModal title="¿Eliminar oficina?" entityLabel={`${row.original.name}`} onConfirm={handleDelete} />
        </div>
      );
    },
  },
];

export default function OmapedOfficesPage() {
  const queryClient = useQueryClient();
  const { data: offices = [], isLoading } = useOffices();
  const { data: districts = [], isLoading: loadingDistricts } = useDistricts();

  const districtOptions = useMemo(
    () => districts.map((d) => ({ value: d.id, label: d.name })),
    [districts]
  );
  const districtNameById = (id: number) => districts.find(d => d.id === id)?.name || "";

  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<Office | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteOffice(id);
      queryClient.invalidateQueries({ queryKey: ["offices"] });
    } catch (error) {
      console.error("Error eliminando oficina:", error);
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <section className="min-h-screen px-6 py-8">
      <div className="mx-auto flex w-full flex-col gap-3">
        <div className="pt-2 grid grid-cols-1 gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Oficinas OMAPED/OREDIS</h2>
            <OfficeCreateDrawer onCreated={() => queryClient.invalidateQueries({ queryKey: ["offices"] })} />
          </div>
          <DataTable
            columns={columns(districtNameById, (item) => {
              setEditItem(item);
              setEditOpen(true);
            }, handleDelete)}
            data={offices}
          />
          <OfficeEditDrawer
            open={editOpen}
            onOpenChange={(o) => { setEditOpen(o); if (!o) setEditItem(null); }}
            item={editItem}
            onUpdated={() => queryClient.invalidateQueries({ queryKey: ["offices"] })}
          />
        </div>
      </div>
    </section>
  );
}
