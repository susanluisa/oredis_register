"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/custom/Combobox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useDocumentTypes } from "@/hooks/use-document-types";
import { useCaregiverRoles } from "@/hooks/use-caregiver-roles";
import { RelatedPersonType } from "@/lib/types/pcd-types";
import { updateCaregiver } from "../../services/caregivers";

interface CaregiverEditDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: RelatedPersonType | null;
  onUpdated?: (item: RelatedPersonType) => void;
}

export default function CaregiverEditDrawer({ open, onOpenChange, item, onUpdated }: CaregiverEditDrawerProps) {
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [middleName, setMiddleName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [documentNumber, setDocumentNumber] = React.useState('');
  const [documentType, setDocumentType] = React.useState<number | null>(null);
  const [role, setRole] = React.useState<number | null>(null);

  const { data: docTypes = [], isLoading: loadingDocTypes } = useDocumentTypes();
  const { data: roles = [], isLoading: loadingRoles } = useCaregiverRoles();

  const docTypeOptions = React.useMemo(
    () => docTypes.map((d) => ({ value: d.id, label: d.document })),
    [docTypes]
  );

  const roleOptions = React.useMemo(
    () => roles.map((r) => ({ value: r.id, label: r.name })),
    [roles]
  );

  React.useEffect(() => {
    if (!open || !item) return;
    setFirstName(item.first_name ?? '');
    setLastName(item.last_name ?? '');
    setMiddleName(item.middle_name ?? '');
    setPhone(item.phone_number ?? '');
    setDocumentNumber(item.document_number ?? '');
    setDocumentType(item.document ?? null);
    setRole(item.role ?? null);
    setErrorMsg(null);
  }, [open, item]);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!item) return;
    setErrorMsg(null);

    const fn = firstName.trim();
    const ln = lastName.trim();
    if (!fn || !ln) {
      setErrorMsg('Ingresa nombre y apellidos');
      return;
    }
    if (!documentType) {
      setErrorMsg('Selecciona el tipo de documento');
      return;
    }
    if (!role) {
      setErrorMsg('Selecciona el rol');
      return;
    }
    if (!documentNumber.trim()) {
      setErrorMsg('Ingresa el número de documento');
      return;
    }

    try {
      setSubmitting(true);
      const payload: Partial<RelatedPersonType> = {
        first_name: fn,
        last_name: ln,
        middle_name: middleName.trim() || null,
        phone_number: phone.trim() || null,
        document_number: documentNumber.trim(),
        document: documentType,
        role: role,
      };
      const updated = await updateCaregiver(item.id, payload);
      onUpdated?.(updated);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      setErrorMsg('No se pudo actualizar el cuidador');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <span />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Editar cuidador</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={onSubmit} className="p-4 space-y-4">
            <div className='grid grid-cols-2 gap-3'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm text-muted-foreground'>Nombre</label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={submitting} />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm text-muted-foreground'>Apellidos</label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={submitting} />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm text-muted-foreground'>Segundo nombre</label>
                <Input value={middleName} onChange={(e) => setMiddleName(e.target.value)} disabled={submitting} />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm text-muted-foreground'>Teléfono</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={submitting} />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm text-muted-foreground'>Número de documento</label>
                <Input value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} disabled={submitting} />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm text-muted-foreground'>Tipo de documento</label>
                <Combobox
                  options={docTypeOptions}
                  value={documentType}
                  onChange={(v) => setDocumentType(typeof v === 'number' ? v : v ? Number(v) : null)}
                  loading={loadingDocTypes}
                  disabled={submitting}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm text-muted-foreground'>Rol</label>
                <Combobox
                  options={roleOptions}
                  value={role}
                  onChange={(v) => setRole(typeof v === 'number' ? v : v ? Number(v) : null)}
                  loading={loadingRoles}
                  disabled={submitting}
                />
              </div>
            </div>
            {errorMsg && <span className='text-sm text-destructive'>{errorMsg}</span>}
          </form>
          <DrawerFooter>
            <Button onClick={onSubmit as any} disabled={submitting}>
              {submitting ? 'Guardando...' : 'Guardar'}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" disabled={submitting}>Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

