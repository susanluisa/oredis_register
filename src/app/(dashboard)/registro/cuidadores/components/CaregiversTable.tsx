"use client";

import { useMemo, useState } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/custom/Datatable';
import DeleteModal from '@/components/custom/DeleteModal';
import { Button } from '@/components/ui/button';
import CaregiverDrawer from './CaregiverDrawer';
import CaregiverDetails from './CaregiverDetails';
import CaregiverEditDrawer from './CaregiverEditDrawer';

import { RelatedPersonType } from '@/lib/types/pcd-types';
import { useDocumentTypes } from '@/hooks/use-document-types';
import { useCaregiverRoles } from '@/hooks/use-caregiver-roles';
import { deleteCaregiver, fetchCaregivers } from '../../services/caregivers';

function useLookupOptions() {
  const { data: docTypes = [], isLoading: loadingDocTypes } = useDocumentTypes();
  const { data: roles = [], isLoading: loadingRoles } = useCaregiverRoles();

  const docTypeMap = useMemo(() => {
    const m = new Map<number, string>();
    docTypes.forEach((d) => m.set(d.id, d.document));
    return m;
  }, [docTypes]);

  const roleMap = useMemo(() => {
    const m = new Map<number, string>();
    roles.forEach((r) => m.set(r.id, r.name));
    return m;
  }, [roles]);

  return { docTypeMap, roleMap, loadingDocTypes, loadingRoles };
}

const caregiversColumns = (
  docTypeMap: Map<number, string>,
  roleMap: Map<number, string>,
  onDelete: (id: number) => Promise<void>,
  onView: (item: RelatedPersonType) => void,
  onEdit: (item: RelatedPersonType) => void,
): ColumnDef<RelatedPersonType>[] => [
    { accessorKey: 'first_name', header: 'Nombre' },
    { accessorKey: 'last_name', header: 'Apellidos' },
    { accessorKey: 'middle_name', header: 'Segundo nombre' },
    { accessorKey: 'phone_number', header: 'Telefono' },
    { accessorKey: 'document_number', header: 'Numero Documento' },
    {
      accessorKey: 'document',
      header: 'Tipo Documento',
      cell: ({ row }) => docTypeMap.get(row.original.document) ?? row.original.document,
    },
    {
      accessorKey: 'role',
      header: 'Rol',
      cell: ({ row }) => roleMap.get(row.original.role) ?? row.original.role,
    },
    {
      accessorKey: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const handleDelete = async () => {
          await onDelete(row.original.id);
        };
        return (
          <div className='flex gap-2 justify-center'>
            <Button className='hover:bg-secondary' variant='outline' onClick={() => onView(row.original)}>Ver</Button>
            <Button className='hover:bg-secondary' variant='outline' onClick={() => onEdit(row.original)}>Editar</Button>
            <DeleteModal title='Desea eliminar este cuidador?' entityLabel={`${row.original.first_name} ${row.original.last_name}`} onConfirm={handleDelete} />
          </div>
        );
      },
    },
  ];

export default function CaregiversTable() {
  const queryClient = useQueryClient();
  const { data: caregivers = [], isLoading } = useQuery({
    queryKey: ['caregivers'],
    queryFn: () => fetchCaregivers({ auth: true }),
  });

  const { docTypeMap, roleMap } = useLookupOptions();

  const [viewItem, setViewItem] = useState<RelatedPersonType | null>(null);
  const [editItem, setEditItem] = useState<RelatedPersonType | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteCaregiver(id);
      queryClient.invalidateQueries({ queryKey: ['caregivers'] });
    } catch (error) {
      console.error('Error eliminando cuidador:', error);
    }
  };

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className='pt-4'>
      <div className='flex justify-between items-center p-4'>
        <div className='text-xl pb-2'>Listado de Cuidadores</div>
        <CaregiverDrawer onCreated={() => queryClient.invalidateQueries({ queryKey: ['caregivers'] })} />
      </div>
      <div>
        <DataTable
          columns={caregiversColumns(
            docTypeMap,
            roleMap,
            handleDelete,
            (item) => setViewItem(item),
            (item) => setEditItem(item)
          )}
          data={caregivers}
        />
      </div>
      <CaregiverDetails open={!!viewItem} onOpenChange={(o) => !o && setViewItem(null)} item={viewItem} />
      <CaregiverEditDrawer
        open={!!editItem}
        onOpenChange={(o) => !o && setEditItem(null)}
        item={editItem}
        onUpdated={() => {
          queryClient.invalidateQueries({ queryKey: ['caregivers'] });
          setEditItem(null);
        }}
      />
    </div>
  );
}

