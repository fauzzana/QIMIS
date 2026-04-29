"use client"

import * as React from "react"
import {
  IconHelp,
  IconBuildingWarehouse,
  IconPackages,
  IconSearch,
  IconSettings,
  IconHome,
  IconUsers,
  IconAsset,
  IconQrcode,
  IconLocation,
  IconCategory,
  IconFileDescription
} from "@tabler/icons-react"

import { NavMore } from "@/components/admin/layout/nav-more"
import { NavInventory } from "@/components/admin/layout/nav-inventory"
import { NavMain } from "@/components/admin/layout/nav-main"
import { NavSecondary } from "@/components/admin/layout/nav-secondary"
import { NavUser } from "@/components/admin/layout/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { fromJSONSchema } from "zod"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconHome,
    },
    {
      title: "Users",
      url: "/userManagement",
      icon: IconUsers,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: IconFileDescription
    }
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  inventory: [
    {
      name: "Data Assets",
      url: "/assetManagement",
      icon: IconAsset,
    },
    {
      name: "Data Items",
      url: "/inventoryManagement",
      icon: IconPackages,
    },
    {
      name: "Transaction Items",
      url: "/transaction",
      icon: IconBuildingWarehouse,
    },
    {
      name: "Scan QR Code",
      url: "/scan",
      icon: IconQrcode,
    },
  ],
  more: [
    {
      name: "Location",
      url: "/more/location",
      icon: IconLocation,
    },
    {
      name: "Category",
      url: "/more/category",
      icon: IconCategory,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ3a0IIFlETci2GfdYJrzQzro6EdP5-Ko5mw&s"
                  width={180}
                  height={180}
                  alt="Acme Inc."
                  className="size-5!"
                />
                <span className="text-base font-semibold">QIMIS</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavInventory items={data.inventory} />
        <NavMore items={data.more} ></NavMore>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
