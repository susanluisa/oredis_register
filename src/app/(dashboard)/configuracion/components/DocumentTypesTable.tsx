"use client";

import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/custom/Datatable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteModal from "@/components/custom/DeleteModal";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DocumentIdType } from "@/lib/types/common-settings-types";
import { createDocumentType, deleteDocumentType, updateDocumentType } from "../catalogos/services/document_types_services";
import { useDocumentTypes } from "@/hooks/use-document-types";

const document_type_columns = (
  onEdit: (item: DocumentIdType) => void,
  onDelete: (id: number) => Promise<void>
): ColumnDef<DocumentIdType>[] => [
  {
    accessorKey: "document",
    header: "Documento",
  },
  {
    accessorKey: "acronym",
    header: "Acrónimo",
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
            title="Desea eliminar este Tipo de documento?"
            entityLabel={row.original.document}
            onConfirm={handleDelete}
          />
        </div>
      );
    }
  }
];

export default function DocumentTypesTable() {
  const queryClient = useQueryClient();
  const { data: types = [], isLoading } = useDocumentTypes();
  const [docName, setDocName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteDocumentType(id);
      queryClient.invalidateQueries({ queryKey: ["document_types"] });
    } catch (error) {
      console.error("Error eliminando tipos de documento:", error);
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="pt-8 grid grid-cols-2">
      <DataTable columns={document_type_columns((item) => {
        setEditingId(item.id);
        setDocName(item.document);
        setAcronym(item.acronym);
      }, handleDelete)} data={types} />
      <div className="flex items-start p-4">
        <form
          className="w-full space-y-4 rounded-md border p-4 bg-background/60"
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg(null);
            const d = docName.trim();
            const a = acronym.trim();
            if (!d) {
              setErrorMsg("Ingresa el documento");
              return;
            }
            try {
              setSubmitting(true);
              if (editingId) {
                await updateDocumentType(editingId, { document: d, acronym: a });
              } else {
                await createDocumentType({ document: d, acronym: a });
              }
              setDocName("");
              setAcronym("");
              setEditingId(null);
              queryClient.invalidateQueries({ queryKey: ["document_types"] });
            } catch (err) {
              console.error(err);
              setErrorMsg(editingId ? "No se pudo actualizar el tipo" : "No se pudo crear el tipo de documento");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <h3 className="font-semibold">{editingId ? "Editar tipo de documento" : "Crear tipo de documento"}</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Documento</label>
            <Input
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="Ej. Documento Nacional de Identidad"
              disabled={submitting}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Acrónimo</label>
            <Input
              value={acronym}
              onChange={(e) => setAcronym(e.target.value)}
              placeholder="Ej. DNI, CE, PAS"
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
                  setDocName("");
                  setAcronym("");
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

