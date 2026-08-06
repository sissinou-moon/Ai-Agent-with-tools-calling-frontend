"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  MessageSquareIcon,
  ZapIcon,
  CalendarIcon,
  WebhookIcon,
  LinkIcon,
} from "lucide-react";

const navItems = [
  {
    title: "Conversation",
    href: "/",
    icon: MessageSquareIcon,
  },
  {
    title: "Automation",
    href: "/automation",
    icon: ZapIcon,
  },
  {
    title: "Webhook",
    href: "/webhook",
    icon: WebhookIcon,
  },
  {
    title: "Connections",
    href: "/connections",
    icon: LinkIcon,
  },
];


export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                render={<Link href={item.href} />}
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
