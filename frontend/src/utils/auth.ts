export function getUser() {
  return JSON.parse(localStorage.getItem("centura_user") || sessionStorage.getItem("centura_user") || "null");
}

export function getToken() {
  return localStorage.getItem("centura_token") || sessionStorage.getItem("centura_token");
}

export function logout() {
  localStorage.removeItem("centura_user");
  localStorage.removeItem("centura_token");
  sessionStorage.removeItem("centura_user");
  sessionStorage.removeItem("centura_token");
}
