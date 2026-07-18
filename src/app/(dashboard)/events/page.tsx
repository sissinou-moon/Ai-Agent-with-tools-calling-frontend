import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  FilterIcon,
} from "lucide-react";

const events = [
  {
    id: 1,
    type: "success" as const,
    title: "Workflow completed",
    description: 'Lead Qualification finished processing 24 leads',
    time: "2 min ago",
  },
  {
    id: 2,
    type: "error" as const,
    title: "Webhook delivery failed",
    description: "POST to https://api.example.com/hook returned 503",
    time: "18 min ago",
  },
  {
    id: 3,
    type: "info" as const,
    title: "New automation created",
    description: 'User created "Email Follow-up" workflow',
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "success" as const,
    title: "Data sync completed",
    description: "Synced 1,200 contacts to CRM",
    time: "2 hours ago",
  },
  {
    id: 5,
    type: "info" as const,
    title: "System update",
    description: "Platform updated to v2.4.1 with performance improvements",
    time: "5 hours ago",
  },
  {
    id: 6,
    type: "error" as const,
    title: "Rate limit exceeded",
    description: "API calls throttled for 60 seconds",
    time: "6 hours ago",
  },
];

const iconMap = {
  success: CheckCircleIcon,
  error: AlertCircleIcon,
  info: InfoIcon,
};

const colorMap = {
  success: "text-emerald-400 bg-emerald-500/10",
  error: "text-red-400 bg-red-500/10",
  info: "text-blue-400 bg-blue-500/10",
};

export default function EventsPage() {
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
          <h1 className="text-sm font-semibold">Events</h1>
        </div>
        <div className="ml-auto px-4">
          <button className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <FilterIcon className="size-3.5" />
            Filter
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl">
          {/* Timeline */}
          <div className="relative space-y-0">
            {events.map((event, index) => {
              const Icon = iconMap[event.type];
              const color = colorMap[event.type];
              return (
                <div key={event.id} className="relative flex gap-4 pb-6">
                  {/* Timeline line */}
                  {index < events.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-0 w-px bg-border/40" />
                  )}
                  {/* Icon */}
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full ${color}`}
                  >
                    <Icon className="size-4" />
                  </div>
                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-sm font-medium">{event.title}</h3>
                      <span className="shrink-0 text-[11px] text-muted-foreground/60">
                        {event.time}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
