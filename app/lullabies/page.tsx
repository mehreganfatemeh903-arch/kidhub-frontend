"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getChildProfiles,
  getLullabyRecordings,
  getMediaUrl,
  uploadLullabyRecording,
  type ChildProfile,
} from "@/lib/api";

type Lullaby = {
  id: number;
  title: string;
  slug: string;
  description: string;
  lyrics: string;
  audio_file: string | null;
  source_name: string;
  source_url: string;
  is_public_domain: boolean;
  age_groups?: {
    id: number;
    name: string;
  }[];
};

type Recording = {
  id: number;
  child: number | null;
  lullaby: number;
  audio_file: string;
  title: string;
  created_at: string;
};

export default function LullabiesPage() {
  const [lullabies, setLullabies] = useState<Lullaby[]>([]);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [expandedLyrics, setExpandedLyrics] = useState<number | null>(null);

  const [recordingLullabyId, setRecordingLullabyId] = useState<number | null>(
    null
  );
  const [selectedChild, setSelectedChild] = useState<number | "">("");
  const [recordingTitle, setRecordingTitle] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const ageGroups = [
    { id: 4, name: "۰ تا ۶ ماه" },
    { id: 5, name: "۶ تا ۱۲ ماه" },
    { id: 6, name: "۱ تا ۲ سال" },
    { id: 7, name: "۲ تا ۳ سال" },
    { id: 8, name: "۳ تا ۴ سال" },
    { id: 9, name: "۴ تا ۵ سال" },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const [lullabyResponse, childData] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/lullabies/`),
          getChildProfiles().catch(() => []),
        ]);

        if (!lullabyResponse.ok) {
          throw new Error("دریافت لالایی‌ها انجام نشد.");
        }

        const lullabyData = await lullabyResponse.json();

        setLullabies(Array.isArray(lullabyData) ? lullabyData : []);
        setChildren(childData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "دریافت اطلاعات لالایی‌ها انجام نشد."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    getLullabyRecordings()
      .then((data) => setRecordings(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const filteredLullabies = useMemo(() => {
    if (selectedAge === null) return lullabies;

    return lullabies.filter((lullaby) =>
      lullaby.age_groups?.some((group) => group.id === selectedAge)
    );
  }, [lullabies, selectedAge]);

  const startRecording = async (lullabyId: number) => {
    setMessage("");

    if (!localStorage.getItem("kidhub_access")) {
      setMessage("برای ضبط و ذخیره صدای خود، ابتدا وارد حساب کاربری شوید.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage("مرورگر شما از ضبط صدا پشتیبانی نمی‌کند.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        setSaving(true);

        try {
          const result = await uploadLullabyRecording({
            lullaby: lullabyId,
            child: selectedChild === "" ? null : selectedChild,
            title: recordingTitle || "لالایی ضبط‌شده توسط والد",
            audio: audioBlob,
          });

          setRecordings((current) => [result, ...current]);
          setMessage("صدای شما با موفقیت ذخیره شد.");
          setRecordingLullabyId(null);
          setRecordingTitle("");
        } catch (err) {
          setMessage(
            err instanceof Error
              ? err.message
              : "ذخیره صدای ضبط‌شده انجام نشد."
          );
        } finally {
          setSaving(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecordingLullabyId(lullabyId);
      setIsRecording(true);
    } catch {
      setMessage(
        "دسترسی به میکروفون ممکن نشد. لطفاً اجازه استفاده از میکروفون را فعال کنید."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    setIsRecording(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white">
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-10">
        <div className="rounded-3xl border border-rose-100 bg-white p-7 shadow-sm md:p-10">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700">
              آرامش و خواب کودک
            </span>

            <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              لالایی‌های آرام برای شب‌های کودک
            </h1>

            <p className="mt-4 text-base leading-8 text-gray-600 md:text-lg">
              مجموعه‌ای از لالایی‌های کودکانه برای لحظه‌های آرام قبل از خواب.
              می‌توانید متن لالایی را بخوانید و صدای خودتان را برای کودک ضبط و
              ذخیره کنید.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-rose-50 p-4">
              <div className="text-2xl">🌙</div>
              <h2 className="mt-2 font-semibold text-gray-900">
                زمان خواب
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                محیطی آرام برای روتین شبانه کودک.
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 p-4">
              <div className="text-2xl">📖</div>
              <h2 className="mt-2 font-semibold text-gray-900">
                متن لالایی
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                متن هر لالایی را در کنار آن بخوانید.
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-4">
              <div className="text-2xl">🎙️</div>
              <h2 className="mt-2 font-semibold text-gray-900">
                صدای والد
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                صدای خودتان را برای کودک ضبط و ذخیره کنید.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-3 font-semibold text-gray-900">
            انتخاب بر اساس سن
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedAge(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedAge === null
                  ? "bg-rose-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              همه
            </button>

            {ageGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedAge(group.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedAge === group.id
                    ? "bg-rose-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {group.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        {message && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-7 text-rose-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
            در حال بارگذاری لالایی‌ها...
          </div>
        ) : filteredLullabies.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center">
            <div className="text-4xl">🌙</div>
            <h2 className="mt-3 text-xl font-bold text-gray-900">
              لالایی‌ای برای این گروه سنی پیدا نشد
            </h2>
            <button
              type="button"
              onClick={() => setSelectedAge(null)}
              className="mt-4 rounded-xl bg-rose-600 px-5 py-2.5 font-semibold text-white"
            >
              نمایش همه لالایی‌ها
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredLullabies.map((lullaby) => {
              const isCurrentRecording =
                recordingLullabyId === lullaby.id && isRecording;

              const showLyrics = expandedLyrics === lullaby.id;

              return (
                <article
                  key={lullaby.id}
                  className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="bg-gradient-to-l from-rose-100 to-purple-50 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-2 text-2xl">🌙</div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {lullaby.title}
                        </h2>
                      </div>

                      {lullaby.is_public_domain && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          مالکیت عمومی
                        </span>
                      )}
                    </div>

                    {lullaby.description && (
                      <p className="mt-3 leading-7 text-gray-600">
                        {lullaby.description}
                      </p>
                    )}

                    {lullaby.age_groups &&
                      lullaby.age_groups.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {lullaby.age_groups.map((group) => (
                            <span
                              key={group.id}
                              className="rounded-full bg-white/80 px-3 py-1 text-xs text-gray-600"
                            >
                              {group.name}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>

                  <div className="p-6">
                    {lullaby.audio_file ? (
                      <div className="mb-5 rounded-2xl border bg-gray-50 p-4">
                        <div className="mb-2 font-semibold text-gray-900">
                          🎵 پخش لالایی
                        </div>
                        <audio
                          controls
                          className="w-full"
                          src={
                            getMediaUrl(lullaby.audio_file) || undefined
                          }
                        />
                      </div>
                    ) : (
                      <div className="mb-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm leading-7 text-amber-800">
                        فایل صوتی این لالایی هنوز در سایت قرار نگرفته است.
                        فعلاً می‌توانید متن آن را بخوانید یا صدای خودتان را
                        ضبط کنید.
                      </div>
                    )}

                    {lullaby.lyrics && (
                      <div className="mb-5 rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedLyrics(showLyrics ? null : lullaby.id)
                          }
                          className="flex w-full items-center justify-between text-right font-semibold text-gray-900"
                        >
                          <span>📖 متن لالایی</span>
                          <span>{showLyrics ? "−" : "+"}</span>
                        </button>

                        {showLyrics && (
                          <p className="mt-4 whitespace-pre-line leading-8 text-gray-700">
                            {lullaby.lyrics}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="rounded-2xl bg-gray-50 p-5">
                      <div className="mb-1 text-lg font-bold text-gray-900">
                        🎙️ صدای خودم را ضبط کنم
                      </div>

                      <p className="mb-4 text-sm leading-6 text-gray-600">
                        می‌توانید لالایی را با صدای خودتان برای کودک ضبط کنید.
                      </p>

                      {children.length > 0 && (
                        <select
                          value={selectedChild}
                          onChange={(event) =>
                            setSelectedChild(
                              event.target.value === ""
                                ? ""
                                : Number(event.target.value)
                            )
                          }
                          disabled={isRecording || saving}
                          className="mb-3 w-full rounded-xl border bg-white px-3 py-2.5 outline-none focus:border-rose-400"
                        >
                          <option value="">برای کدام کودک؟</option>
                          {children.map((child) => (
                            <option key={child.id} value={child.id}>
                              {child.name}
                            </option>
                          ))}
                        </select>
                      )}

                      <input
                        type="text"
                        value={recordingTitle}
                        onChange={(event) =>
                          setRecordingTitle(event.target.value)
                        }
                        disabled={isRecording || saving}
                        placeholder="عنوان ضبط، مثلاً لالایی مامان"
                        className="mb-3 w-full rounded-xl border bg-white px-3 py-2.5 outline-none focus:border-rose-400"
                      />

                      {isCurrentRecording ? (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white"
                        >
                          ⏹ توقف و ذخیره
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startRecording(lullaby.id)}
                          disabled={saving || isRecording}
                          className="w-full rounded-xl bg-rose-600 px-4 py-3 font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {saving ? "در حال ذخیره..." : "🎙️ شروع ضبط صدا"}
                        </button>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                      {lullaby.source_name && (
                        <span>منبع: {lullaby.source_name}</span>
                      )}

                      {lullaby.source_url && (
                        <a
                          href={lullaby.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-rose-600 hover:underline"
                        >
                          مشاهده منبع
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {recordings.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <span className="text-2xl">🎧</span>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                صداهای ضبط‌شده من
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                ضبط‌هایی که برای حساب کاربری خود ذخیره کرده‌اید.
              </p>
            </div>

            <div className="space-y-4">
              {recordings.map((recording) => (
                <div
                  key={recording.id}
                  className="rounded-2xl border bg-gray-50 p-4"
                >
                  <h3 className="mb-3 font-semibold text-gray-900">
                    {recording.title || "لالایی ضبط‌شده"}
                  </h3>

                  <audio
                    controls
                    className="w-full"
                    src={
                      getMediaUrl(recording.audio_file) || undefined
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
