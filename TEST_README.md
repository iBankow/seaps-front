# Testes Automatizados - SEAPS Frontend

Este documento descreve a estrutura e como executar os testes automatizados do frontend do SEAPS.

## Tecnologias Utilizadas

- **Vitest**: Framework de testes rápido e moderno
- **React Testing Library**: Utilitários para testar componentes React
- **Jest DOM**: Matchers customizados para testes DOM
- **User Event**: Simulação de interações do usuário

## Estrutura dos Testes

```
src/
├── test/
│   └── setup.ts                    # Configuração global dos testes
├── components/
│   ├── ui/
│   │   └── __tests__/
│   │       ├── button.test.tsx     # Testes do componente Button
│   │       ├── input.test.tsx      # Testes do componente Input
│   │       └── card.test.tsx       # Testes do componente Card
│   └── __tests__/
│       └── login-form.test.tsx     # Testes do formulário de login
├── hooks/
│   └── __tests__/
│       ├── use-debounce.test.ts    # Testes do hook useDebounce
│       ├── use-mobile.test.ts      # Testes do hook useIsMobile
│       └── use-modal.test.ts       # Testes do hook useModal
├── contexts/
│   └── __tests__/
│       └── auth-contexts.test.tsx  # Testes do contexto de autenticação
├── lib/
│   └── __tests__/
│       └── utils.test.ts           # Testes das funções utilitárias
└── __tests__/
    └── integration/
        └── login-flow.test.tsx     # Testes de integração do fluxo de login
```

## Scripts Disponíveis

### Executar Testes
```bash
# Executar todos os testes uma vez
npm test

# Executar testes em modo watch (re-executa quando arquivos mudam)
npm run test:watch

# Executar testes com interface gráfica
npm run test:ui

# Executar testes com relatório de cobertura
npm run test:coverage
```

## Tipos de Testes

### 1. Testes de Componentes UI
- **Button**: Testa variantes, tamanhos, eventos de click, estado desabilitado
- **Input**: Testa entrada de dados, tipos diferentes, eventos onChange
- **Card**: Testa renderização de todos os subcomponentes

### 2. Testes de Formulários
- **LoginForm**: Testa validação, envio de dados, toggle de senha, integração com API

### 3. Testes de Hooks
- **useDebounce**: Testa atraso de execução, cancelamento, múltiplos argumentos
- **useIsMobile**: Testa detecção de dispositivos móveis e mudanças de viewport
- **useModal**: Testa abertura, fechamento, controle de índice

### 4. Testes de Contextos
- **AuthContext**: Testa autenticação, login, logout, estados de loading

### 5. Testes de Utilitários
- **utils**: Testa funções de formatação, debounce, manipulação de strings

### 6. Testes de Integração
- **login-flow**: Testa fluxo completo de login com múltiplos componentes

## Mocks e Configurações

### APIs Mockadas
- `@/lib/api`: Mock das chamadas HTTP
- `@tanstack/react-router`: Mock do roteador
- `@/lib/mt-login`: Mock da configuração MT Login

### Configurações Globais
- **IntersectionObserver**: Mockado para testes de componentes que usam scrolling
- **ResizeObserver**: Mockado para componentes responsivos
- **matchMedia**: Mockado para testes de media queries
- **scrollTo**: Mockado para testes de navegação

## Cobertura de Testes

O relatório de cobertura é gerado em:
- Terminal: Resumo textual
- Arquivo JSON: `coverage/coverage-final.json`
- Relatório HTML: `coverage/index.html`

### Metas de Cobertura
- **Linhas**: > 80%
- **Funções**: > 80%
- **Branches**: > 70%
- **Statements**: > 80%

## Convenções

### Nomenclatura de Arquivos
- Arquivos de teste devem ter extensão `.test.tsx` ou `.test.ts`
- Devem estar em pasta `__tests__` dentro da pasta do módulo testado

### Estrutura dos Testes
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup antes de cada teste
  })

  it('should describe what it tests', () => {
    // Arrange
    // Act
    // Assert
  })
})
```

### Helpers Comuns
- `render()`: Renderiza componente
- `screen.getBy*()`: Encontra elementos
- `userEvent.setup()`: Configura interações do usuário
- `waitFor()`: Aguarda mudanças assíncronas

## Executando Testes Específicos

```bash
# Executar testes de um arquivo específico
npm test button.test.tsx

# Executar testes que correspondem a um padrão
npm test components/ui

# Executar teste específico por nome
npm test -- -t "should render correctly"
```

## CI/CD

Os testes são executados automaticamente:
- Em cada push para branches
- Em pull requests
- Antes do build de produção

## Troubleshooting

### Problemas Comuns

1. **Erro de timeout**: Aumentar timeout em testes assíncronos
2. **Mock não funciona**: Verificar se o mock está no lugar correto
3. **Elemento não encontrado**: Usar `await waitFor()` para elementos assíncronos

### Debug de Testes
```typescript
// Visualizar DOM atual
screen.debug()

// Visualizar elemento específico
screen.debug(screen.getByRole('button'))
```

## Contribuindo

1. Sempre criar testes para novos componentes
2. Manter cobertura acima das metas estabelecidas
3. Usar describe/it descritivos
4. Seguir padrão AAA (Arrange, Act, Assert)
5. Mockar dependências externas
