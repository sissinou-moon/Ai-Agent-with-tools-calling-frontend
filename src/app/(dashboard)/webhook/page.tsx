import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  PlusIcon,
  CopyIcon,
  MoreHorizontalIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";

const webhooks = [
  {
    id: 1,
    name: "Order Notifications",
    url: "https://api.example.com/webhooks/orders",
    method: "POST",
    active: true,
    lastTriggered: "5 min ago",
    successRate: 99.2,
  },
  {
    id: 2,
    name: "User Signup",
    url: "https://hooks.slack.com/services/T00/B00/xxx",
    method: "POST",
    active: true,
    lastTriggered: "32 min ago",
    successRate: 100,
  },
  {
    id: 3,
    name: "Error Alerts",
    url: "https://api.pagerduty.com/webhooks",
    method: "POST",
    active: false,
    lastTriggered: "2 days ago",
    successRate: 87.5,
  },
  {
    id: 4,
    name: "Analytics Sync",
    url: "https://analytics.internal.io/ingest",
    method: "PUT",
    active: true,
    lastTriggered: "1 hour ago",
    successRate: 98.8,
  },
];

export default function WebhookPage() {
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
          <h1 className="text-sm font-semibold">Webhooks</h1>
        </div>
        <div className="ml-auto px-4">
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <PlusIcon className="size-4" />
            Add Webhook
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="group rounded-xl border border-border/40 bg-card/50 p-4 transition-all hover:border-border/60 hover:bg-card/80"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${
                      webhook.active
                        ? "bg-emerald-500/10"
                        : "bg-muted"
                    }`}
                  >
                    {webhook.active ? (
                      <CheckCircleIcon className="size-4 text-emerald-400" />
                    ) : (
                      <XCircleIcon className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium">{webhook.name}</h3>
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                        {webhook.method}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <code className="text-xs text-muted-foreground truncate max-w-[400px] block">
                        {webhook.url}
                      </code>
                      <button className="shrink-0 rounded-sm p-0.5 text-muted-foreground/40 hover:text-muted-foreground">
                        <CopyIcon className="size-3" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground/60">
                      <span>Last triggered {webhook.lastTriggered}</span>
                      <span>·</span>
                      <span
                        className={
                          webhook.successRate >= 95
                            ? "text-emerald-400/80"
                            : "text-amber-400/80"
                        }
                      >
                        {webhook.successRate}% success
                      </span>
                    </div>
                  </div>
                </div>
                <button className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground group-hover:opacity-100">
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
