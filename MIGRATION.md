# Auditoria de Arquitetura — Conformidade com `ARCHITECTURE.md`

Este documento audita, módulo por módulo, o quanto o código atual segue o
padrão descrito em [ARCHITECTURE.md](./ARCHITECTURE.md), e lista o que falta
fazer em cada ponto. Não é uma crítica ao trabalho já feito — é o retrato de
um projeto **em migração**: existe um conjunto "novo" (`features/*` mais
recentes + `lib/axios.ts`) que já segue boa parte do padrão, e um conjunto
"legado" (`contexts/`, `lib/api.ts`, a maior parte de `routes/*/-components`)
que ainda não foi movido para dentro dele.

Legenda: ✅ conforme · ⚠️ parcial · ❌ não conforme / inexistente

> **Status:** as etapas 1 (Fundação), 2 (`features/auth`), 3 (barrels), 4
> (módulos incompletos), 5 (`features/users` e `features/account`), 6
> (duplicação em `checklists`/`properties`/`persons`), 7 (`features/dashboard`
> e `features/system`) e 8 (`components/` em `ui/`/`common`/`layout`) do
> plano da seção 4 foram concluídas — as seções 1 e 2 abaixo descrevem o
> estado *anterior* e estão mantidas como registro.
>
> - **Etapa 1:** `config/env.ts`, `lib/http.ts` (client único),
>   `lib/query-client.ts`, `lib/format.ts`, `src/types/`,
>   `app/{app,router,providers}`, alias `@/` único.
> - **Etapa 2:** `features/auth` (primeiro feature com barrel), `useCan()`,
>   `<PermissionGate>`, `requirePermission()` e `config/navigation.ts`.
> - **Etapa 3:** `index.ts` nas 9 features restantes e os 23 imports de caminho
>   interno migrados para o barrel.
> - **Etapa 4:** `models` ganhou `types/`, `api/query-keys.ts` e `ui/`
>   (`model-form.tsx`, `columns.tsx`), com o formulário e a listagem migrados
>   de `routes/-components` para hooks de TanStack Query; `organizations`
>   ganhou `types/` e `api/query-keys.ts`; `checklist-items` ganhou `ui/`
>   (`delete-dialog.tsx`) e unificou o `ChecklistItem` duplicado (o de
>   `types/types.d.ts` na raiz e o do feature) num único tipo no feature;
>   `checklist-notifications` ganhou `ui/` (`columns.tsx`, `filter-form.tsx`)
>   e `types/` própria (antes em `api/types.ts`); `address` renomeou
>   `type/` → `types/`; `notifications` moveu `api/types.ts` para `types/`.
> - **Etapa 5:** `features/users` criado com `api/` (`users.ts`,
>   `user-requests.ts`, `query-keys.ts`), `types/` e `ui/` — as 9 peças que
>   viviam em `routes/_auth/users/-components` (columns, actions, filter-form,
>   users-tab, requests-columns, requests-filter-form, requests-tab,
>   request-action-modal, request-details-modal) migraram para lá, e as duas
>   páginas de detalhe/edição (`$userId/index.tsx`, `$userId/edit/index.tsx`,
>   que não estavam em `-components`) viraram `ui/user-detail.tsx` e
>   `ui/user-edit-form.tsx`, com as rotas reduzidas a só registrar o
>   componente. Todo fetch cru (`useEffect`+axios) foi trocado por hooks de
>   TanStack Query. `features/account` criado com `api/account.ts`
>   (`useGeneratePassword`) e `ui/profile-form.tsx`.
> - **Etapa 6:** seguiu a correção registrada no achado "A etapa 6 acima está
>   com a direção invertida" (abaixo), não o texto original do plano — as
>   versões vivas de `routes/_auth/{checklists,properties}/-components`
>   foram movidas **para dentro** de `features/{checklists,properties}/ui`
>   (sobrescrevendo os stubs degradados de `ui/list-components/*`), e só
>   então as pastas `-components` das rotas foram apagadas. `checklists`
>   ganhou `ui/{actions,columns,filter-form,export-modal,header}.tsx` e
>   `ui/dialogs/*` (reopen/delete/finish/validate); `create-form.tsx` foi
>   descartado por não ter nenhum importador (a rota `/checklists/create` já
>   usava `CreateOrderWizard`). `properties` ganhou
>   `ui/{actions,columns,filter-form,export-modal,edit-form}.tsx`; o
>   `PropertyForm` de edição trouxe consigo seu próprio `name-form`/
>   `address-form` para `ui/edit-components/`, **sem** sobrescrever
>   `ui/create-components/{name-form,address-form}.tsx` — essas são as
>   versões mais novas (usadas pelo wizard de criação, com `addressApi` e
>   `Field`) e a duplicação create-vs-edit já existia antes desta etapa, fora
>   do escopo dela. `persons` não tinha stub degradado: `CreatePersonForm`
>   (usado por `/persons/create`) e `CreatePersonDialog` (usado dentro do
>   wizard de propriedade) são dois componentes distintos e legítimos, não
>   duplicatas — só o primeiro foi movido para `features/persons/ui`,
>   trocando fetch cru por `useCreatePerson()`/`useOrganizationsList()`. Os
>   forks mortos `ui/{checklists-list,create-checklists}.tsx` (checklists) e
>   `ui/properties-list.tsx` (properties) foram apagados. Os barrels ganharam
>   os exports correspondentes (`checklistColumns`, `ChecklistFilterForm`,
>   `ChecklistActions`, `ChecklistHeader`, `PropertyForm`, etc.) — inclusive
>   `ChecklistActions`, necessário porque `routes/_auth/-components/
>   checklist-card.tsx` (dashboard, fora do escopo desta etapa) também
>   importava a versão antiga de `Actions`.
> - **Etapa 7:** `features/dashboard` criado com `api/dashboard.ts`
>   (`useDashboard()`, `GET /dashboards`), `types/` e `ui/` — `bar-card.tsx`,
>   `numbers-card.tsx` (antes `cards/numbers.tsx`) e `irm-chart.tsx` migraram
>   de `routes/_auth/-components` sem mudança de comportamento (só recebem
>   props). `checklist-card.tsx` também migrou, mas trocou o fetch cru
>   (`useEffect`+axios em `/checklists?...&status=CLOSED`) por
>   `useChecklistsList({ page: 1, per_page: 5, status: "CLOSED" })`, hook que
>   já existia em `features/checklists` — sem duplicar lógica de busca.
>   `pages/DashboardPage.tsx` compõe as quatro peças e substitui o corpo da
>   rota; `routes/_auth/index.tsx` ficou só com `component: DashboardPage`.
>   `features/system` criado com `pages/NotFoundPage.tsx`, registrado como
>   `notFoundComponent` em `routes/__root.tsx` (não em `createRouter()` — a
>   opção não existe no construtor desta versão do TanStack Router, só na
>   rota raiz). Os nomes de arquivo `DashboardPage.tsx`/`NotFoundPage.tsx`
>   (PascalCase) seguem literalmente o que `ARCHITECTURE.md` e o texto desta
>   etapa já especificavam, mesmo destoando do kebab-case usado no resto do
>   projeto — é o mesmo padrão que `features/auth/pages/login-page.tsx` já
>   estabeleceu para a pasta `pages/` (ainda que esse em kebab-case).
>   Verificado num browser real (Playwright): a página 404 renderiza e o link
>   "Voltar para o início" navega corretamente; o dashboard não foi
>   verificado logado porque não há backend real disponível neste ambiente.
> - **Etapa 8:** `components/layout/` recebeu `back-button.tsx`,
>   `breadcrumbs.tsx`, `mode-toggle.tsx`, `site-header.tsx`, `sidebar/*` e,
>   por extensão do critério do doc, `theme-provider.tsx` (só é usado por
>   `mode-toggle.tsx` e por `app/providers.tsx`, não é um componente
>   genérico nem de domínio). `components/common/` recebeu `data-table.tsx`,
>   `pagination.tsx`, `meta-pagination.tsx`, `loading.tsx`,
>   `skeletons/data-table.tsx`, e por extensão `react-select.tsx` e
>   `carousel/*` — nenhum dos dois estava listado no doc, mas ambos são
>   genéricos (wrapper de input, carrossel de imagens) sem lógica de domínio.
>   Dos componentes de domínio, `checklist-card.tsx`, `observation-dialog.tsx`,
>   `image-dialog.tsx`, `virtualized-checklist-grid.tsx` e `global-dialogs.tsx`
>   foram para `features/checklist-items/ui` — não `features/checklists/ui`
>   como o doc supunha; todos operam em `/checklist-items/{id}` e só têm um
>   importador, `routes/.../checklists/$checklistId/items/*`, que já é a área
>   de preenchimento de item, domínio de `checklist-items`. `status-badge.tsx`
>   e `classification-badge.tsx` foram para `features/checklists/ui` (campos
>   `status`/`classification` são do checklist) e voltaram a ser consumidos
>   por `features/dashboard` e pela rota de detalhe via barrel. Dois achados
>   de dead code apagados no caminho: `components/ui/data-table.tsx`
>   (`DataTableDemo`, boilerplate do shadcn, zero importadores — item já
>   citado em "Pendências menores") e `components/property-badge.tsx`
>   (`PropertyBadge`, zero importadores; `features/properties/ui/columns.tsx`
>   já tem seu próprio `PROPERTY_TYPE_ENUM` duplicado inline — duplicação
>   pré-existente, fora do escopo desta etapa). Verificado num browser real
>   (Playwright): login e 404 renderizam sem erro de console além dos 401
>   esperados (sem backend real neste ambiente).
>
> Ver "Achados" no fim do documento.

