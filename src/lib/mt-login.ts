export const config = {
  grant_type: "authorization_code",
  client_id: import.meta.env.VITE_MT_LOGIN_CLIENT_ID,
  redirect_uri: `${import.meta.env.VITE_BASE_URL}/login`,

  url_token:
    import.meta.env.VITE_MT_LOGIN_URL +
    "/realms/mt-realm/protocol/openid-connect/token",
  url_userInfo:
    import.meta.env.VITE_MT_LOGIN_URL +
    "/realms/mt-realm/protocol/openid-connect/userinfo",

  url_login:
    import.meta.env.VITE_MT_LOGIN_URL +
    `/realms/mt-realm/protocol/openid-connect/auth?client_id=${import.meta.env.VITE_MT_LOGIN_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_BASE_URL}/login&response_type=code`,
  url_logout:
    import.meta.env.VITE_MT_LOGIN_URL +
    `/realms/mt-realm/protocol/openid-connect/logout?client_id=${import.meta.env.VITE_MT_LOGIN_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_BASE_URL}/login`,
};
