"use client";

import { useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ProfileSectionProps {
  userData: any;
  onUpdate: (data: any) => void;
}

export default function ProfileSection({ userData, onUpdate }: ProfileSectionProps) {
  const profile = userData?.teacherProfile;
  const reviews = userData?.reviewsReceived || [];

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState({
    nombre: userData?.nombre || "",
    materia: profile?.materia || "",
    bio: profile?.bio || "",
    precio_hora: profile?.precio_hora || "",
    modalidad: profile?.modalidad || "",
    telefono: profile?.telefono || "",
    foto: profile?.foto || "",
  });

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/teacher-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccessMsg("¡Perfil actualizado correctamente!");
        setIsEditing(false);
        onUpdate({
          ...userData,
          nombre: form.nombre,
          teacherProfile: { ...profile, ...form, precio_hora: Number(form.precio_hora) },
        });
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch {
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = (result: any) => {
    if (result.info?.secure_url) {
      setForm({ ...form, foto: result.info.secure_url });
    }
  };

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="p-4 bg-green-50 text-green-700 font-semibold text-sm rounded-2xl border border-green-100 animate-fade-in">
          ✅ {successMsg}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-rosa-50 via-white to-rosa-50 p-8 pb-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <div className="relative group -mb-10">
              <div className="w-28 h-28 rounded-2xl bg-rosa-100 border-4 border-white shadow-lg overflow-hidden relative">
                {form.foto ? (
                  <Image src={form.foto} alt="Perfil" fill className="object-cover" sizes="112px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-rosa-300 font-bold">
                    {form.nombre?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>
              {isEditing && (
                <CldUploadWidget uploadPreset="busco_profe" onSuccess={handlePhotoUpload} options={{ maxFiles: 1 }}>
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-black text-white rounded-lg text-xs font-bold shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
                    >
                      📷
                    </button>
                  )}
                </CldUploadWidget>
              )}
            </div>
            <div className="text-center sm:text-left pb-4 -mb-10">
              <h2 className="text-xl font-extrabold text-black">{form.nombre}</h2>
              <p className="text-gray-400 text-sm font-medium">Profesor de {form.materia}</p>
            </div>
            <div className="sm:ml-auto pb-4 -mb-10">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 bg-black text-white font-bold text-sm rounded-xl hover:bg-gray-800 active:scale-95 transition-all"
                >
                  ✏️ Editar perfil
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2.5 border border-gray-200 text-gray-500 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors">
                    Cancelar
                  </button>
                  <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 bg-rosa-400 text-white font-bold text-sm rounded-xl hover:bg-rosa-500 active:scale-95 transition-all disabled:opacity-50">
                    {saving ? "Guardando..." : "💾 Guardar"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 pt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Nombre completo" name="nombre" value={form.nombre} editing={isEditing} onChange={(v) => setForm({ ...form, nombre: v })} />
          <Field label="Email" value={userData?.email} editing={false} disabled />
          <Field label="Materia" name="materia" value={form.materia} editing={isEditing} onChange={(v) => setForm({ ...form, materia: v })} />
          <Field label="Precio por hora (ARS)" name="precio_hora" value={form.precio_hora} editing={isEditing} onChange={(v) => setForm({ ...form, precio_hora: v })} type="number" />
          <Field label="WhatsApp" name="telefono" value={form.telefono} editing={isEditing} onChange={(v) => setForm({ ...form, telefono: v })} />
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Modalidad</label>
            {isEditing ? (
              <div className="flex gap-2">
                {["presencial", "virtual", "ambas"].map((m) => (
                  <button key={m} type="button" onClick={() => setForm({ ...form, modalidad: m })}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all capitalize ${
                      form.modalidad === m ? "border-rosa-400 bg-rosa-50 text-rosa-600" : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >{m}</button>
                ))}
              </div>
            ) : (
              <p className="text-black font-semibold capitalize">{form.modalidad || "—"}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Biografía</label>
            {isEditing ? (
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rosa-400 focus:ring-2 focus:ring-rosa-400/20 text-black bg-white resize-none text-sm"
              />
            ) : (
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{form.bio || "—"}</p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h3 className="text-lg font-bold text-black mb-4">Reseñas recibidas ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <span className="text-3xl block mb-2">⭐</span>
            <p className="text-gray-500 text-sm font-medium">Aún no tienes reseñas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r: any) => (
              <div key={r.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-rosa-100 flex items-center justify-center text-rosa-500 font-bold text-sm flex-shrink-0">
                  {r.alumno.nombre.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-black text-sm">{r.alumno.nombre}</p>
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < r.estrellas ? "text-yellow-400" : "text-gray-200"}>★</span>
                      ))}
                    </div>
                  </div>
                  {r.comentario && <p className="text-gray-600 text-sm">{r.comentario}</p>}
                  <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, editing, onChange, disabled, type = "text", name }: any) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{label}</label>
      {editing && !disabled ? (
        <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rosa-400 focus:ring-2 focus:ring-rosa-400/20 text-black bg-white text-sm"
        />
      ) : (
        <p className={`font-semibold text-sm ${disabled ? "text-gray-400" : "text-black"}`}>{value || "—"}</p>
      )}
    </div>
  );
}
