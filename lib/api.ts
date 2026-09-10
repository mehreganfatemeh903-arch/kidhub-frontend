const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const BACKEND_URL = API_URL?.replace(/\/api\/?$/, "") || "";

export function getMediaUrl(url: string | null) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BACKEND_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export async function getToys() {
  const res = await fetch(`${API_URL}/toys/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch toys");
  return res.json();
}

export type ChildProfile = {
  id: number;
  name: string;
  birth_date: string;
  interests: string[];
  goals: string[];
  created_at: string;
  updated_at: string;
};

export async function getChildProfiles(): Promise<ChildProfile[]> {
  const token = localStorage.getItem("kidhub_access");

  const res = await fetch(`${API_URL}/child-profiles/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("خطا در دریافت پروفایل‌های کودک");
  }

  return res.json();
}

export async function createChildProfile(data: {
  name: string;
  birth_date: string;
  interests: string[];
  goals: string[];
}): Promise<ChildProfile> {
  const token = localStorage.getItem("kidhub_access");

  const res = await fetch(`${API_URL}/child-profiles/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      errorData.detail || "خطا در ایجاد پروفایل کودک";

    throw new Error(message);
  }

  return res.json();
}
