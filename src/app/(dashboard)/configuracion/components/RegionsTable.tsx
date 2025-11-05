"use client";

import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/custom/Datatable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteModal from "@/components/custom/DeleteModal";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { RegionType } from "@/lib/types/common-settings-types";
import { createRegions, deleteRegions, updateRegions } from "../catalogos/services/regions_services";
import { Combobox } from "@/components/custom/Combobox";
import { useCountries } from "@/hooks/use-countries";
import { useRegionsByCountry } from "@/hooks/use-regions";

const region_columns = (
  onEdit: (item: RegionType) => void,
  onDelete: (id: number) => Promise<void>
): ColumnDef<RegionType>[] => [
  {
    accessorKey: "name",
    header: "Región",
  },
  {
    accessorKey: "code",
    header: "Código ISO",
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
            title="Desea eliminar esta Región?"
            entityLabel={row.original.name}
            onConfirm={handleDelete}
          />
        </div>
      );
    }
  }
];

export default function RegionsTable() {
  const queryClient = useQueryClient();

  const [selectedCountry, setSelectedCountry] = useState<number | null>(1);

  const { data: countries = [], isLoading: loadingCountries } = useCountries();
  const { data: regionsByCountry = [], isLoading: loadingRegionsByCountry } = useRegionsByCountry(selectedCountry ?? undefined)

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteRegions(id);
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      if (selectedCountry) queryClient.invalidateQueries({ queryKey: ["regions", selectedCountry] });
    } catch (error) {
      console.error("Error eliminando Región:", error);
    }
  };

  if (loadingRegionsByCountry) return <p>Cargando...</p>;

  const countryOptions = countries.map((item) => ({
    value: item.id,
    label: item.name
  })) ?? [];

  return (
    <div className="pt-8 flex flex-col gap-4">
      <div>
        <Combobox
          options={countryOptions}
          value={selectedCountry}
          onChange={(val) => setSelectedCountry(val as number | null)}
          placeholder="Selecciona un país..."
        />
      </div>
      <div className="grid grid-cols-2">
        <DataTable columns={region_columns((item) => {
          setEditingId(item.id);
          setName(item.name);
          setCode(item.code);
          setSelectedCountry(item.country ?? selectedCountry);
        }, handleDelete)} data={regionsByCountry} />
        <div className="flex items-start p-4">
          <form
            className="w-full space-y-4 rounded-md border p-4 bg-background/60"
            onSubmit={async (e) => {
              e.preventDefault();
              setErrorMsg(null);
              const n = name.trim();
              const c = code.trim();
              if (!n || !selectedCountry) {
                setErrorMsg(!n ? "Ingresa el nombre" : "Selecciona un país");
                return;
              }
              try {
                setSubmitting(true);
                if (editingId) {
                  await updateRegions(editingId, { name: n, code: c, country: selectedCountry });
                } else {
                  await createRegions({ name: n, code: c, country: selectedCountry });
                }
                setName("");
                setCode("");
                setEditingId(null);
                queryClient.invalidateQueries({ queryKey: ["regions"] });
                queryClient.invalidateQueries({ queryKey: ["regions", selectedCountry] });
              } catch (err) {
                console.error(err);
                setErrorMsg(editingId ? "No se pudo actualizar la región" : "No se pudo crear la región");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <h3 className="font-semibold">{editingId ? "Editar región" : "Crear región"}</h3>
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

