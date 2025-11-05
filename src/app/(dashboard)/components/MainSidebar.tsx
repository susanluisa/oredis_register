"use client"

import * as React from "react"
import {
  Accessibility,
  AudioWaveform,
  Building2,
  ClipboardCheck,
  Columns3Cog,
  Command,
  FileCog,
  GalleryVerticalEnd,
  HouseHeart,
  HousePlus,
  LayoutList,
  ListTodo,
  Settings,
  Users2,
} from "lucide-react"

import { NavItems } from './NavItems'
import { NavUser } from './nav-user'
import { RoleSwitcher } from './RoleSwitcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavItemsCollapse } from "./NavItemsCollapse"
import { usePathname } from "next/navigation"
import { OredisLogo } from "@/components/custom/Logo"
import { ModeToggle } from "@/components/theme-toggle"
import { title } from "process"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  roles: [
    {
      name: "Administrador",
      logo: GalleryVerticalEnd
    },
    {
      name: "Registrador",
      logo: AudioWaveform
    },
    {
      name: "Encuestador",
      logo: Command
    },
  ],
  collapseMenuItem: [
    {
      title: "Registro de PCDs",
      url: "",
      icon: Accessibility,
      isActive: true,
      items: [
        {
          title: "Registro - Padrón",
          url: "registro",
          icon: LayoutList
        },
        {
          title: "Encuesta",
          url: "encuesta",
          icon: ListTodo
        },
        {
          title: "Cuidadores",
          url: "cuidadores",
          icon: HouseHeart
        },
      ],
    },
    {
      title: "Organizaciones",
      url: "organizaciones",
      icon: Building2,
    },
    {
      title: "Reportes",
      url: "reportes",
      icon: ClipboardCheck,
    },
    {
      title: "OMAPED",
      url: "omaped",
      icon: HousePlus,
    },
    {
      title: "Configuración",
      url: "configuracion",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "configuracion/catalogos",
          icon: Columns3Cog
        },
        {
          title: "Usuarios",
          url: "configuracion/usuarios",
          icon: Users2
        },
        {
          title: "Encuestas",
          url: "configuracion/encuesta",
          icon: FileCog
        },
      ],
    },
  ],
  menuItem: [
    {
      name: "Organizaciones",
      url: "organizaciones",
      icon: Building2,
    },
    {
      name: "Reportes",
      url: "reportes",
      icon: ClipboardCheck,
    },
    {
      name: "OMAPED",
      url: "omaped",
      icon: HousePlus,
    },
    {
      name: "Configuración",
      url: "configuracion",
      icon: Settings,
    },
  ],
}

export function MainSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props} variant="floating" className="bg-transparent" >
      <SidebarHeader>
        {/* <OredisLogo></OredisLogo> */}
        <RoleSwitcher roles={data.roles} />
      </SidebarHeader>
      <SidebarContent className="bg-transparent">
        <NavItemsCollapse items={data.collapseMenuItem} />
        {/* <NavItems projects={data.menuItem} /> */}
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle></ModeToggle>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
