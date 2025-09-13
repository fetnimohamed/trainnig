import React, { useEffect, useState } from "react";
import api from "../../api";
export default function AdminLessons() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    title: "",
    video_url: "",
    content: "",
    position: 0,
  });
  const [images, setImages] = useState([]);
  const [imgUrl, setImgUrl] = useState("");
  useEffect(() => {
    api.get("/api/admin/courses").then((r) => setCourses(r.data));
  }, []);
  useEffect(() => {
    if (courseId) {
      load();
      loadImages();
    }
  }, [courseId]);
  const load = () =>
    api
      .get(`/api/admin/courses/${courseId}/lessons`)
      .then((r) => setRows(r.data));
  const loadImages = () =>
    api
      .get(`/api/admin/courses/${courseId}/images`)
      .then((r) => setImages(r.data));
  const add = async () => {
    await api.post(`/api/admin/courses/${courseId}/lessons`, form);
    setForm({ title: "", video_url: "", content: "", position: 0 });
    load();
  };
  const save = async (l) => {
    await api.patch(`/api/admin/lessons/${l.id}`, l);
    load();
  };
  const del = async (id) => {
    if (confirm("Supprimer ?")) {
      await api.delete(`/api/admin/lessons/${id}`);
      load();
    }
  };
  const addImage = async () => {
    if (!imgUrl) return;
    await api.post(`/api/admin/courses/${courseId}/images`, {
      image_url: imgUrl,
    });
    setImgUrl("");
    loadImages();
  };
  const delImage = async (id) => {
    if (confirm("Supprimer image ?")) {
      await api.delete(`/api/admin/images/${id}`);
      loadImages();
    }
  };
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h2 className="text-2xl font-bold mb-4">Leçons & Images</h2>
      <select
        className="border rounded px-3 py-2 mb-4"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
      >
        <option value="">Sélectionner une formation...</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>
      {courseId && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Ajouter une leçon</h3>
              <input
                placeholder="Titre"
                className="border rounded px-3 py-2 w-full mb-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <input
                placeholder="URL vidéo"
                className="border rounded px-3 py-2 w-full mb-2"
                value={form.video_url}
                onChange={(e) =>
                  setForm({ ...form, video_url: e.target.value })
                }
              />
              <input
                placeholder="Position"
                className="border rounded px-3 py-2 w-full mb-2"
                value={form.position}
                onChange={(e) =>
                  setForm({ ...form, position: Number(e.target.value) || 0 })
                }
              />
              <textarea
                placeholder="Contenu"
                className="border rounded px-3 py-2 w-full mb-2"
                rows={4}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              <button
                onClick={add}
                className="px-4 py-2 rounded bg-indigo-600 text-white"
              >
                Ajouter
              </button>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Galerie</h3>
              <div className="flex gap-2 mb-2">
                <input
                  placeholder="URL image"
                  className="border rounded px-3 py-2 w-full"
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                />
                <button
                  onClick={addImage}
                  className="px-4 rounded bg-indigo-600 text-white"
                >
                  Ajouter
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {images.map((img) => (
                  <div key={img.id} className="relative">
                    <img
                      src={img.image_url}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      onClick={() => delImage(img.id)}
                      className="absolute top-1 right-1 text-xs bg-white/80 px-2 rounded"
                    >
                      Suppr
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <h3 className="font-semibold mt-6 mb-2">Leçons</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th>Pos</th>
                <th>Titre</th>
                <th>Vidéo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} className="border-b last:border-0">
                  <td>
                    <input
                      defaultValue={l.position}
                      onChange={(e) => (l.position = Number(e.target.value))}
                      className="border rounded px-2 w-16"
                    />
                  </td>
                  <td>
                    <input
                      defaultValue={l.title}
                      onChange={(e) => (l.title = e.target.value)}
                      className="border rounded px-2"
                    />
                  </td>
                  <td>
                    <input
                      defaultValue={l.video_url || ""}
                      onChange={(e) => (l.video_url = e.target.value)}
                      className="border rounded px-2"
                    />
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => save(l)}
                      className="px-3 py-1 rounded border"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => del(l.id)}
                      className="ml-2 px-3 py-1 rounded border text-red-600"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}{" "}
    </div>
  );
}
