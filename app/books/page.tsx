type AgeGroup = { id: number; title: string; };
type Book = {
  id: number;
  title: string;
  slug: string;
  age_groups: AgeGroup[];
  book_type: string;
  description: string;
  cover_image: string | null;
  source_name: string;
  source_url: string;
};
const typeLabel: Record<string, string> = {
  video: "ویدیو",
  text: "متنی",
  audio: "صوتی",
};
async function getBooks(ageGroupId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/books/?age_groups=${ageGroupId}`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : data.value;
}
export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string }>;
}) {
  const { age } = await searchParams;
  const books: Book[] = age ? await getBooks(age) : [];
  return (
    <main className="p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">کتاب‌های مناسب این سن</h1>
      {books.length === 0 && (
        <p className="text-gray-500">موردی برای این بازه‌ی سنی پیدا نشد.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {books.map((book) => (
          <a
            key={book.id}
            href={`/books/${book.slug}`}
            className="border rounded-lg p-4 flex flex-col gap-2"
            style={{ borderColor: "var(--color-card-border)" }}
          >
            {book.cover_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.cover_image}
                alt={book.title}
                className="w-full h-40 object-cover rounded-md"
              />
            )}
            <span
              className="text-xs w-fit px-2 py-1 rounded-full"
              style={{ backgroundColor: "var(--color-bg)" }}
            >
              {typeLabel[book.book_type] || book.book_type}
            </span>
            <h2 className="font-semibold">{book.title}</h2>
            <p className="text-sm text-gray-600">{book.description}</p>
            {book.source_name && (
              <span className="text-xs text-gray-400">{book.source_name}</span>
            )}
          </a>
        ))}
      </div>
    </main>
  );
}
