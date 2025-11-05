/* eslint-disable */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import DeleteModal from "@/components/custom/DeleteModal";
import type { UserType } from "@/lib/types/user-types";

export const UserColumns = (
  onUpdate: (id: number, data: Partial<UserType>) => Promise<void>,
  onDelete: (id: number) => Promise<void>
): ColumnDef<UserType>[] => [
  {
    accessorKey: "username",
    header: "Usuario",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "first_name",
    header: "Nombre",
  },
  {
    accessorKey: "last_name",
    header: "Apellido",
  },
  {
    accessorKey: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const [isModalOpen, setModalOpen] = useState(false);
      const [username, setUsername] = useState<string>(row.original.username ?? "");
      const [email, setEmail] = useState<string>(row.original.email ?? "");
      const [firstName, setFirstName] = useState<string>(row.original.first_name ?? "");
      const [lastName, setLastName] = useState<string>(row.original.last_name ?? "");

      const handleSave = async () => {
        await onUpdate(row.original.id, {
          username,
          email,
          first_name: firstName,
          last_name: lastName,
        });
        setModalOpen(false);
      };

      const handleDelete = async () => {
        await onDelete(row.original.id);
      };

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
                <DialogTitle>Editar Usuario</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-500">Usuario</label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-500">Email</label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-sm text-gray-500">Nombre</label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-sm text-gray-500">Apellido</label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button className="hover:bg-secondary" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button className="hover:bg-secondary ml-2" onClick={handleSave}>
                  Guardar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <DeleteModal
            title="Desea eliminar este Usuario?"
            entityLabel={row.original.username}
            onConfirm={handleDelete}
          />
        </div>
      );
    },
  },
];

