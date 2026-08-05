import { env } from "@/config/env";

const realmUrl = `${env.mtLogin.url}/realms/mt-realm/protocol/openid-connect`;
const redirectUri = `${env.baseUrl}/login`;

export const config = {
  grant_type: "authorization_code",
  client_id: env.mtLogin.clientId,
  redirect_uri: redirectUri,

  url_token: `${realmUrl}/token`,
  url_userInfo: `${realmUrl}/userinfo`,

  url_login: `${realmUrl}/auth?client_id=${env.mtLogin.clientId}&redirect_uri=${redirectUri}&response_type=code`,
  url_logout: `${realmUrl}/logout?client_id=${env.mtLogin.clientId}&redirect_uri=${redirectUri}`,
};
