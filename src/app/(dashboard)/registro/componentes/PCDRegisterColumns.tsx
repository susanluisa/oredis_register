/* eslint-disable */
"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { PCDType } from "@/lib/types/pcd-types"

export const PCDRegisterColumns = (
  onUpdate: (id: number, data: Partial<PCDType>) => Promise<void>,
  onDelete: (id: number) => Promise<void>
): ColumnDef<PCDType>[] => [
    {
      accessorKey: "name",
      header: "Nombres",
    },
    {
      accessorKey: "last_name",
      header: "Apellidos",
    },
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const [detailsOpen, setDetailsOpen] = useState(false)
        const [editOpen, setEditOpen] = useState(false)

        const p = row.original

        return (
          <div className="flex gap-2 justify-center">
            {/* === DETALLES === */}
            <Button
              className="hover:bg-secondary"
              variant="outline"
              onClick={() => setDetailsOpen(true)}
            >
              Detalles
            </Button>

            <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
              <SheetContent side="right" className="w-full sm:w-[420px]">
                <SheetHeader>
                  <SheetTitle>Detalles del Registro</SheetTitle>
                </SheetHeader>
                <div className="p-4 grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nombre: </span>
                    <span className="font-medium">{p.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Primer Apellido: </span>
                    <span className="font-medium">{p.first_surname}</span>
                  </div>
                  {p.second_surname && (
                    <div>
                      <span className="text-muted-foreground">Segundo Apellido: </span>
                      <span className="font-medium">{p.second_surname}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Documento: </span>
                    <span className="font-medium">{p.document_number}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tipo documento: </span>
                    <span className="font-medium">{p.document_type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nacimiento: </span>
                    <span className="font-medium">{p.birth_date}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Género: </span>
                    <span className="font-medium">{p.gender}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nacionalidad: </span>
                    <span className="font-medium">{p.nationality}</span>
                  </div>
                  {p.email && (
                    <div>
                      <span className="text-muted-foreground">Email: </span>
                      <span className="font-medium">{p.email}</span>
                    </div>
                  )}
                  {p.phone_number && (
                    <div>
                      <span className="text-muted-foreground">Teléfono: </span>
                      <span className="font-medium">{p.phone_number}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Dirección: </span>
                    <span className="font-medium">{p.address}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Distrito: </span>
                    <span className="font-medium">{p.district}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Discapacidad: </span>
                    <span className="font-medium">{p.disability}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Creado: </span>
                    <span className="font-medium">{p.created_at}</span>
                  </div>
                </div>
                <SheetFooter className="flex justify-end gap-2">
                  <SheetClose asChild>
                    <Button variant="outline">Cerrar</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* === EDITAR === */}
            <Button
              className="hover:bg-secondary"
              variant="outline"
              onClick={() => setEditOpen(true)}
            >
              Editar
            </Button>

            <Sheet open={editOpen} onOpenChange={setEditOpen}>
              <SheetContent
                side="right"
                className="w-[800px] sm:max-w-none "              >
                <SheetHeader>
                  <SheetTitle>Editar</SheetTitle>
                </SheetHeader>

                <div className="grid grid-cols-2 gap-4 p-6 h-full overflow-y-auto">
                  <div className="grid gap-1">
                    <label className="text-xs text-muted-foreground">Nombre</label>
                    <Input value={p.name} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs text-muted-foreground">Apellido</label>
                    <Input value={p.first_surname} readOnly />
                  </div>
                  {p.second_surname && (
                    <div className="grid gap-2">
                      <label className="text-xs text-muted-foreground">Segundo nombre</label>
                      <Input value={p.second_surname} readOnly />
                    </div>
                  )}
                  <div className="grid gap-2">
                    <label className="text-xs text-muted-foreground">Documento</label>
                    <Input value={p.document_number} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs text-muted-foreground">Tipo documento</label>
                    <Input value={`${p.document_type}`} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs text-muted-foreground">Nacimiento</label>
                    <Input value={p.birth_date} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs text-muted-foreground">Género</label>
                    <Input value={p.gender} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs text-muted-foreground">Nacionalidad</label>
                    <Input value={p.nationality || ""} readOnly />
                  </div>
                  {p.email && (
                    <div className="grid gap-2">
                      <label className="text-xs text-muted-foreground">Email</label>
                      <Input value={p.email} readOnly />
                    </div>
                  )}
                  {p.phone_number && (
                    <div className="grid gap-2">
                      <label className="text-xs text-muted-foreground">Teléfono</label>
                      <Input value={p.phone_number} readOnly />
                    </div>
                  )}
                  <div className="grid gap-2">
                    <label className="text-xs text-muted-foreground">Dirección</label>
                    <Input value={p.address} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs text-muted-foreground">Distrito</label>
                    <Input value={`${p.district}`} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs text-muted-foreground">Discapacidad</label>
                    <Input value={`${p.disability}`} readOnly />
                  </div>
                </div>

                <SheetFooter className="flex justify-end gap-2">
                  <SheetClose asChild>
                    <Button variant="outline">Cerrar</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        )
      },
    },
  ]
