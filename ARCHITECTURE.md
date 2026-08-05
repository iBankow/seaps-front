# Arquitetura

Projeto **somente front-end**. O back-end é um serviço **separado** (outro
repositório) — este projeto apenas consome a API REST externa. Não há código de
servidor aqui.

## Camadas

```
src/
├─ app/                     # Bootstrap da aplicação
│  ├─ app.tsx               #   composição raiz (AppProviders + RouterProvider)
│  ├─ router.ts             #   createRouter + registro de tipos do router
│  └─ providers.tsx         #   todos os providers (Theme, Query, Tooltip, Auth, Toaster)
│
├─ config/                  # Configuração transversal
│  ├─ env.ts                #   ÚNICO ponto que lê import.meta.env
│  └─ navigation.ts         #   estrutura da navegação (áreas + permissões)
│
├─ lib/                     # Infra genérica, sem regra de negócio
│  ├─ http.ts               #   instância axios (withCredentials) + erros
│  ├─ query-client.ts       #   TanStack Query client
│  ├─ format.ts             #   BRL, datas, máscaras (CPF/CNPJ, telefone)
│  └─ utils.ts              #   cn() (tailwind-merge)
│
├─ types/                   # Tipos de domínio compartilhados
│
├─ components/              # UI reutilizável (cross-feature)
│  ├─ ui/                   #   design system (shadcn: button, card, sheet...)
│  ├─ common/               #   DataTable, PageHeader, StatCard, FormSheet...
│  └─ layout/               #   AppShell, Sidebar (rail + painel), Header
│
└─ features/                # Slices verticais por domínio
   ├─ auth/
   │  ├─ api/               #   sessions.ts, mock.ts (dev)
   │  ├─ context/           #   auth-context.tsx (AuthProvider, useAuth, useCan)
   │  ├─ lib/               #   permissions.ts (matcher de curingas)
   │  ├─ components/        #   ProtectedRoute.tsx
   │  ├─ pages/             #   LoginPage.tsx
   │  └─ index.ts           #   barrel (superfície pública do feature)
   ├─ dashboard/
   │  ├─ data.ts            #   dados de exemplo (trocar por chamadas à API)
   │  └─ pages/DashboardPage.tsx
   └─ system/
      └─ pages/NotFoundPage.tsx
```

## Regras de dependência

- `features/*` podem usar `components/*`, `lib/*`, `config/*`, `types/*`.
- `components/*` e `lib/*` **não** importam de `features/*` (fluxo de fora p/ dentro).
- Import **entre features** só pelo **barrel** (`@/features/x`), nunca por caminho
  interno. Dentro do próprio feature, use caminhos diretos (evita ciclos com o barrel).
- **Nada** lê `import.meta.env` direto — só `config/env.ts`.
- Toda chamada HTTP passa pela instância `http` de `lib/http.ts`.
- `@/` é o **único** alias de import (`@/* → ./src/*`).

## Erros de HTTP

`lib/http.ts` tem um interceptor que exibe `toast.error` em **toda** falha,
usando `message` e `action` do corpo de erro da API. O call site só precisa
tratar o erro quando quiser um comportamento diferente do padrão.

Quando o call site já exibe a própria mensagem, passe `skipErrorToast` para não
mostrar dois toasts para a mesma falha:

```ts
await http.post("/persons", payload, { skipErrorToast: true });
```

Use também quando um status de erro for um estado esperado do fluxo — por
exemplo, um `404` que significa "ainda não existe". O `401` de `/auth/me` já é
silenciado por padrão, porque é o caso normal de visitante não autenticado.

O prefixo de versão (`/api/v1`) mora no `baseURL`: os call sites escrevem
apenas `/checklists`, nunca `/api/v1/checklists`.

## Como adicionar um novo módulo (ex.: models)

### Seguindo o exemplo do modulo ja criado `checklists`, siga os passos abaixo:

1. Crie `src/features/models/` com `api/`, `types/`, `ui/`,
   `schema.ts` (Zod) e `types.ts` conforme necessário.
2. A pasta `api/` deve conter o arquivo `api/models.ts` que deve conter apenas chamadas à API (axios) e hooks de TanStack Query, e suas chaves em `api/query-keys.ts`.
3. Exponha o que for público em `src/features/models/index.ts`.
4. Registre a rota em `src/routes/_auth/models`.

As pastas com rotas não devem conter lógica de negócio ou componentes de UI, apenas composição de componentes e chamadas à API (Mais enxuto possível).

## Autenticação

Cookie httpOnly emitido pela API externa. `AuthProvider` hidrata a sessão via
`GET /auth/me`; `useCan()` e `<PermissionGate>` controlam visibilidade por
permissão. Em dev, `VITE_MOCK_AUTH=true` simula um usuário logado sem a API.

> Estado atual: `useCan()`, `<PermissionGate>` e `VITE_MOCK_AUTH` ainda **não
> existem** — hoje as rotas chamam `can()` de `lib/permissions.ts` direto. Ver
> `MIGRATION.md`. A API expõe `/auth/me` e `/sessions/me`; a aplicação usa
> `/auth/me`.
