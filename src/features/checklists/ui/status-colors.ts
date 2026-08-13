export type StatusTone = "success" | "destructive" | "muted" | "primary";

const STATUS_TONE: Record<string, StatusTone> = {
  OPEN: "success",
  CLOSED: "destructive",
  REJECTED: "muted",
};

const TONE_CLASS: Record<StatusTone, string> = {
  success: "bg-success text-success-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  muted: "bg-muted text-muted-foreground",
  primary: "bg-primary text-primary-foreground",
};

export function getStatusTone(status: string): StatusTone {
  return STATUS_TONE[status] ?? "primary";
}

export function getStatusToneClass(status: string): string {
  return TONE_CLASS[getStatusTone(status)];
}
