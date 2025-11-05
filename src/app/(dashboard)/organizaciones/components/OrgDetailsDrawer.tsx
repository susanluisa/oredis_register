"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { OrganizationType } from "@/lib/types/org-types";
import { useDistricts } from "@/hooks/use-districts";

interface OrgDetailsDrawerProps {
  item: OrganizationType;
}

export default function OrgDetailsDrawer({ item }: OrgDetailsDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const { data: districts = [] } = useDistricts();
  const districtName = React.useMemo(() => districts.find(d => d.id === item.district)?.name ?? String(item.district), [districts, item]);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Detalles</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Detalles de la organización</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-2 text-sm">
            <div><span className="text-muted-foreground">Nombre: </span><span className="font-medium">{item.association_name}</span></div>
            <div><span className="text-muted-foreground">Representante: </span><span className="font-medium">{item.legal_representative_name} {item.legal_representative_lastname}</span></div>
            <div><span className="text-muted-foreground">Cargo: </span><span className="font-medium">{item.position}</span></div>
            <div><span className="text-muted-foreground">Asociados: </span><span className="font-medium">{item.associated_quantity}</span></div>
            <div><span className="text-muted-foreground">Discapacidad (id): </span><span className="font-medium">{item.disability}</span></div>
            <div><span className="text-muted-foreground">Distrito: </span><span className="font-medium">{districtName}</span></div>
            <div><span className="text-muted-foreground">Dirección: </span><span className="font-medium">{item.address}</span></div>
            <div><span className="text-muted-foreground">Teléfono: </span><span className="font-medium">{item.phone_number}</span></div>
            <div><span className="text-muted-foreground">Email: </span><span className="font-medium">{item.email}</span></div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

