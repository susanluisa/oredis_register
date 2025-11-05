"use client";

import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/custom/Datatable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteModal from "@/components/custom/DeleteModal";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ProvinceType } from "@/lib/types/common-settings-types";
import { createProvinces, deleteProvinces, updateProvinces } from "../catalogos/services/provinces_services";
import { Combobox } from "@/components/custom/Combobox";
import { useCountries } from "@/hooks/use-countries";
import { useProvincesByRegion } from "@/hooks/use-provinces";
import { useRegionsByCountry } from "@/hooks/use-regions";

const province_columns = (
  onEdit: (item: ProvinceType) => void,
  onDelete: (id: number) => Promise<void>
): ColumnDef<ProvinceType>[] => [
  {
    accessorKey: "name",
    header: "Provincia",
  },
  {
    accessorKey: "code",
    header: "Código",
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
            title="Desea eliminar esta Provincia?"
            entityLabel={row.original.name}
            onConfirm={handleDelete}
          />
        </div>
      )
    }
  }
];

export default function ProvincesTable() {
  const queryClient = useQueryClient();
  const [selectedCountry, setSelectedCountry] = useState<number | null>(1);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);

  const { data: countries = [], isLoading: loadingCountries } = useCountries();
  const { data: regions = [], isLoading: loadingRegions } = useRegionsByCountry(selectedCountry ?? undefined);
  const { data: provinces = [], isLoading: loadingProvinces } = useProvincesByRegion(selectedRegion ?? undefined);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteProvinces(id);
      queryClient.invalidateQueries({ queryKey: ["provinces"] });
      if (selectedRegion) queryClient.invalidateQueries({ queryKey: ["provinces", selectedRegion] });
    } catch (error) {
      console.error("Error eliminando Provincias:", error);
    }
  };

  if (loadingCountries || loadingRegions || loadingProvinces) return <p>Cargando...</p>;

  const countryOptions = countries.map((item) => ({ value: item.id, label: item.name })) ?? [];
  const regionOptions = regions.map((item) => ({ value: item.id, label: item.name })) ?? [];

  return (
    <div className="pt-8 flex flex-col gap-4">
      <div className="flex gap-4">
        <Combobox
          options={countryOptions}
          value={selectedCountry}
          onChange={(val) => {
            setSelectedCountry(val as number | null);
            setSelectedRegion(null);
          }}
          placeholder="Selecciona un país..."
        />
        <Combobox
          options={regionOptions}
          value={selectedRegion}
          onChange={(val) => setSelectedRegion(val as number | null)}
          placeholder="Selecciona una región..."
          disabled={!selectedCountry}
        />
      </div>
      <div className="grid grid-cols-2">
        <DataTable columns={province_columns((item) => {
          setEditingId(item.id);
          setName(item.name);
          setCode(item.code);
        }, handleDelete)} data={provinces} />
        <div className="flex items-start p-4">
          <form
            className="w-full space-y-4 rounded-md border p-4 bg-background/60"
            onSubmit={async (e) => {
              e.preventDefault();
              setErrorMsg(null);
              const n = name.trim();
              const c = code.trim();
              if (!n || !selectedRegion) {
                setErrorMsg(!n ? "Ingresa el nombre" : "Selecciona una región");
                return;
              }
              try {
                setSubmitting(true);
                if (editingId) {
                  await updateProvinces(editingId, { name: n, code: c, region: selectedRegion });
                } else {
                  await createProvinces({ name: n, code: c, region: selectedRegion });
                }
                setName("");
                setCode("");
                setEditingId(null);
                queryClient.invalidateQueries({ queryKey: ["provinces"] });
                if (selectedRegion) queryClient.invalidateQueries({ queryKey: ["provinces", selectedRegion] });
              } catch (err) {
                console.error(err);
                setErrorMsg(editingId ? "No se pudo actualizar la provincia" : "No se pudo crear la provincia");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <h3 className="font-semibold">{editingId ? "Editar provincia" : "Crear provincia"}</h3>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">Nombre</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} disabled={submitting} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">Código</label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} disabled={submitting} />
            </div>
            {errorMsg && <span className="text-sm text-destructive">{errorMsg}</span>}
            <div className="flex justify-between gap-2">
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  className="hover:bg-secondary"
                  onClick={() => {
                    setEditingId(null);
                    setName("");
                    setCode("");
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
    </div>
  );
}

