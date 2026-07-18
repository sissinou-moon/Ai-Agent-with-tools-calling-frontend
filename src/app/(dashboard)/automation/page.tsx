import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  BotIcon,
  PlusIcon,
  PlayIcon,
  PauseIcon,
  MoreHorizontalIcon,
} from "lucide-react";

const workflows = [
  {
    id: 1,
    name: "Lead Qualification",
    description: "Automatically qualify incoming leads based on criteria",
    status: "active" as const,
    runs: 1243,
    lastRun: "2 min ago",
  },
  {
    id: 2,
    name: "Email Follow-up",
    description: "Send follow-up emails after 3 days of no response",
    status: "active" as const,
    runs: 892,
    lastRun: "15 min ago",
  },
  {
    id: 3,
    name: "Data Sync",
    description: "Sync contact data between CRM and marketing tools",
    status: "paused" as const,
    runs: 456,
    lastRun: "1 hour ago",
  },
  {
    id: 4,
    name: "Report Generation",
    description: "Generate weekly performance reports automatically",
    status: "active" as const,
    runs: 52,
    lastRun: "3 days ago",
  },
];

export default function AutomationPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <h1 className="text-sm font-semibold">Automation</h1>
        </div>
        <div className="ml-auto px-4">
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <PlusIcon className="size-4" />
            New Workflow
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="group flex items-center gap-4 rounded-xl border border-border/40 bg-card/50 p-4 transition-all hover:border-border/60 hover:bg-card/80"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <BotIcon className="size-5 text-primary/70" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium truncate">
                    {workflow.name}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      workflow.status === "active"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {workflow.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {workflow.description}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground/60">
                  <span>{workflow.runs} runs</span>
                  <span>·</span>
                  <span>Last run {workflow.lastRun}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                  {workflow.status === "active" ? (
                    <PauseIcon className="size-4" />
                  ) : (
                    <PlayIcon className="size-4" />
                  )}
                </button>
                <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                  <MoreHorizontalIcon className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
