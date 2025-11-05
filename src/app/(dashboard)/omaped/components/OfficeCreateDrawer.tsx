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
import type { Office } from "@/lib/types/office-types";
import { createOffice } from "../services/offices_services";

interface OfficeCreateDrawerProps {
  onCreated?: (item: Office) => void;
}

export default function OfficeCreateDrawer({ onCreated }: OfficeCreateDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<Office["type"] | null>("OMAPED");
  const [district, setDistrict] = React.useState<number | null>(null);
  const [address, setAddress] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const { data: districts = [], isLoading: loadingDistricts } = useDistricts();
  const districtOptions = React.useMemo(
    () => districts.map((d) => ({ value: d.id, label: d.name })),
    [districts]
  );

  const reset = () => {
    setName("");
    setType("OMAPED");
    setDistrict(null);
    setAddress("");
    setPhone("");
    setErrorMsg(null);
  };

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    setErrorMsg(null);
    const n = name.trim();
    if (!n) { setErrorMsg("Ingresa el nombre de la oficina"); return; }
    if (!type) { setErrorMsg("Selecciona el tipo"); return; }
    if (!district) { setErrorMsg("Selecciona el distrito"); return; }
    try {
      setSubmitting(true);
      const payload: Partial<Office> = {
        name: n,
        type,
        district,
        address: address.trim() || null,
        phone_number: phone.trim() || null,
      };
      const created = await createOffice(payload);
      onCreated?.(created);
      reset();
      setOpen(false);
    } catch (err) {
      console.error(err);
      setErrorMsg("No se pudo crear la oficina");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Agregar Oficina</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Nueva oficina</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={onSubmit} className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm text-muted-foreground">Nombre</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} disabled={submitting} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Tipo</label>
                <Combobox
                  options={[{ value: "OMAPED", label: "OMAPED" }, { value: "OREDIS", label: "OREDIS" }]}
                  value={type}
                  onChange={(v) => setType((v as Office["type"]) || null)}
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
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm text-muted-foreground">Teléfono</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={submitting} />
              </div>
            </div>
            {errorMsg && <span className="text-sm text-destructive">{errorMsg}</span>}
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

