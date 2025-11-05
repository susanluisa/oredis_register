"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/custom/Datatable";
import type { UserType } from "@/lib/types/user-types";
import { UserColumns } from "./UserTableColumns";
import { createUser, deleteUser, fetchUsers, updateUser } from "../services/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function UsersTable() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery<UserType[]>({
    queryKey: ["users"],
    queryFn: () => fetchUsers({ auth: true }),
  });

  const handleUpdate = async (id: number, newData: Partial<UserType>) => {
    try {
      await updateUser(id, newData);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.error("Error actualizando Usuario:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.error("Error eliminando Usuario:", error);
    }
  };

  // Create form state (inline, similar to CountriesTable)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onCreate = async () => {
    const u = username.trim();
    const e = email.trim();
    if (!u) {
      setErrorMsg("Ingresa el usuario");
      return;
    }
    if (!e) {
      setErrorMsg("Ingresa el email");
      return;
    }
    try {
      setSubmitting(true);
      await createUser({ username: u, email: e, first_name: firstName.trim(), last_name: lastName.trim(), password });
      setUsername("");
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (err) {
      console.error(err);
      setErrorMsg("No se pudo crear el usuario");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="pt-8 grid grid-cols-2 gap-4">
      <DataTable columns={UserColumns(handleUpdate, handleDelete)} data={data} />
      <div className="flex items-start p-4">
        <form
          className="w-full space-y-4 rounded-md border p-4 bg-background/60"
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg(null);
            await onCreate();
          }}
        >
          <h3 className="font-semibold">Crear usuario</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Usuario</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} disabled={submitting} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={submitting} />
          </div>
          <div className="flex gap-2">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">Nombre</label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={submitting} />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">Apellido</label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={submitting} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Contraseña</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={submitting} />
          </div>
          {errorMsg && <span className="text-sm text-destructive">{errorMsg}</span>}
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={submitting} className="hover:bg-secondary">
              {submitting ? "Creando..." : "Crear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

