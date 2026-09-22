import { getMediaUrl } from "../../lib/api";

type AgeGroup = {
  id: number;
  title: string;
  min_age_months: number;
  max_age_months: number;
};

type DevelopmentArea = {
  id: number;
  name: string;
  icon: string;
};

type AffiliateSource = {
  id: number;
  name: string;
  base_url: string;
};

type Toy = {
  id: number;
  title: string;
  slug: string;
  age_groups: AgeGroup[];
  development_areas: DevelopmentArea[];
  short_description: string;
  why_it_helps: string;
  image: string | null;
  affiliate_source: AffiliateSource | null;
  affiliate_url: string;
  price_range: string;
};

async function getToys(ageGroupId?: string) {
  const url = ageGroupId
    ? `${"https://kidhubapi-v161cpyq.b4a.run/api"}/toys/?age_groups=${ageGroupId}`
    : `${"https://kidhubapi-v161cpyq.b4a.run/api"}/toys/`;

  const res = await fetch(url, { cache: "no-store", headers: { "User-Agent": "KidHub-Cloudflare" } });

  if (!res.ok) { throw new Error(`Toy API failed: ${res.status} ${res.statusText}`); }

  const data = await res.json();
  return Array.isArray(data) ? data : data.results ?? data.value ?? [];
}

export default async function ToysPage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string }>;
}) {
  const { age } = await searchParams;
  const toys: Toy[] = await getToys(age);

  return (
    <main
      className="min-h-screen px-4 py-8 sm:px-6 lg:px-8"
      dir="rtl"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-7xl">

        <section className="mb-8 rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span
                className="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: "var(--color-bg)",
                  color: "var(--color-primary)",
                }}
              >
                🧸 انتخاب هوشمندانه برای کودک
              </span>

              <h1
                className="text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ color: "var(--color-primary)" }}
              >
                {age
                  ? "اسباب‌بازی‌های مناسب این سن"
                  : "همه‌ی اسباب‌بازی‌ها"}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                مجموعه‌ای از اسباب‌بازی‌های مناسب رشد کودک، با توجه به سن،
                مهارت‌های رشدی و نیازهای یادگیری.
              </p>
            </div>

            <div
              className="inline-flex w-fit items-center rounded-2xl px-4 py-3 text-sm font-medium"
              style={{
                backgroundColor: "var(--color-bg)",
                color: "var(--color-primary)",
              }}
            >
              {toys.length} مورد
            </div>
          </div>
        </section>

        {toys.length === 0 && (
          <section className="rounded-3xl border bg-white p-10 text-center shadow-sm">
            <div className="mb-3 text-4xl">🧸</div>
            <h2 className="text-lg font-bold text-gray-800">
              موردی برای این بازه‌ی سنی پیدا نشد
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              می‌توانید بازه‌ی سنی دیگری را امتحان کنید.
            </p>
          </section>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {toys.map((toy) => (
            <article
              key={toy.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{ borderColor: "var(--color-card-border)" }}
            >
              <a
                href={`/toys/${toy.slug}`}
                className="block overflow-hidden bg-gray-50"
              >
                {toy.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getMediaUrl(toy.image) || ""}
                    alt={toy.title}
                    className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center text-5xl">
                    🧸
                  </div>
                )}
              </a>

              <div className="flex flex-1 flex-col p-5">
                <a href={`/toys/${toy.slug}`}>
                  <h2
                    className="line-clamp-2 text-lg font-bold leading-8 transition"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {toy.title}
                  </h2>
                </a>

                <p className="mt-2 line-clamp-3 text-sm leading-7 text-gray-600">
                  {toy.short_description}
                </p>

                {toy.development_areas.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {toy.development_areas.map((area) => (
                      <span
                        key={area.id}
                        className="rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: "var(--color-bg)",
                          color: "var(--color-primary)",
                        }}
                      >
                        {area.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-5">
                  {toy.price_range && (
                    <div
                      className="mb-3 text-base font-bold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {toy.price_range}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <a
                      href={`/toys/${toy.slug}`}
                      className="flex-1 rounded-xl border py-2.5 text-center text-sm font-medium transition hover:bg-gray-50"
                      style={{ borderColor: "var(--color-card-border)" }}
                    >
                      مشاهده جزئیات
                    </a>

                    {toy.affiliate_url && (
                      <a
                        href={toy.affiliate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-xl py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
                        style={{
                          backgroundColor: "var(--color-secondary)",
                        }}
                      >
                        خرید
                      </a>
                    )}
                  </div>

                  {toy.affiliate_url && (
                    <p className="mt-2 text-center text-xs text-gray-400">
                      از {toy.affiliate_source?.name || "فروشگاه"}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