---

## 1. Camadas transversais

### `app/` — ❌ não existe

O doc prevê `app/App.tsx` (composição de rotas) e `app/providers.tsx` (todos
os providers). Hoje tudo isso está inline em [src/main.tsx](src/main.tsx):
`QueryClient`, `ThemeProvider`, `TooltipProvider`, `AuthProvider` e o
`RouterProvider` são montados diretamente ali, sem nenhum arquivo em `app/`.

**Ação:**
- Criar `src/app/providers.tsx` exportando um `AppProviders` que encapsula
  Theme + Query + Tooltip + Auth.
- `main.tsx` passa a apenas renderizar `<AppProviders><RouterProvider .../></AppProviders>`.
- Como o roteamento já é por arquivo (TanStack Router), `app/App.tsx` pode
  não fazer sentido tal como descrito — vale decidir se o doc é ajustado ou
  se criamos um `app/router.ts` só para a criação/registro do `router`.

### `config/` — ❌ não existe

Nem `env.ts` nem `navigation.ts` existem.

- **Leitura direta de `import.meta.env`** acontece em 6 arquivos, violando a
  regra "nada lê `import.meta.env` direto": [lib/axios.ts](src/lib/axios.ts),
  [lib/api.ts](src/lib/api.ts), [lib/mt-login.ts](src/lib/mt-login.ts),
  [components/checklist-card.tsx](src/components/checklist-card.tsx),
  [components/carousel/embla-carousel.tsx](src/components/carousel/embla-carousel.tsx),
  [components/carousel/carousel-button.tsx](src/components/carousel/carousel-button.tsx)
  e [routes/_auth/checklists/$checklistId/items/$itemId/index.tsx](src/routes/_auth/checklists/$checklistId/items/$itemId/index.tsx).
