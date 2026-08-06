import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationsList,
  useUnreadNotificationsCount,
} from "../api/notifications";
import type { Notification } from "../types";
import { formatDateTime } from "@/lib/format";

export function NotificationBell() {
  const [open, setOpen] = useState(false);

  const { data: unreadData } = useUnreadNotificationsCount();
  const { data: listData, isLoading } = useNotificationsList(
    { per_page: 10 },
    { enabled: open },
  );
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();

  const unreadCount = unreadData?.unread_count ?? 0;
  const notifications = listData?.data ?? [];

  const handleSelect = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }

    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notificações"
        >
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium leading-none text-destructive-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Notificações</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="link"
              size="xs"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {isLoading && (
            <p className="px-2 py-4 text-center text-sm text-muted-foreground">
              Carregando...
            </p>
          )}
          {!isLoading && notifications.length === 0 && (
            <p className="px-2 py-4 text-center text-sm text-muted-foreground">
              Nenhuma notificação
            </p>
          )}
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={cn(
                "flex flex-col items-start gap-0.5 whitespace-normal",
                !notification.is_read && "bg-muted/50",
              )}
              onClick={() => handleSelect(notification)}
            >
              <div className="flex w-full items-center gap-2">
                {!notification.is_read && (
                  <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                )}
                <span className="truncate text-sm font-medium">
                  {notification.title}
                </span>
              </div>
              <span className="line-clamp-2 text-xs text-muted-foreground">
                {notification.message}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {formatDateTime(notification.created_at)}
              </span>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
