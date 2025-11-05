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
import { useDistricts } from "@/hooks/use-districts";
import { createOrgs } from "../services/organization";
import { OrganizationType } from "@/lib/types/org-types";
import { useDisabilities } from "@/hooks/use-disabilities";

interface OrgCreateDrawerProps {
  onCreated?: (item: OrganizationType) => void;
}

export default function OrgCreateDrawer({ onCreated }: OrgCreateDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [associationName, setAssociationName] = React.useState("");
  const [repName, setRepName] = React.useState("");
  const [repLastname, setRepLastname] = React.useState("");
  const [position, setPosition] = React.useState("");
  const [associatedQty, setAssociatedQty] = React.useState<string>("");
  const [selectedDisability, setSelectedDisability] = React.useState<number | null>(null);
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [district, setDistrict] = React.useState<number | null>(null);

  const { data: districts = [], isLoading: loadingDistricts } = useDistricts();
  const { data: disabilities = [], isLoading: loadingDisabilities } = useDisabilities();
  const districtOptions = React.useMemo(
    () => districts.map((d) => ({ value: d.id, label: d.name })),
    [districts]
  );
  const disabilityOptions = React.useMemo(
    () => disabilities.map((d) => ({ value: d.id, label: d.type })),
    [disabilities]
  );

  const reset = () => {
    setAssociationName("");
    setRepName("");
    setRepLastname("");
    setPosition("");
    setAssociatedQty("");
    setSelectedDisability(null);
    setPhone("");
    setAddress("");
    setEmail("");
    setDistrict(null);
    setErrorMsg(null);
  };

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    setErrorMsg(null);

    if (!associationName.trim()) {
      setErrorMsg("Ingresa el nombre de la organización");
      return;
    }
    if (!district) {
      setErrorMsg("Selecciona el distrito");
      return;
    }
    if (!selectedDisability) {
      setErrorMsg("Selecciona la discapacidad");
      return;
    }

    try {
      setSubmitting(true);
      const payload: Partial<OrganizationType> = {
        association_name: associationName.trim(),
        legal_representative_name: repName.trim(),
        legal_representative_lastname: repLastname.trim(),
        district: district,
        position: position.trim(),
        associated_quantity: associatedQty ? Number(associatedQty) : 0,
        disability: selectedDisability,
        phone_number: phone.trim(),
        address: address.trim(),
        email: email.trim(),
      };
      const created = await createOrgs(payload);
      onCreated?.(created);
      reset();
      setOpen(false);
    } catch (err) {
      console.error(err);
      setErrorMsg("No se pudo crear la organización");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Nueva organización</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Crear Organización</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={onSubmit} className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm text-muted-foreground">Nombre de la organización</label>
                <Input value={associationName} onChange={(e) => setAssociationName(e.target.value)} disabled={submitting} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Nombre representante</label>
                <Input value={repName} onChange={(e) => setRepName(e.target.value)} disabled={submitting} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Apellido representante</label>
                <Input value={repLastname} onChange={(e) => setRepLastname(e.target.value)} disabled={submitting} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Cargo</label>
                <Input value={position} onChange={(e) => setPosition(e.target.value)} disabled={submitting} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Cantidad asociados</label>
                <Input type="number" value={associatedQty} onChange={(e) => setAssociatedQty(e.target.value)} disabled={submitting} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Discapacidad</label>
                <Combobox
                  options={disabilityOptions}
                  value={selectedDisability}
                  onChange={(v) => setSelectedDisability(typeof v === 'number' ? v : v ? Number(v) : null)}
                  loading={loadingDisabilities}
                  disabled={submitting}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Distrito</label>
                <Combobox
                  options={districtOptions}
                  value={district}
                  onChange={(v) => setDistrict(typeof v === 'number' ? v : v ? Number(v) : null)}
                  loading={loadingDistricts}
                  disabled={submitting}
                />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm text-muted-foreground">Dirección</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} disabled={submitting} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Teléfono</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={submitting} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={submitting} />
              </div>
            </div>
            {errorMsg && <span className='text-sm text-destructive'>{errorMsg}</span>}
          </form>
          <DrawerFooter>
            <Button onClick={onSubmit as any} disabled={submitting}>
              {submitting ? 'Creando...' : 'Crear'}
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