- **Navegação hardcoded**: os arrays `navMain`/`navSecondary` estão fixos em
  [components/sidebar/app-sidebar.tsx](src/components/sidebar/app-sidebar.tsx),
  sem nenhuma associação de permissão por item — o menu "Usuários" e
  "Modelos" aparece para qualquer usuário autenticado, independente de
  `permissions`.

**Ação:**
- Criar `config/env.ts` como único ponto de leitura de `import.meta.env` e
  migrar os 6 pontos acima.
- Criar `config/navigation.ts` com áreas + permissão exigida por item, e
  fazer `app-sidebar.tsx` filtrar os itens usando o `useCan()` (ver seção
  `features/auth` abaixo).

### `lib/` — ⚠️ dois clientes HTTP concorrentes

Existem **dois** clients axios fazendo o mesmo papel:

| Instância | Usado por |
|---|---|
| [lib/api.ts](src/lib/api.ts) | ~35 arquivos — todo o legado: `routes/*`, `contexts/*`, `components/*` |
| [lib/axios.ts](src/lib/axios.ts) | todos os `features/*` (o "novo" padrão) |

Os dois duplicam config de `baseURL`/interceptor de erro e **os dois têm o
mesmo bug de precedência de operador**:

```ts
baseURL: import.meta.env.VITE_API_URL + "/api/v1" || "http://localhost:3000",
```

`+` tem precedência sobre `||`, então a expressão é
`(VITE_API_URL + "/api/v1") || fallback` — se `VITE_API_URL` for `undefined`,
o resultado é a string `"undefined/api/v1"` (truthy), e o fallback nunca
dispara. Vale corrigir como parte da unificação.

`lib/axios.ts` também acumulou responsabilidades que não são "http": tipos
`User`, `PaginationMeta`, `PaginatedResponse`, o objeto `authAPI` e helpers
de erro (`isApiError`, `getApiErrorMessage`, `getApiErrorAction`). Pelo doc,
isso pertence a `types/` e a `features/auth/api`.

Falta também:
- `query-client.ts` — a config do `QueryClient` (`refetchOnWindowFocus`,
  `refetchInterval`) está solta em `main.tsx`.
- `format.ts` — não existe. Formatação de data está duplicada em pelo menos
  10 lugares (`toLocaleDateString`/`date-fns` chamado direto em cada
  `columns.tsx` de `checklists`, `properties`, `models`, `users`,
  `checklist-notifications`, nos dois `export-modal.tsx`, etc.) em vez de
  centralizada.

**Ação:**
1. Escolher `lib/axios.ts` como base, renomear para `lib/http.ts` (ou manter
   o nome e só ajustar o doc — a decisão é do time), corrigir o bug do
   `baseURL`.
2. Migrar os ~35 usos de `lib/api.ts` para o client único e apagar `lib/api.ts`.
3. Mover `authAPI`/`User` para `features/auth/api`, `PaginationMeta`/
   `PaginatedResponse`/`ApiErrorBody` para `src/types/`.
