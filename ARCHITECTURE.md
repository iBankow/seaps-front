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
   │  ├─ api/               #   sessions.ts (me, login, logout, MT Login)
   │  ├─ context/           #   auth-context.tsx (AuthProvider, useAuth, useCan)
   │  ├─ lib/               #   permissions.ts, mt-login.ts, route-guards.ts
   │  ├─ components/        #   permission-gate.tsx
   │  ├─ pages/             #   login-page.tsx
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
  interno. Vale também para quem vem de fora (`routes/*`, `components/*`).
  Dentro do próprio feature, use caminhos **relativos** — importar o próprio
  barrel fecha um ciclo assim que ele reexporta o arquivo que está importando.
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

### O que vai no barrel

O `index.ts` é um **contrato**, não um índice de arquivos. Entram os hooks de
query, o objeto `*Api`, as query keys, os tipos de domínio e os componentes de
UI feitos para uso externo. Ficam de fora as peças internas — passos de wizard,
subcomponentes de formulário, helpers locais.

Reexportar tudo (`export * from ...` em cada arquivo) devolve o problema que o
barrel resolve: se qualquer coisa é pública, nada é interno.

As pastas com rotas não devem conter lógica de negócio ou componentes de UI, apenas composição de componentes e chamadas à API (Mais enxuto possível).

## Autenticação

Cookie httpOnly emitido pela API externa. `AuthProvider` hidrata a sessão via
`GET /auth/me`. A API expõe `/auth/me` e `/sessions/me`; a aplicação usa o
primeiro.

> `VITE_MOCK_AUTH` ainda **não existe** — está no roteiro, não no código.

### Permissões

`can(guards, permissions)` exige **todas** as permissões pedidas. `system:admin`,
`*` e `*:*` liberam tudo; não há expansão por recurso (`properties:*` **não**
cobre `properties:edit`).

Três formas de usar, por camada:

```tsx
// 1. Esconder um trecho de UI — o caminho padrão
<PermissionGate permissions="properties:edit">
  <BotaoEditar />
</PermissionGate>

// 2. Precisar do resultado como valor (desabilitar campo, texto condicional)
const can = useCan();
const podeGerar = can("checklist:generate_notification");

// 3. Barrar a navegação, no beforeLoad da rota
beforeLoad: ({ context }) =>
  requirePermission(context.auth, "users:edit_configs"),
```

As duas primeiras são **visibilidade**, não acesso: quem garante a regra é a
API. A guarda de rota só evita que a pessoa chegue numa tela que não vai
conseguir usar.

Os itens de menu declaram a permissão exigida em `config/navigation.ts`, e a
sidebar filtra com `useCan()` — menu e guarda de rota devem usar a **mesma**
permissão, para não mostrar link que redireciona.
