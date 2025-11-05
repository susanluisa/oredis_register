/* eslint-disable */

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import DeleteModal from "@/components/custom/DeleteModal"
import { SurveyPCDType } from "@/lib/types/survey-types"

export const SurveyColumns = (
  onUpdate: (id: number, data: Partial<SurveyPCDType>) => Promise<void>,
  onDelete: (id: number) => Promise<void>
): ColumnDef<SurveyPCDType>[] => [{
  accessorKey: "id",
  header: "Nro de Encuesta",
},
{
  accessorKey: "actions",
  header: "Acciones",
  cell: ({ row, getValue }) => {
    const [isModalOpen, setModalOpen] = useState(false)
    const [newName, setNewName] = useState<string>(String(row.original.id))

    const handleSave = async () => {
      await onUpdate(row.original.id, {
        id: Number(newName),
      });
      setModalOpen(false);
    };

    const handleDelete = async () => {
      await onDelete(row.original.id);
    }

    return (
      <div className="flex gap-2 justify-center">
        <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="hover:bg-secondary" variant="outline" onClick={() => setModalOpen(true)}>
              Editar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Encuesta</DialogTitle>
            </DialogHeader>
            <div>
              <label className="text-sm text-gray-500">Nro de Encuesta</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{ width: "100%", resize: "none" }}
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button className="hover:bg-secondary" variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button className="hover:bg-secondary ml-2" onClick={handleSave} >
                Guardar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <DeleteModal
          title="¿Desea eliminar esta Encuesta?"
          entityLabel={row.original.id}
          onConfirm={handleDelete}
        />
      </div>
    )
  }
}
  ]