4. Extrair a config do `QueryClient` para `lib/query-client.ts`.
5. Criar `lib/format.ts` (datas, BRL, CPF/CNPJ, telefone) e migrar as
   duplicações listadas acima.

### `types/` — ❌ não existe como pasta compartilhada

Tipos de domínio hoje vivem dentro de cada feature (`features/x/types/`),
o que é o esperado para tipos exclusivos da feature. Mas tipos realmente
transversais (paginação, formato de erro de API) estão presos dentro de
`lib/axios.ts` — deveriam estar em `src/types/`.

Também há uma inconsistência de nome:
[features/address/type/](src/features/address/type) (singular) vs. todos os
outros `features/*/types/` (plural: `properties`, `persons`,
`checklist-items`).

**Ação:** criar `src/types/` para os tipos compartilhados citados acima e
renomear `address/type` → `address/types`.

### `components/` — ⚠️ só existe `ui/`

Não há `common/` nem `layout/`. Na raiz de `components/` estão misturados:

- Layout: `sidebar/*`, `site-header.tsx`, `mode-toggle.tsx`,
  `breadcrumbs.tsx`, `back-button.tsx`
- Genéricos reutilizáveis: `data-table.tsx`, `pagination.tsx`,
  `meta-pagination.tsx`, `loading.tsx`, `skeletons/*`
- **Componentes de domínio que deveriam morar em uma feature**:
  `checklist-card.tsx`, `login-form.tsx`, `observation-dialog.tsx`,
  `property-badge.tsx`, `classification-badge.tsx`, `status-badge.tsx`,
  `virtualized-checklist-grid.tsx`, `image-dialog.tsx`

**Ação:**
- Criar `components/layout/` e mover os itens de layout listados acima.
- Criar `components/common/` e mover os itens genéricos listados acima.
- Mover os componentes de domínio para a feature correspondente:
  `login-form.tsx` → `features/auth`, `checklist-card.tsx`/
  `observation-dialog.tsx` → `features/checklists/ui`, `property-badge.tsx`
  → `features/properties/ui`, etc.

---

## 2. Features

| Feature | api/ | types/ | ui/ | index.ts (barrel) | Observação |
|---|:---:|:---:|:---:|:---:|---|
| **auth** | — | — | — | ❌ | Não existe como feature. Espalhado em `contexts/auth-contexts.tsx`, `lib/permissions.ts`, `lib/mt-login.ts`, `components/login-form.tsx`, `routes/login.tsx`. Sem `useCan()`/`<PermissionGate>` — cada rota chama `can(...)` direto importando de `lib/permissions`. |
| **dashboard** | ✅ | ✅ | ✅ | ✅ | Etapa 7: `api/dashboard.ts` (`useDashboard()`) substitui o fetch cru de `routes/_auth/index.tsx`; `bar-card`, `numbers-card`, `irm-chart` e `checklist-card` migraram de `routes/_auth/-components` para `ui/`; `checklist-card` passou a usar `useChecklistsList()` de `features/checklists` em vez de axios direto. `pages/DashboardPage.tsx` compõe tudo; a rota só registra o componente. |
| **system** | — | — | ✅ | ✅ | Etapa 7: `pages/NotFoundPage.tsx` criado e registrado como `notFoundComponent` em `routes/__root.tsx`. Sem `api/`/`types/` — não há dados nem chamada de API envolvidos. |
| **users** | ✅ | ✅ | ✅ | ✅ | Etapa 5: listagem, CRUD, aba de solicitações e aprovação/reprovação migraram de `routes/_auth/users/-components/*` para `api/{users,user-requests,query-keys}.ts` + `ui/*`. As páginas de detalhe (`$userId`) e edição (`$userId/edit`) — que não estavam em `-components`, eram o corpo inteiro da rota — viraram `ui/user-detail.tsx` e `ui/user-edit-form.tsx`. |
| **account** | ✅ | — | ✅ | ✅ | Etapa 5: `api/account.ts` (`useGeneratePassword`) e `ui/profile-form.tsx`, migrados de `routes/_auth/account/-components/form.tsx`. Sem `types/` própria — a única chamada tem um payload de resposta trivial (`{ password }`), tipado inline em `api/account.ts`. |
| **checklists** | ✅ | ✅ | ✅ | ✅ | Etapa 6: `routes/_auth/checklists/-components/*` (columns, actions, dialogs/, filter-form, export-modal, header) movido para `features/checklists/ui`, sobrescrevendo os stubs degradados; `create-form.tsx` (sem importador) descartado. |
| **properties** | ✅ | ✅ | ✅ | ✅ | Etapa 6: `routes/_auth/properties/-components/*` movido para `features/properties/ui` (columns, actions, filter-form, export-modal, `edit-form.tsx`); `name-form`/`address-form` do form de edição foram para `ui/edit-components/`, sem tocar nos de `ui/create-components/` (versões mais novas, usadas pelo wizard). |
| **persons** | ✅ | ✅ | ✅ | ✅ | Etapa 6: `CreatePersonForm` (usado por `/persons/create`) migrou para `features/persons/ui`, trocando fetch cru por `useCreatePerson()`/`useOrganizationsList()`. Não duplicava `CreatePersonDialog` — são dois componentes distintos (página vs. dialog embutido no wizard de propriedade), os dois seguem existindo. |
| **checklist-items** | ✅ | ✅ | ✅ | ✅ | Etapa 4: `ui/delete-dialog.tsx` migrado de `routes/-components`, e o `ChecklistItem` duplicado (raiz `types/types.d.ts` vs. feature) foi unificado num único tipo no feature. A listagem (`items/index.tsx`) e o detalhe (`items/$itemId/index.tsx`) passaram a consumir os hooks do feature em vez de `useEffect`+axios cru. |
| **checklist-notifications** | ✅ | ✅ | ✅ | ✅ | Etapa 4: `ui/columns.tsx` e `ui/filter-form.tsx` migrados de `routes/-components`; `api/types.ts` virou `types/index.ts`. |
| **notifications** | ✅ | ✅ | ✅ | ✅ | Etapa 4: `api/types.ts` movido para `types/index.ts`. |
| **models** | ✅ | ✅ | ✅ | ✅ | Etapa 4: ganhou `api/query-keys.ts`, `types/` e `ui/` (`model-form.tsx`, `columns.tsx`); o formulário (antes 418 linhas cruas em `routes/-components`) e a listagem agora usam hooks de TanStack Query (`useModelsList`, `useModel`, `useCreateModel`, `useUpdateModel`, `useModelItemsCatalog`). |
| **organizations** | ✅ | ✅ | — | ✅ | Etapa 4: ganhou `types/` e `api/query-keys.ts`; a chave de query deixou de estar hardcoded inline. Sem `ui/` própria — não há UI de domínio a migrar, só o hook. |
| **address** | ✅ | ✅ | ❌ | ✅ | Etapa 4: pasta renomeada `type/` → `types/`. Segue sem UI própria — o formulário de endereço continua reimplementado dentro de `properties` e de `routes` (fora do escopo da etapa 4). |

