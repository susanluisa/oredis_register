/* eslint-disable */

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { OrganizationType } from "@/lib/types/org-types"
import DeleteModal from "@/components/custom/DeleteModal"
import OrgDetailsDrawer from "./OrgDetailsDrawer"

export const OrganizationColumns = (
  onUpdate: (id: number, data: Partial<OrganizationType>) => Promise<void>,
  onDelete: (id: number) => Promise<void>,
  onEditDrawer?: (item: OrganizationType) => void,
): ColumnDef<OrganizationType>[] => [
  {
    accessorKey: "association_name",
    header: "Nombre de la Organización",
  },
  {
    accessorKey: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const handleDelete = async () => {
        await onDelete(row.original.id);
      }
      return (
        <div className="flex gap-2 justify-center">
          <OrgDetailsDrawer item={row.original} />
          <Button className="hover:bg-secondary" variant="outline" onClick={() => onEditDrawer?.(row.original)}>
            Editar
          </Button>
          <DeleteModal
            title="¿Desea eliminar esta Organización?"
            entityLabel={row.original.association_name}
            onConfirm={handleDelete}
          />
        </div>
      )
    }
  }
]

