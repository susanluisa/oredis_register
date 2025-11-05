"use client";

import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/custom/Datatable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteModal from "@/components/custom/DeleteModal";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DistrictType } from "@/lib/types/common-settings-types";
import { createDistricts, deleteDistricts, updateDistricts } from "../catalogos/services/districts_services";
import { Combobox } from "@/components/custom/Combobox";
import { useCountries } from "@/hooks/use-countries";
import { useRegionsByCountry } from "@/hooks/use-regions";
import { useProvincesByRegion } from "@/hooks/use-provinces";
import { useDistrictsByProvince } from "@/hooks/use-districts";

const district_columns = (
  onEdit: (item: DistrictType) => void,
  onDelete: (id: number) => Promise<void>
): ColumnDef<DistrictType>[] => [
  {
    accessorKey: "name",
    header: "Distrito",
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
            title="Desea eliminar este Distrito?"
            entityLabel={row.original.name}
            onConfirm={handleDelete}
          />
        </div>
      )
    }
  }
];

export default function DistrictsTable() {
  const queryClient = useQueryClient();
  const [selectedCountry, setSelectedCountry] = useState<number | null>(1);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);

  const { data: countries = [], isLoading: loadingCountries } = useCountries();
  const { data: regions = [], isLoading: loadingRegions } = useRegionsByCountry(selectedCountry ?? undefined);
  const { data: provinces = [], isLoading: loadingProvinces } = useProvincesByRegion(selectedRegion ?? undefined);
  const { data: districts = [], isLoading: loadingDistricts } = useDistrictsByProvince(selectedProvince ?? undefined);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteDistricts(id);
      queryClient.invalidateQueries({ queryKey: ["districts"] });
      if (selectedProvince) queryClient.invalidateQueries({ queryKey: ["districts", selectedProvince] });
    } catch (error) {
      console.error("Error eliminando Distritos:", error);
    }
  };

  if (loadingCountries || loadingRegions || loadingProvinces || loadingDistricts) return <p>Cargando...</p>;

  const countryOptions = countries.map((item) => ({ value: item.id, label: item.name })) ?? [];
  const regionOptions = regions.map((item) => ({ value: item.id, label: item.name })) ?? [];
  const provinceOptions = provinces.map((item) => ({ value: item.id, label: item.name })) ?? [];

  return (
    <div className="pt-8 flex flex-col gap-4">
      <div className="flex gap-4">
        <Combobox
          options={countryOptions}
          value={selectedCountry}
          onChange={(val) => {
            setSelectedCountry(val as number | null);
            setSelectedRegion(null);
            setSelectedProvince(null);
          }}
          placeholder="Selecciona un país..."
        />
        <Combobox
          options={regionOptions}
          value={selectedRegion}
          onChange={(val) => {
            setSelectedRegion(val as number | null);
            setSelectedProvince(null);
          }}
          placeholder="Selecciona una región..."
          disabled={!selectedCountry}
        />
        <Combobox
          options={provinceOptions}
          value={selectedProvince}
          onChange={(val) => setSelectedProvince(val as number | null)}
          placeholder="Selecciona una provincia..."
          disabled={!selectedRegion}
        />
      </div>
      <div className="grid grid-cols-2">
        <DataTable columns={district_columns((item) => {
          setEditingId(item.id);
          setName(item.name);
          setCode(item.code);
        }, handleDelete)} data={districts} />
        <div className="flex items-start p-4">
          <form
            className="w-full space-y-4 rounded-md border p-4 bg-background/60"
            onSubmit={async (e) => {
              e.preventDefault();
              setErrorMsg(null);
              const n = name.trim();
              const c = code.trim();
              if (!n || !selectedProvince) {
                setErrorMsg(!n ? "Ingresa el nombre" : "Selecciona una provincia");
                return;
              }
              try {
                setSubmitting(true);
                if (editingId) {
                  await updateDistricts(editingId, { name: n, code: c, province: selectedProvince });
                } else {
                  await createDistricts({ name: n, code: c, province: selectedProvince });
                }
                setName("");
                setCode("");
                setEditingId(null);
                queryClient.invalidateQueries({ queryKey: ["districts"] });
                if (selectedProvince) queryClient.invalidateQueries({ queryKey: ["districts", selectedProvince] });
              } catch (err) {
                console.error(err);
                setErrorMsg(editingId ? "No se pudo actualizar el distrito" : "No se pudo crear el distrito");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <h3 className="font-semibold">{editingId ? "Editar distrito" : "Crear distrito"}</h3>
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

