"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { OrganizationType } from "@/lib/types/org-types";
import { DataTable } from "@/components/custom/Datatable";
import { deleteOrgs, fetchOrgs, updateOrgs } from "../services/organization";
import { OrganizationColumns } from "./OrgTableColumns";
import OrgCreateDrawer from "./OrgCreateDrawer";
import OrgEditDrawer from "./OrgEditDrawer";
import { useState } from "react";

export default function OrgsTable() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => fetchOrgs({ auth: true }),
  });

  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrganizationType | null>(null);

  const handleUpdate = async (id: number, newData: Partial<OrganizationType>) => {
    try {
      await updateOrgs(id, newData);
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    } catch (error) {
      console.error("Error actualizando Organizacion:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOrgs(id);
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    } catch (error) {
      console.error("Error eliminando Organizacion:", error);
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="pt-8 pr-3">
      <div className="flex justify-between items-center p-4">
        <p className="text-xl pb-2">Tabla de Organizaciones</p>
        <OrgCreateDrawer onCreated={() => queryClient.invalidateQueries({ queryKey: ["organizations"] })} />
      </div>
      <DataTable columns={OrganizationColumns(handleUpdate, handleDelete, (item) => { setSelectedItem(item); setEditOpen(true); })} data={data} />
      <OrgEditDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        item={selectedItem}
        onUpdated={() => queryClient.invalidateQueries({ queryKey: ["organizations"] })}
      />
    </div>
  );
}
