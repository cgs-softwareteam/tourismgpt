"use client";

import { useRouter } from "next/navigation";
import { memo } from "react";
import { useWindowSize } from "usehooks-ts";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "./icons";
import { useSidebar } from "./ui/sidebar";

function PureChatHeader({
  chatId,
  isReadonly,
}: {
  chatId: string;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  return (
    <header className="sticky top-0 flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-primary/10 px-2 py-1.5 md:px-2 z-10 shadow-sm">
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Button
          className="order-2 ml-auto h-8 px-2 md:order-1 md:ml-0 md:h-fit md:px-2 bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 transition-all duration-200"
          onClick={() => {
            router.push("/");
            router.refresh();
          }}
          variant="default"
        >
          <PlusIcon />
          <span className="md:sr-only">New Chat</span>
        </Button>
      )}

      <div className="order-3 hidden md:ml-auto md:flex" />
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.chatId === nextProps.chatId &&
    prevProps.isReadonly === nextProps.isReadonly
  );
});
