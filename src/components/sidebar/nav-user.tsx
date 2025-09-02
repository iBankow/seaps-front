import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-contexts";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  EllipsisVerticalIcon,
  LogOutIcon,
  UserCircle,
} from "lucide-react";
export function NavUser({
  user,
}: {
  user:
  | {
    name: string;
    email: string;
    // avatar: string;
  }
  | undefined
  | null;
}) {
  const { isMobile } = useSidebar();

  const { logout } = useAuth();

  if (!user) {
    return null;
  }

  const createAvatarFallback = (name?: string) => {
    if (!name) {
     return 'UK'
    }
    const names = name.trim().toUpperCase().split(/\s+/); // Remove espaços extras e divide por espaços
    if (names.length === 1) return names[0][0];

    return `${names[0][0]}${names[names.length - 1][0]}`;
  };

  const avatarFallback = createAvatarFallback(user.name);

  const getColorFromInitials = (initials: string) => {
    let hash = 0;
    for (let i = 0; i < initials.length; i++) {
      hash = initials.charCodeAt(i) + ((hash << 4) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  const getFirstAndLastName = (name?: string) => {
    if (!name) {
     return 'UK'
    }

    const names = name.trim().split(/\s+/);
    if (names.length === 1) return names[0];
    return `${names[0]} ${names[names.length - 1]}`;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={""} alt={user.name} />
                <AvatarFallback
                  className={`rounded-lg`}
                  style={{
                    backgroundColor: getColorFromInitials(avatarFallback),
                  }}
                >
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {getFirstAndLastName(user.name)}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={""} alt={user.name} />
                  <AvatarFallback
                    className="rounded-lg"
                    style={{
                      backgroundColor: getColorFromInitials(avatarFallback),
                    }}
                  >
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium" title={user.name}>
                    {user.name}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/account">
                  <UserCircle />
                  Conta
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Bell />
                Notificações
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