### Import entre features não passa por barrel

Nenhuma feature tem `index.ts`, então **todo** import entre features hoje
acessa caminho interno diretamente — o que o doc proíbe explicitamente
("Import entre features só pelo barrel, nunca por caminho interno").
Exemplos:

```
features/properties/ui/create-components/select-person-form.tsx
  → "#/features/persons/api/persons"
  → "#/features/persons/ui/create-person-dialog"
features/properties/ui/create-components/details-form.tsx
  → "#/features/organizations/api/organizations"
features/checklists/types/types.ts
  → "#/features/properties/types"
features/checklists/ui/create-components/details-form.tsx
  → "#/features/models/api/models"
```

**Ação:** criar `index.ts` em cada feature expondo sua superfície pública, e
trocar todos os imports acima para `@/features/<nome>`.

### Alias `@/` vs `#/`

`tsconfig.json`/`vite.config.ts` registram dois aliases para o mesmo lugar
(`@/*` e `#/*` → `./src/*`). O doc só menciona `@/`. Hoje 141 arquivos usam
`@/` e 26 usam `#/` — e são justamente os imports entre features (acima) e
alguns dentro de `features/*` que usam `#/`, uma mistura sem critério claro.

**Ação:** padronizar em `@/` e remover o alias `#/` de `tsconfig.json` e
`vite.config.ts` depois de migrar os 26 arquivos.

---

## 3. Regra "rotas sem lógica de negócio" — violada na maior parte do repo

> Descreve o estado *anterior* às etapas 4-7 (ver "Status" no topo do
> documento) — mantida como registro. Os quatro exemplos abaixo já foram
> resolvidos: `models` na etapa 4, `users` na etapa 5, `checklists`/
> `properties` na etapa 6, `routes/_auth/index.tsx` na etapa 7.

O doc é explícito: *"As pastas com rotas não devem conter lógica de negócio
ou componentes de UI, apenas composição de componentes e chamadas à API."*
Na prática, quase todo `routes/_auth/**/-components/` violava isso:

- `routes/_auth/models/-components/form.tsx` — 418 linhas de formulário completo.
- `routes/_auth/users/-components/*` — 8 arquivos com todo o CRUD de usuários e o fluxo de aprovação/reprovação de solicitações.
- `routes/_auth/checklists/-components/*` e `routes/_auth/properties/-components/*` — duplicam componentes que já existem no feature correspondente.
- `routes/_auth/index.tsx` — busca dados com `useEffect`/`useState` direto na rota, sem passar por um hook de feature.

Isso significa que, para a maioria dos módulos, **a duplicação não é o
problema principal — é sintoma**: a UI real nunca foi movida da rota para o
feature, ou foi copiada para o feature sem que a rota fosse atualizada para
consumi-la.

---

