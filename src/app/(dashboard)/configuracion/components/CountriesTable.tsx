"use client";

import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/custom/Datatable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteModal from "@/components/custom/DeleteModal";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { createCountries, deleteCountries, updateCountries } from "../catalogos/services/countries_services";
import { CountryType } from "@/lib/types/common-settings-types";
import { useCountries } from "@/hooks/use-countries";

const country_columns = (
  onEdit: (item: CountryType) => void,
  onDelete: (id: number) => Promise<void>
): ColumnDef<CountryType>[] => [
  {
    accessorKey: "name",
    header: "País",
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
            title="Desea eliminar este País?"
            entityLabel={row.original.name}
            onConfirm={handleDelete}
          />
        </div>
      );
    }
  }
];

export default function CountriesTable() {
  const queryClient = useQueryClient();
  const { data: countries = [], isLoading: loadingCountries } = useCountries();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteCountries(id);
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    } catch (error) {
      console.error("Error eliminando Países:", error);
    }
  };

  if (loadingCountries) return <p>Cargando...</p>;

  return (
    <div className="pt-8 grid grid-cols-2">
      <DataTable
        columns={country_columns((item) => {
          setEditingId(item.id);
          setName(item.name);
          setCode(item.code);
        }, handleDelete)}
        data={countries}
      />
      <div className="flex items-start p-4">
        <form
          className="w-full space-y-4 rounded-md border p-4 bg-background/60"
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg(null);
            const n = name.trim();
            const c = code.trim();
            if (!n) {
              setErrorMsg("Ingresa el nombre");
              return;
            }
            try {
              setSubmitting(true);
              if (editingId) {
                await updateCountries(editingId, { name: n, code: c });
              } else {
                await createCountries({ name: n, code: c });
              }
              setName("");
              setCode("");
              setEditingId(null);
              queryClient.invalidateQueries({ queryKey: ["countries"] });
            } catch (err) {
              console.error(err);
              setErrorMsg(editingId ? "No se pudo actualizar el país" : "No se pudo crear el país");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <h3 className="font-semibold">{editingId ? "Editar país" : "Crear país"}</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Nombre</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} disabled={submitting} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Código ISO</label>
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
  );
}

