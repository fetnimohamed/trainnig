import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
export default function Course() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [message, setMessage] = useState("");
  const [promo, setPromo] = useState("");
  useEffect(() => {
    api.get(`/api/courses/${id}`).then((r) => setCourse(r.data));
  }, [id]);
  const loadLesson = async (lessonId) => {
    try {
      const r = await api.get(`/api/courses/${id}/lesson/${lessonId}`);
      setLesson(r.data);
      setMessage("");
    } catch (e) {
      setMessage(e?.response?.data?.error || "Erreur");
    }
  };
  const buy = async () => {
    const { data } = await api.post(`/api/subscriptions/purchase/${id}`, {
      promo_code: promo || undefined,
    });
    setMessage(
      `Achat OK. Payé ${(data.paid_cents / 100).toFixed(2)}€ ${
        data.promo ? `(code ${data.promo.code})` : ""
      }. Rechargez la leçon.`
    );
  };
  const subscribe = async (plan = "mensuel") => {
    const { data } = await api.post(`/api/subscriptions/start`, {
      plan,
      promo_code: promo || undefined,
    });
    setMessage(
      `Abonnement ${plan} actif. Payé ${(data.paid_cents / 100).toFixed(2)}€ ${
        data.promo ? `(code ${data.promo.code})` : ""
      }.`
    );
  };
  if (!course) return <div>Chargement...</div>;
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-3xl p-6 shadow">
          <div className="grid grid-cols-4 gap-3 mb-4">
            {(course.images || []).slice(0, 4).map((img) => (
              <div
                key={img.id}
                className="h-28 rounded-2xl overflow-hidden border bg-slate-50"
              >
                <img
                  src={img.image_url}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <h2 className="text-3xl font-black">{course.title}</h2>
          <p className="text-gray-600 mt-2">{course.description}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow mt-6">
          <h3 className="font-semibold mb-2">Leçons</h3>
          <ul className="space-y-2">
            {course.lessons.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => loadLesson(l.id)}
                  className="text-left w-full hover:text-indigo-600"
                >
                  {l.position}. {l.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {lesson && (
          <div className="bg-white rounded-3xl p-6 shadow mt-6">
            <h3 className="font-semibold">{lesson.title}</h3>
            {lesson.video_url && (
              <div className="mt-3">
                <a
                  className="text-indigo-600 underline"
                  target="_blank"
                  href={lesson.video_url}
                >
                  Voir la vidéo
                </a>
                <iframe
                  src="https://player.mux.com/ykEUYsXY02INdJK77xz2WjJ7102cqhgaMUQAlu327Ab5o?metadata-video-title=65562-515098354&video-title=65562-515098354"
                  title="Test Video"
                  style={{
                    width: "100%",
                    border: "none",
                    aspectRatio: "16 / 9",
                  }}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                />
              </div>
            )}
            <p className="mt-2 whitespace-pre-wrap">{lesson.content}</p>
          </div>
        )}
      </div>
      <div>
        <div className="bg-white rounded-3xl p-6 shadow sticky top-28">
          <div className="text-xs uppercase tracking-wide text-indigo-600">
            {course.category_name}
          </div>
          <div className="text-3xl font-black mt-1">
            {(course.price_cents / 100).toFixed(2)} €
          </div>
          <input
            placeholder="Code promo (optionnel)"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            className="mt-3 w-full border rounded-xl p-2"
          />
          <button
            onClick={buy}
            className="mt-3 w-full bg-indigo-600 text-white rounded-xl py-2.5 font-semibold"
          >
            Acheter ce cours
          </button>
          <div className="mt-3 text-sm text-gray-600">ou</div>
          <button
            onClick={() => subscribe("mensuel")}
            className="mt-2 w-full border rounded-xl py-2.5"
          >
            S’abonner (mensuel)
          </button>
          <button
            onClick={() => subscribe("annuel")}
            className="mt-2 w-full border rounded-xl py-2.5"
          >
            S’abonner (annuel)
          </button>
          {message && (
            <div className="mt-3 text-sm text-amber-600">{message}</div>
          )}
        </div>
      </div>
    </div>
  );
}