## 4. Plano de ação sugerido (ordem de prioridade)

1. ~~**Fundação (`lib/`, `config/`)** — unificar os dois clients HTTP, corrigir
   o bug do `baseURL`, criar `config/env.ts`, escolher um único alias (`@/`)
   e remover `#/`.~~ ✅ **concluído**
2. ~~**`features/auth`** — migrar `contexts/auth-contexts.tsx`,
   `lib/permissions.ts`, `lib/mt-login.ts`, `components/login-form.tsx` e
   `routes/login.tsx` para dentro do feature; implementar `useCan()` e
   `<PermissionGate>` de verdade; criar `config/navigation.ts` com permissão
   por item e usá-lo em `app-sidebar.tsx`.~~ ✅ **concluído**
3. ~~**Barrels** — adicionar `index.ts` em todas as features existentes e
   corrigir os imports cross-feature listados acima para passar por ele.~~
   ✅ **concluído**
4. ~~**Fechar os módulos incompletos**: `models` (criar `query-keys.ts`,
   `types/`, `ui/`, mover form+columns de `routes/`), `organizations`
   (`query-keys.ts`, `types/`), `checklist-items` (`ui/`),
   `checklist-notifications` (`ui/`, `types/` própria), `address` (renomear
   `type/`→`types/`), `notifications` (mover `types.ts` para `types/`).~~
   ✅ **concluído**
5. ~~**`features/users` e `features/account`** — criar a partir do conteúdo
   hoje só em `routes/_auth/users` e `routes/_auth/account`.~~
   ✅ **concluído**
6. ~~**Eliminar duplicação em `checklists`/`properties`/`persons`** — mover as
   versões vivas de `routes/_auth/{checklists,properties}/-components` para
   dentro de `features/*/ui` (sobrescrevendo os stubs degradados) e só então
   apagar as pastas `-components` das rotas, fazendo-as consumir
   `features/*/ui` via barrel.~~ ✅ **concluído**
7. ~~**`features/dashboard` e `features/system`** — mover
   `routes/_auth/index.tsx` + `routes/_auth/-components/*` para
   `features/dashboard`, trocar o fetch cru por hooks de TanStack Query;
   criar `features/system/pages/NotFoundPage.tsx` e registrar como
   `notFoundComponent` no router.~~ ✅ **concluído**
8. ~~**`components/`** — separar em `ui/`, `common/` e `layout/`, e mover os
   componentes de domínio para dentro da feature correspondente.~~
   ✅ **concluído**

---

## 5. Achados

### Etapa 5: o que ficou de fora

- **`requests-columns.tsx`** tinha um tipo `RequestColumn` duplicado do
  formato de `UserRequest`. Em vez de manter os dois, `RequestColumn` virou
  um alias (`export type RequestColumn = UserRequest`) — mantém o nome que
  `request-details-modal.tsx` e `requests-tab.tsx` já usavam, sem duas fontes
  de verdade para o mesmo formato.
- **`requests-filter-form.tsx`** buscava organizações com `useQuery` cru
  (`queryKey: ["organizations"]`, `queryFn: organizationsApi.list`). Trocado
  por `useOrganizationsList()` do feature `organizations` — mesma origem de
  dados, sem key hardcoded duplicada.
- **`actions.tsx`** (exclusão de usuário na listagem) fazia
  `window.location.reload()` após excluir. Trocado por invalidação de query
  (`useDeleteUser` já invalida `usersKeys.all` no `onSuccess`), que é o
  padrão do resto do projeto — evita o reload completo da página.
- **`LoadingSkeleton`** exportado por `filter-form.tsx` não tinha nenhum
  importador em lugar nenhum do projeto (código morto antes da migração). Não
  foi trazido para `features/users/ui/filter-form.tsx`.
- **`$userId/index.tsx`** e **`$userId/edit/index.tsx`** não estavam em
  `-components` — eram o corpo inteiro da rota. Ainda assim foram extraídos
  para `ui/user-detail.tsx` e `ui/user-edit-form.tsx`, seguindo o mesmo
  critério já usado em `models` na etapa 4: a rota deve só registrar o
  componente, não conter a página. As duas rotas ficaram só com
  `component: UserDetail` / `component: UserEditForm` e o `loader` do crumb.
- **`account`** não ganhou `types/` — a única chamada da feature
  (`generate-password`) devolve um payload trivial (`{ password: string }`),
  tipado inline em `api/account.ts`. Criar uma pasta só para isso seria
  estrutura vazia, mesmo raciocínio aplicado a `organizations` na etapa 4.
- **Catálogo de permissões**: `user-edit-form.tsx` e `request-action-modal.tsx`
  continuam com a lista de permissões (`checklists:create`, `properties:edit`
  etc.) hardcoded no componente, no mesmo formato que já diverge do backend
  (achado 🔴 abaixo). Não foi corrigido — é o mesmo problema de contrato de
  API já registrado, fora do escopo de uma migração de estrutura de pastas.

