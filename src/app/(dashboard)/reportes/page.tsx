"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/custom/Datatable";
import { ColumnDef } from "@tanstack/react-table";
import { OrganizationType } from "@/lib/types/org-types";
import { RelatedPersonType } from "@/lib/types/pcd-types";
import { fetchOrgs } from "../organizaciones/services/organization";
import { fetchCaregivers } from "../registro/services/caregivers";
import { useDistricts } from "@/hooks/use-districts";
import { useDocumentTypes } from "@/hooks/use-document-types";
import { useCaregiverRoles } from "@/hooks/use-caregiver-roles";

function downloadCsv(filename: string, rows: Record<string, any>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const esc = (val: any) => {
    const s = String(val ?? "");
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => esc(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { data: districts = [] } = useDistricts();
  const { data: docTypes = [] } = useDocumentTypes();
  const { data: roles = [] } = useCaregiverRoles();

  const { data: orgs = [], isLoading: loadingOrgs } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => fetchOrgs({ auth: true }),
  });
  const { data: caregivers = [], isLoading: loadingCaregivers } = useQuery({
    queryKey: ["caregivers"],
    queryFn: () => fetchCaregivers({ auth: true }),
  });

  const districtName = (id?: number | null) => districts.find(d => d.id === id)?.name ?? String(id ?? "");
  const docName = (id?: number | null) => docTypes.find(d => d.id === id)?.document ?? String(id ?? "");
  const roleName = (id?: number | null) => roles.find(r => r.id === id)?.name ?? String(id ?? "");

  const orgColumns: ColumnDef<OrganizationType>[] = useMemo(() => ([
    { accessorKey: "association_name", header: "Organización" },
    { accessorKey: "legal_representative_name", header: "Rep. Nombre" },
    { accessorKey: "legal_representative_lastname", header: "Rep. Apellido" },
    { accessorKey: "position", header: "Cargo" },
    { accessorKey: "associated_quantity", header: "Asociados" },
    { accessorKey: "district", header: "Distrito", cell: ({ row }) => districtName(row.original.district) },
    { accessorKey: "phone_number", header: "Teléfono" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "address", header: "Dirección" },
  ]), [districts]);

  const caregiverColumns: ColumnDef<RelatedPersonType>[] = useMemo(() => ([
    { accessorKey: "first_name", header: "Nombre" },
    { accessorKey: "last_name", header: "Apellido" },
    { accessorKey: "middle_name", header: "Segundo nombre" },
    { accessorKey: "document_number", header: "N° Documento" },
    { accessorKey: "document", header: "Tipo Doc.", cell: ({ row }) => docName(row.original.document) },
    { accessorKey: "role", header: "Rol", cell: ({ row }) => roleName(row.original.role) },
    { accessorKey: "phone_number", header: "Teléfono" },
  ]), [docTypes, roles]);

  const orgsCsv = orgs.map(o => ({
    organizacion: o.association_name,
    representante_nombre: o.legal_representative_name,
    representante_apellido: o.legal_representative_lastname,
    cargo: o.position,
    asociados: o.associated_quantity,
    distrito: districtName(o.district),
    telefono: o.phone_number,
    email: o.email,
    direccion: o.address,
  }));

  const caregiversCsv = caregivers.map(c => ({
    nombre: c.first_name,
    apellido: c.last_name,
    segundo_nombre: c.middle_name ?? "",
    nro_documento: c.document_number ?? "",
    tipo_documento: docName(c.document),
    rol: roleName(c.role),
    telefono: c.phone_number ?? "",
  }));

  return (
    <section className="min-h-screen">
      <div className="mx-auto flex w-full pl-4 pr-4 flex-col gap-6">
        <header className="space-y-2 justify-between flex flex-row items-center">
          <h1 className="text-2xl font-semibold text-foreground">Reportes</h1>
        </header>
        <main className="space-y-4">
          <Tabs defaultValue="orgs">
            <TabsList>
              <TabsTrigger value="orgs">Organizaciones</TabsTrigger>
              <TabsTrigger value="caregivers">Cuidadores</TabsTrigger>
            </TabsList>
            <TabsContent value="orgs" className="space-y-3">
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => downloadCsv("organizaciones.csv", orgsCsv)}>Exportar CSV</Button>
              </div>
              {loadingOrgs ? <p>Cargando...</p> : <DataTable columns={orgColumns} data={orgs} />}
            </TabsContent>
            <TabsContent value="caregivers" className="space-y-3">
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => downloadCsv("cuidadores.csv", caregiversCsv)}>Exportar CSV</Button>
              </div>
              {loadingCaregivers ? <p>Cargando...</p> : <DataTable columns={caregiverColumns} data={caregivers} />}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </section>
  );
}
