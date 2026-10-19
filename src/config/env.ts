/**
 * Único ponto do projeto que lê `import.meta.env`.
 *
 * Regra da arquitetura: nenhum outro arquivo deve tocar `import.meta.env`
 * diretamente — importe daqui. Ver ARCHITECTURE.md.
 */

function readEnv(name: string, value: string | undefined): string {
  if (!value) {
    // Não lançamos: um build sem .env deve subir e falhar de forma visível na
    // rede, não em tela branca. O console aponta a variável que faltou.
    console.error(`[env] Variável ${name} não definida.`);
    return "";
  }

  return value;
}

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const env = {
  apiUrl: stripTrailingSlash(
    readEnv("VITE_API_URL", import.meta.env.VITE_API_URL),
  ),
  baseUrl: stripTrailingSlash(
    readEnv("VITE_BASE_URL", import.meta.env.VITE_BASE_URL),
  ),
  /** Não normalizado de propósito — ver `bucketUrl`. */
  bucketUrl: readEnv("VITE_BUCKET_URL", import.meta.env.VITE_BUCKET_URL),
  mtLogin: {
    url: stripTrailingSlash(
      readEnv("VITE_MT_LOGIN_URL", import.meta.env.VITE_MT_LOGIN_URL),
    ),
    clientId: readEnv(
      "VITE_MT_LOGIN_CLIENT_ID",
      import.meta.env.VITE_MT_LOGIN_CLIENT_ID,
    ),
  },
  isDev: import.meta.env.DEV,
} as const;

/**
 * Prefixo de versão da API. O backend monta o mesmo router em /api/v1 e
 * /api/v2, então o prefixo é uma coisa só e mora no baseURL do cliente HTTP.
 */
export const API_PREFIX = "/api/v1";

/** baseURL do cliente HTTP único (`lib/http.ts`). */
export const apiBaseUrl = `${env.apiUrl}${API_PREFIX}`;

/**
 * URL pública de um arquivo no bucket.
 *
 * Mantém a concatenação crua que os call sites faziam: normalizar as barras
 * aqui mudaria as URLs de imagem em produção, e o formato dos caminhos
 * gravados no banco não foi verificado. Ver MIGRATION.md.
 */
export function bucketUrl(path?: string | null): string {
  if (!path) return "";

  return `${env.bucketUrl}${path}`;
}