### Etapa 4: o que ficou de fora

- **`models`** ganhou hooks de mutação (`useCreateModel`, `useUpdateModel`)
  além do `list`. O catálogo de itens (`GET /items`, usado pelo `RSCreatable`
  do formulário) foi mantido dentro de `features/models` como
  `useModelItemsCatalog` — é a única feature que consome essa rota hoje, e
  criar uma feature `items` só para isso seria prematuro.
- **`checklist-items`**: a duplicidade de tipo `ChecklistItem` apontada nos
  achados da etapa 3 foi resolvida — o tipo do feature passou a incluir
  `images` (usado no detalhe do item) e a rota
  `checklists/$checklistId/items/$itemId/index.tsx` importa do feature em vez
  de `types/types.d.ts` (raiz). O campo `item.level` do tipo antigo não tinha
  nenhum uso no código e foi descartado. O `types/types.d.ts` da raiz
  continua existindo — outros tipos dali (`Checklist`, `Property`) não fazem
  parte do escopo desta etapa.
- **`organizations`** não ganhou `ui/` — a feature não tem nenhuma UI de
  domínio própria (só é consumida via `organizationsApi`/`useOrganizationsList`
  por formulários de outras features), então criar a pasta seria só estrutura
  vazia.
- **`address`** segue sem `ui/` — o formulário de endereço permanece
  duplicado em `properties` e em `routes/_auth/properties/-components`. Isso é
  a duplicação tratada na etapa 6, não um item da etapa 4. A inconsistência de
  endpoint (`getCities()` usa `/address/cities/{uf}`, o formulário legado usa
  `/address/states/{uf}`) também segue sem mexer — listado nas "Pendências
  menores".
