import {
  Bell,
  ChartColumnIncreasing,
  ClipboardList,
  Landmark,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  /**
   * Permissões exigidas para o item aparecer. Todas precisam ser satisfeitas.
   * Sem esta chave, o item aparece para qualquer usuário autenticado.
   */
  permissions?: string[];
};

/** Menu principal — visível para todo usuário autenticado. */
export const navMain: NavItem[] = [
  { title: "Dashboard", url: "/", icon: ChartColumnIncreasing },
  { title: "Checklists", url: "/checklists", icon: ClipboardList },
  { title: "Imóveis", url: "/properties", icon: Landmark },
  { title: "Notificações", url: "/checklist-notifications", icon: Bell },
];

/**
 * Grupo "Configurações".
 *
 * Não existe permissão de `models` no catálogo (nem no front, nem na API), daí
 * o `system:admin` — que `can()` já trata como curinga. `users:edit_configs` é
 * a única permissão de usuário realmente atribuível na tela de edição.
 */
export const navSecondary: NavItem[] = [
  // Sem ícone de propósito: este grupo nunca exibiu ícones.
  { title: "Modelos", url: "/models", permissions: ["system:admin"] },
  { title: "Usuários", url: "/users", permissions: ["users:edit_configs"] },
];
