export function getAuth() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const userId = localStorage.getItem("userId");
  if (!token) return null;
  return { token, role, name, userId };
}

export function setAuth({ token, role, name, userId }) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("name", name);
  localStorage.setItem("userId", userId);
}

export function clearAuth() {
  localStorage.clear();
}
