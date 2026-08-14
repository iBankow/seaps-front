export type StatusTone =
  | "success"
  | "destructive"
  | "muted"
  | "primary"
  | "purple";

const STATUS_TONE: Record<string, StatusTone> = {
  OPEN: "success",
  CLOSED: "destructive",
  REJECTED: "muted",
  APPROVED: "purple",
};

const TONE_CLASS: Record<StatusTone, string> = {
  success: "bg-success text-success-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  muted: "bg-muted text-muted-foreground",
  primary: "bg-primary text-primary-foreground",
  purple: "bg-purple-500 text-white",
};

export function getStatusTone(status: string): StatusTone {
  return STATUS_TONE[status] ?? "primary";
}

/** Solid tone class — used for the checklist header's top accent rule. */
export function getStatusToneClass(status: string): string {
  return TONE_CLASS[getStatusTone(status)];
}
