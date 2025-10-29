"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "next-auth";
import { PlusIcon } from "@/components/icons";
import { SidebarHistory } from "@/components/sidebar-history";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0 bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <SidebarHeader className="border-b border-primary/10">
        <SidebarMenu>
          <div className="flex flex-row items-center justify-between">
            <Link
              className="flex flex-row items-center gap-3"
              href="/chat"
              onClick={() => {
                setOpenMobile(false);
              }}
            >
              <div className="text-2xl">🌍</div>
              <span className="cursor-pointer rounded-md px-2 font-semibold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                TourismSpot GPT
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="h-8 p-1 md:h-fit md:p-2 bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 transition-all duration-200"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push("/chat");
                    router.refresh();
                  }}
                  type="button"
                  variant="default"
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end" className="hidden md:block">
                New Chat
              </TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter className="border-t border-primary/10">{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
