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

export async function deleteChildProfile(childId: number): Promise<void> {
  const token = localStorage.getItem("kidhub_access");
  const res = await fetch(`${API_URL}/child-profiles/${childId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "خطا در حذف پروفایل کودک");
  }
}
export async function updateChildProfile(childId: number, data: { name: string; birth_date: string; interests: string[]; goals: string[]; }): Promise<ChildProfile> { const token = localStorage.getItem("kidhub_access"); const res = await fetch(`${API_URL}/child-profiles/${childId}/`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(data), }); if (!res.ok) { const errorData = await res.json().catch(() => ({})); throw new Error(errorData.detail || "خطا در ویرایش پروفایل کودک"); } return res.json(); }

export type Recommendation = {
  type: "toy" | "book";
  id: number;
  title: string;
  slug: string;
  score: number;
  match_reasons: string[];
  short_description?: string;
  why_it_helps?: string;
  image?: string | null;
  price_range?: string;
  affiliate_url?: string;
  description?: string;
  book_type?: string;
  cover_image?: string | null;
  source_name?: string;
  source_url?: string;
};

export type ChildRecommendations = {
  child: {
    id: number;
    name: string;
  };
  age_months: number;
  recommendations: Recommendation[];
};

export async function getChildRecommendations(
  childId: number
): Promise<ChildRecommendations> {
  const token = localStorage.getItem("kidhub_access");

  const res = await fetch(
    `${API_URL}/child-profiles/${childId}/recommendations/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("خطا در دریافت پیشنهادهای هوشمند");
  }

  return res.json();
}

export async function uploadLullabyRecording(data: {
  lullaby: number;
  child?: number | null;
  title?: string;
  audio: Blob;
}) {
  const token = localStorage.getItem("kidhub_access");

  const formData = new FormData();
  formData.append("lullaby", String(data.lullaby));

  if (data.child) {
    formData.append("child", String(data.child));
  }

  if (data.title) {
    formData.append("title", data.title);
  }

  formData.append("audio_file", data.audio, "parent-lullaby.webm");

  const res = await fetch(`${API_URL}/lullaby-recordings/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.detail || "خطا در ذخیره صدای ضبط‌شده"
    );
  }

  return res.json();
}

export async function getLullabyRecordings() {
  const token = localStorage.getItem("kidhub_access");

  const res = await fetch(`${API_URL}/lullaby-recordings/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("خطا در دریافت صداهای ضبط‌شده");
  }

  return res.json();
}


