"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/custom/Datatable";
import { SurveyPCDType } from "@/lib/types/survey-types";
import { SurveyColumns } from "./SurveyTableColumns";
import { deleteSurveys, fetchSurveys, updateSurveys } from "../services/survey";

export default function SurveysTable() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["survey"],
    queryFn: () => fetchSurveys({ auth: true }),
  });

  const handleUpdate = async (id: number, newData: Partial<SurveyPCDType>) => {
    try {
      await updateSurveys(id, newData);
      queryClient.invalidateQueries({ queryKey: ["survey"] });
    } catch (error) {
      console.error("Error actualizando Encuesta:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSurveys(id);
      queryClient.invalidateQueries({ queryKey: ["survey"] });
    } catch (error) {
      console.error("Error eliminando Encuesta:", error);
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="pt-8">
      <div className="flex justify-between items-center p-4">
        <p className="text-xl pb-2">Tabla de Encuestas</p>
        aqui va el drawer
      </div>
      <DataTable columns={SurveyColumns(handleUpdate, handleDelete)} data={data} />
    </div>
  );
}
