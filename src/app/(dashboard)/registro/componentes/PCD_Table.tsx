"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/custom/Datatable";
import { deletePCDRecords, fetchPCDRecords, updatePCDRecords } from "../services/pcd_register";
import { PCDRegisterColumns } from "./PCDRegisterColumns";
import { PCDType } from "@/lib/types/pcd-types";
import { DrawerDemo } from "./PCD_details";

export default function PCDRecordsTable() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["pcds"],
    queryFn: () => fetchPCDRecords({ auth: true }),
  });
  console.log("pcds data de dajngo... ", data)

  const handleUpdate = async (id: number, newData: Partial<PCDType>) => {
    try {
      await updatePCDRecords(id, newData);
      queryClient.invalidateQueries({ queryKey: ["pcds"] });
    } catch (error) {
      console.error("Error actualizando registro:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePCDRecords(id);
      queryClient.invalidateQueries({ queryKey: ["pcds"] });
    } catch (error) {
      console.error("Error eliminando registro:", error);
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="pt-4">
      <div className="flex justify-between items-center p-4">
        <DrawerDemo />
      </div>
      <div>
        <DataTable columns={PCDRegisterColumns(handleUpdate, handleDelete)} data={data} />
      </div>
    </div>
  );
}
