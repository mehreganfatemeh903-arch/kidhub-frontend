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
async function getBook(slug: string): Promise<Book | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/?slug=${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  const list = Array.isArray(data) ? data : data.value;
  return list?.find((b: Book) => b.slug === slug) || null;
}
export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) {
    return (
      <main className="p-6" dir="rtl">
        <p className="text-gray-500">این کتاب پیدا نشد.</p>
      </main>
    );
  }
  return (
    <main className="p-6 max-w-2xl mx-auto" dir="rtl">
      {book.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={book.cover_image}
          alt={book.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}
      <span
        className="text-xs px-2 py-1 rounded-full inline-block mb-2"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        {typeLabel[book.book_type] || book.book_type}
      </span>
      <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
      <p className="text-gray-700 mb-4">{book.description}</p>
      {book.source_name && (
        <p className="text-sm text-gray-400 mb-4">منبع: {book.source_name}</p>
      )}
      {book.source_url && (
        <a
          href={book.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-white rounded-md py-3"
          style={{ backgroundColor: "var(--color-secondary)" }}
        >
          مشاهده / دریافت
        </a>
      )}
    </main>
  );
}
