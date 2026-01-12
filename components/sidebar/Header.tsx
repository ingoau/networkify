"use client";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGraphState } from "@/lib/state";
import { cn } from "@/lib/utils";
import { ExternalLink, PanelRightClose, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export function Header({
  updateGraphAction: updateGraph,
  setSidebarOpenAction: setSidebarOpen,
}: {
  updateGraphAction: () => void;
  setSidebarOpenAction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const isMobile = useIsMobile();
  const { setGraphKey } = useGraphState();

  return (
    <div
      className={cn(
        "flex flex-col sticky top-0 bg-background border-b z-30",
        isMobile && "border-t mt-4",
      )}
    >
      <div className="w-full flex flex-row items-center">
        <div className="font-bold px-2">networkify</div>
        <div className="grow"></div>
        <Button variant="ghost" size="lg" className="border-x" asChild>
          <Link href="https://github.com/Inglan/networkify" target="_blank">
            Source code
            <ExternalLink />
          </Link>
        </Button>
        <Button
          size="icon-lg"
          variant="ghost"
          onClick={() => {
            setSidebarOpen(false);
          }}
        >
          {isMobile ? <X /> : <PanelRightClose />}
        </Button>
      </div>
      <Button
        className="border-t"
        variant="ghost"
        size="lg"
        onClick={updateGraph}
      >
        Update graph<Kbd>⌘ + R</Kbd>
      </Button>
      <Button
        className="border-t"
        variant="ghost"
        size="lg"
        onClick={() => setGraphKey(String(Math.random()))}
      >
        Reset graph
      </Button>
    </div>
  );
}