- **Rotas ainda não estão "sem lógica de negócio"** — mover
  `models`/`checklist-items`/`checklist-notifications` para consumir hooks
  eliminou fetch cru duplicado nessas rotas, mas isso é efeito colateral da
  etapa 4, não o objetivo dela. A regra da seção 3 ("rotas sem lógica de
  negócio") continua valendo como trabalho das etapas 6 e 7, especialmente
  para `checklists`/`properties`/`persons`, que não foram tocadas aqui.

### 🔴 O catálogo de permissões diverge entre front e back

Levantado na etapa 2, **não corrigido** — é contrato de API, não refatoração de
front. O front pede permissões que a API não cita, no plural e com outro verbo:

| Front usa | Backend cita |
|---|---|
| `checklists:create`, `checklists:edit`, `checklists:delete`, `checklists:view_all` | `checklist:create`, `checklist:update`, `checklist:delete`, `checklist:view_all` |
| `properties:edit` | `properties:update` |
| `users:edit`, `users:edit_configs` | `users:update` |

Ou os guards do front nunca batem (e só `system:admin` faz alguma coisa
aparecer), ou a API devolve as duas grafias. **Precisa ser conferido contra um
usuário real antes de confiar em qualquer gate de permissão.**

Dois agravantes:
- `users:edit` é checado em 2 lugares, mas a tela de edição de usuário só sabe
  atribuir `users:edit_configs` — ou seja, `users:edit` só existe para
  `system:admin`.
- **Não existe nenhuma permissão de `models`.** Por isso a área de Modelos ficou
  gateada por `system:admin`, à falta de coisa melhor. Se algum perfil legítimo
  usa /models hoje sem ser admin, a guarda de rota o tranca para fora.

### Etapa 3: o que ficou de fora

- **Os forks degradados não entraram em nenhum barrel.** `checklists/ui/checklists-list.tsx`,
  `properties/ui/properties-list.tsx` e os dois `ui/list-components/*` continuam
  sem importador e agora também sem superfície pública — dar `export` a eles
  seria apontar para o código errado. Some junto na etapa 6.
- **`features/checklist-items/types/index.ts`** virou módulo de verdade
  (ganhou `export`), o que era pré-requisito para o barrel. Descoberta no
  caminho: o `ChecklistItem` de `types/types.d.ts` (raiz) **não** colidia com
  ele, porque aquele arquivo tem `import "knex"` no topo e portanto também é
  módulo. São dois tipos homônimos e de formatos diferentes — o da raiz tem
  `images[]` e `item.level`, o do feature tem `item_id`, `is_inspected` e
  `created_at`. Quem consome os dois é `routes/.../items/$itemId/index.tsx` e
  `api/checklist-items.ts`, respectivamente. Vale unificar na etapa 4.
- **`address/type/` continua no singular** — renomear para `types/` é etapa 4.
  O barrel já reexporta `State` e `City`, então o rename não vaza para fora.
- **`models` e `organizations` têm barrel quase vazio**, porque o feature em si
  está quase vazio (`models` não tem hook, query key nem tipo). O barrel cresce
  na etapa 4.
- **Nada garante a regra automaticamente.** Não há lint proibindo
  `@/features/x/api/y`; hoje isso é convenção verificada por `grep`. Uma regra
  `no-restricted-imports` no ESLint resolveria — vale considerar.

### Etapa 2: o que ficou de fora

- **`VITE_MOCK_AUTH`** continua não existindo (decisão: fora do escopo da etapa).
- **`components/login-form.tsx`** foi apagado — formulário de e-mail/senha sem
  nenhum importador desde que o login virou só o botão do MT Login. O
  `AuthContext` ainda expõe `login(email, password)`, agora sem chamador.
- **`mt-login.ts`** ainda expõe `grant_type`, `redirect_uri`, `url_token` e
  `url_userInfo`, que o front não usa (a troca do code é feita no backend).
- **`routes/request.tsx`** segue sem guarda de autenticação no `beforeLoad`, só
  a de `is_active` — visitante anônimo consegue abrir `/request`.
- **`NavSecondary`** declara `className` no tipo mas nunca o aplica, então o
  `mt-auto` que o `app-sidebar` passa é silenciosamente ignorado.

### Achados da etapa 1

Coisas descobertas durante a Fundação que **não** foram tratadas nela.

### ⚠️ A etapa 6 acima estava com a direção invertida (corrigido)

O texto original da etapa 6 mandava apagar
`routes/_auth/{checklists,properties}/-components` e fazer as rotas
consumirem `features/*/ui` diretamente. **Isso teria perdido funcionalidade**
— por isso a execução da etapa 6 seguiu a correção descrita abaixo, não o
texto original (ver "Status" no topo do documento).

As cópias em `features/*/ui/list-components/` são forks degradados e hoje
inalcançáveis — nada importa `features/checklists/ui/checklists-list.tsx` nem
`features/properties/ui/properties-list.tsx`, e `create-checklists.tsx` tem 0
bytes. O que as rotas renderizam são as cópias de `routes/-components`, que são
as vivas e mais completas:

- `features/checklists/ui/list-components/actions.tsx` — `handleReopenChecklist`
  e `handleValidateChecklist` foram deletados, os quatro dialogs estão
  comentados e `loading` virou `const [loading] = useState(false)`.
- `features/checklists/ui/list-components/columns.tsx` — o link da linha aponta
  para `/checklists` com `params` comentado, em vez de `/checklists/$checklistId`.
- `features/properties/ui/list-components/actions.tsx` — perdeu o fluxo de
  delete inteiro, o `useAuth` e o gate de `can()`.

**Ação correta:** mover as versões de `routes/-components` **para dentro** de
`features/*/ui`, sobrescrevendo os stubs, e só então apagar as das rotas.
Exceções em que a versão do feature é de fato a mais nova: os `address-form` e
`name-form` de `properties/ui/create-components`.

### Pendências menores

- **`types/types.d.ts` (raiz)** tem entulho de backend num projeto de front:
  `declare module "knex"`, `IPagination`, `IPaginateParams`, `SearchParams`.
  Não foi mexido porque o `ChecklistItem` declarado ali é importado por
  `routes/_auth/checklists/$checklistId/items/$itemId/index.tsx`.
- **`features/checklist-items/types/index.ts`** não tem nenhum `export`, então é
  um *script global*, e `api/checklist-items.ts` usa `ChecklistItem` sem
  importar — resolve pelo global. Arrumar junto com o feature.
- **`bucketUrl()`** concatena `VITE_BUCKET_URL` + path sem normalizar barras,
  igual ao que os call sites faziam. Vale revisar quando o formato dos caminhos
  gravados no banco estiver confirmado.
- **`components/login-form.tsx`** é código morto (nenhum importador) — o login
  hoje é só o botão do MT Login. Decidir na etapa 2 se vira o formulário de dev
  com `VITE_MOCK_AUTH` ou se some.
- **`lib/mt-login.ts`** expõe `grant_type`, `redirect_uri`, `url_token` e
  `url_userInfo`, que o front não usa (a troca do code é feita no backend).
- **`routes/request.tsx`** não tem guarda de autenticação no `beforeLoad`, só a
  de `is_active` — um visitante anônimo consegue abrir `/request`.
- **`features/address`**: `getCities()` chama `/address/cities/{uf}`, enquanto
  `features/properties/ui/edit-components/address-form.tsx` (movido de
  `routes/_auth/properties/-components/address-form.tsx` na etapa 6) chama
  `/address/states/{uf}` para a mesma finalidade. Uma das duas está errada.
- **Testes**: não havia config de vitest (nem `vitest.config.*` nem bloco
  `test:`), então o environment caía em `node` e 19 dos 41 testes quebravam com
  "document is not defined". Resolvido em `vitest.config.ts`, separado do
  `vite.config.ts` porque o vitest 3.2 traz um vite 7 aninhado que conflita em
  tipos com o vite 6 da raiz.
