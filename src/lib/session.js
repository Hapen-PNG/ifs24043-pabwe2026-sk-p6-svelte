const COOKIE_NAME = "delcom_logged_in";

export function setLoginCookie() {
  document.cookie = `${COOKIE_NAME}=1; path=/; SameSite=Lax; max-age=604800`;
}

export function clearLoginCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}