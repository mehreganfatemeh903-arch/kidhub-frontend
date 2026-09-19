const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type AuthTokens = {
  access: string;
  refresh: string;
};

export function saveTokens(tokens: AuthTokens, username: string) {
  localStorage.setItem("kidhub_access", tokens.access);
  localStorage.setItem("kidhub_refresh", tokens.refresh);
  localStorage.setItem("kidhub_username", username);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("kidhub_access");
}

export function getUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("kidhub_username");
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}

export function logout() {
  localStorage.removeItem("kidhub_access");
  localStorage.removeItem("kidhub_refresh");
  localStorage.removeItem("kidhub_username");
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    throw new Error("نام کاربری یا رمز عبور اشتباه است.");
  }
  const data: AuthTokens = await res.json();
  saveTokens(data, username);
  return data;
}

export async function register(username: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    let msg = "خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.";
    const firstKey = Object.keys(errData)[0];
    if (firstKey && Array.isArray(errData[firstKey]) && errData[firstKey].length > 0) {
      msg = errData[firstKey][0];
    }
    throw new Error(msg);
  }
  // پس از ثبت‌نام موفق، بلافاصله وارد می‌شویم
  return login(username, password);
}
