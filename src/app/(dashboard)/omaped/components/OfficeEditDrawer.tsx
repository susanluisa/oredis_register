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
import { updateOffice } from "../services/offices_services";

interface OfficeEditDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Office | null;
  onUpdated?: (item: Office) => void;
}

export default function OfficeEditDrawer({ open, onOpenChange, item, onUpdated }: OfficeEditDrawerProps) {
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

  React.useEffect(() => {
    if (!open || !item) return;
    setName(item.name ?? "");
    setType(item.type ?? "OMAPED");
    setDistrict(item.district ?? null);
    setAddress(item.address ?? "");
    setPhone(item.phone_number ?? "");
    setErrorMsg(null);
  }, [open, item]);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!item) return;
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
      const updated = await updateOffice(item.id, payload);
      onUpdated?.(updated);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      setErrorMsg("No se pudo actualizar la oficina");
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
            <DrawerTitle>Editar oficina</DrawerTitle>
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
              {submitting ? 'Actualizando...' : 'Actualizar'}
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

