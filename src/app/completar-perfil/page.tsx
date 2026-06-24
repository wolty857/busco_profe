"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { GraduationCap, Paperclip, Video, Award, Rocket, User, Phone, FileText, Camera } from "lucide-react";

export default function CompletarPerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isLoading, error, success, setLoading, setError, setSuccess, clearMessages } =
    useAuthStore();

  const userRol = (session?.user as any)?.rol;
  const isProfesor = userRol === "profesor";

  const [formData, setFormData] = useState({
    materia: "",
    bio: "",
    precio_hora: "",
    modalidad: "",
    telefono: "",
    foto: "",
    video_url: "",
    titulos: [] as { name: string; url: string }[],
  });

  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      const user = session?.user as any;
      if (user?.hasProfile) {
        router.push("/");
      }
    }
  }, [status, session, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    clearMessages();

    if (name === "bio") {
      setCharCount(value.length);
    }
  };

  const handleUploadFoto = (result: any) => {
    if (result.info?.secure_url) {
      setFormData({ ...formData, foto: result.info.secure_url });
    }
  };

  const handleUploadVideo = (result: any) => {
    if (result.info?.secure_url) {
      setFormData({ ...formData, video_url: result.info.secure_url });
    }
  };

  const handleUploadTitulo = (result: any) => {
    if (result.info?.secure_url) {
      setFormData({ 
        ...formData, 
        titulos: [...formData.titulos, { name: result.info.original_filename || "Certificado", url: result.info.secure_url }] 
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    try {
      // Validaciones del lado del cliente
      if (isProfesor) {
        if (!formData.foto) {
          setError("Debes subir una foto de perfil.");
          return;
        }
        if (!formData.telefono.match(/^\d{7,15}$/)) {
          setError("Ingresa un número de WhatsApp válido (solo dígitos, entre 7 y 15 caracteres).");
          return;
        }
      } else {
        if (!formData.telefono.match(/^\d{7,15}$/)) {
          setError("Ingresa un número de WhatsApp válido (solo dígitos, entre 7 y 15 caracteres).");
          return;
        }
      }

      const apiUrl = isProfesor ? "/api/teacher-profile" : "/api/alumno-profile";
      
      const payload = isProfesor
        ? {
            ...formData,
            precio_hora: Number(formData.precio_hora),
          }
        : {
            foto: formData.foto || "",
            telefono: formData.telefono,
            bio: formData.bio || "",
          };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setSuccess(isProfesor 
        ? "¡Perfil profesional creado exitosamente!" 
        : "¡Perfil completado exitosamente!"
      );

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch {
      setError("Error al crear el perfil. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-rosa-400/30 border-t-rosa-400 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden py-12">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-rosa-400/10 rounded-full blur-3xl -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-rosa-400/10 rounded-full blur-3xl translate-y-1/2"></div>

      <div className={`w-full ${isProfesor ? "max-w-2xl" : "max-w-md"} mx-4 animate-fade-in z-10`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rosa-50 rounded-full mb-4">
            {isProfesor ? (
              <GraduationCap size={24} className="text-rosa-500" />
            ) : (
              <User size={24} className="text-rosa-500" />
            )}
            <span className="text-rosa-500 font-bold text-sm">Paso final</span>
          </div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            {isProfesor ? "Completa tu perfil profesional" : "Completa tu perfil"}
          </h1>
          <p className="text-gray-500 mt-2 text-sm font-medium max-w-sm mx-auto">
            {isProfesor
              ? "Esta información será visible para los alumnos que busquen profesores como tú"
              : "Esta información te ayudará a conectar con los profesores"
            }
          </p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-xl shadow-rosa-400/5 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Foto de Perfil (Ambos roles) */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full border-4 border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center relative group">
                {formData.foto ? (
                  <Image src={formData.foto} alt="Perfil" fill className="object-cover" />
                ) : (
                  <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                )}
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                  <CldUploadWidget 
                    uploadPreset="busco_profe" 
                    onSuccess={handleUploadFoto} 
                    options={{ 
                      maxFiles: 1, 
                      maxFileSize: 10000000,
                      cropping: true, 
                      croppingAspectRatio: 1,
                      croppingShowDimensions: true,
                    }}
                  >
                    {({ open }) => (
                      <button type="button" onClick={() => open()} className="text-white text-xs font-bold px-3 py-1 border border-white/50 rounded-lg backdrop-blur-sm">Cambiar</button>
                    )}
                  </CldUploadWidget>
                </div>
              </div>
              {!formData.foto && (
                <CldUploadWidget 
                  uploadPreset="busco_profe" 
                  onSuccess={handleUploadFoto} 
                  options={{ 
                    maxFiles: 1,
                    maxFileSize: 10000000,
                    cropping: true,
                    croppingAspectRatio: 1,
                    croppingShowDimensions: true,
                  }}
                >
                  {({ open }) => (
                    <button type="button" onClick={() => open()} className="flex items-center gap-2 text-sm font-semibold text-rosa-500 hover:text-rosa-600">
                      <Camera size={16} /> Subir foto de perfil {!isProfesor && <span className="text-gray-400 font-normal">(Opcional)</span>}
                    </button>
                  )}
                </CldUploadWidget>
              )}
            </div>

            {/* ===== CAMPOS PROFESOR ===== */}
            {isProfesor && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Materia */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Materia principal</label>
                    <input
                      name="materia"
                      type="text"
                      required
                      value={formData.materia}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rosa-400 focus:ring-2 focus:ring-rosa-400/20 text-black bg-white/50"
                      placeholder="Ej: Matemáticas"
                    />
                  </div>

                  {/* Teléfono / WhatsApp */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center gap-1.5"><Phone size={14} /> WhatsApp (con código de país)</span>
                    </label>
                    <input
                      name="telefono"
                      type="text"
                      required
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rosa-400 focus:ring-2 focus:ring-rosa-400/20 text-black bg-white/50"
                      placeholder="Ej: 5491144556677"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sobre ti</label>
                  <textarea
                    name="bio"
                    required
                    rows={4}
                    maxLength={2000}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rosa-400 focus:ring-2 focus:ring-rosa-400/20 text-black bg-white/50 resize-none"
                    placeholder="Cuéntale a tus futuros alumnos sobre tu experiencia..."
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-400">Mínimo 20 caracteres</p>
                    <p className={`text-xs ${charCount >= 20 ? "text-green-500" : "text-gray-400"}`}>
                      {charCount}/2000
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Precio por hora */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Precio por hora (ARS)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-400 font-semibold">$</span>
                      </div>
                      <input
                        name="precio_hora"
                        type="number"
                        required
                        min="1"
                        step="1"
                        value={formData.precio_hora}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rosa-400 focus:ring-2 focus:ring-rosa-400/20 text-black bg-white/50"
                        placeholder="5000"
                      />
                    </div>
                  </div>

                  {/* Modalidad */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Modalidad</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "presencial", label: "Presencial" },
                        { value: "virtual", label: "Virtual" },
                        { value: "ambas", label: "Ambas" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, modalidad: option.value })}
                          className={`py-2 px-1 rounded-xl border transition-all text-xs font-semibold ${
                            formData.modalidad === option.value
                              ? "border-rosa-400 bg-rosa-50 text-rosa-600"
                              : "border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Media Uploads (Video y Títulos) */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                  <h3 className="font-bold text-black flex items-center gap-2">
                    <Paperclip size={18} className="text-gray-500" /> Material multimedia <span className="text-xs font-normal text-gray-400 bg-gray-200 px-2 py-0.5 rounded-md">(Opcional)</span>
                  </h3>
                  
                  <div className="flex flex-col gap-3">
                    <CldUploadWidget uploadPreset="busco_profe" onSuccess={handleUploadVideo} options={{ sources: ['local'], resourceType: 'video', maxFiles: 1, maxFileSize: 52428800 }}>
                      {({ open }) => (
                        <button type="button" onClick={() => open()} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-rosa-300 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-rosa-50 rounded-lg flex items-center justify-center text-rosa-500 group-hover:scale-110 transition-transform"><Video size={20} /></div>
                            <div className="text-left">
                              <p className="font-semibold text-sm text-black">Video de presentación</p>
                              <p className="text-xs text-gray-500">{formData.video_url ? "Video subido ✓" : "Máx. 50MB"}</p>
                            </div>
                          </div>
                          <span className="text-rosa-400 font-bold text-xl">+</span>
                        </button>
                      )}
                    </CldUploadWidget>

                    <CldUploadWidget uploadPreset="busco_profe" onSuccess={handleUploadTitulo} options={{ sources: ['local'], multiple: true, maxFileSize: 10000000 }}>
                      {({ open }) => (
                        <button type="button" onClick={() => open()} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-rosa-300 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-rosa-50 rounded-lg flex items-center justify-center text-rosa-500 group-hover:scale-110 transition-transform"><Award size={20} /></div>
                            <div className="text-left">
                              <p className="font-semibold text-sm text-black">Títulos o certificados</p>
                              <p className="text-xs text-gray-500">{formData.titulos.length > 0 ? `${formData.titulos.length} archivos subidos` : "Máx. 10MB por archivo"}</p>
                            </div>
                          </div>
                          <span className="text-rosa-400 font-bold text-xl">+</span>
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>
                </div>
              </>
            )}

            {/* ===== CAMPOS ALUMNO ===== */}
            {!isProfesor && (
              <>
                {/* Teléfono / WhatsApp */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-1.5"><Phone size={14} /> WhatsApp (con código de país)</span>
                  </label>
                  <input
                    name="telefono"
                    type="text"
                    required
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rosa-400 focus:ring-2 focus:ring-rosa-400/20 text-black bg-white/50"
                    placeholder="Ej: 5491144556677"
                  />
                  <p className="text-xs text-gray-400 mt-1">Solo dígitos, entre 7 y 15 caracteres</p>
                </div>

                {/* Bio / Interés (Opcional) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-1.5"><FileText size={14} /> ¿Qué te gustaría aprender? <span className="text-gray-400 font-normal">(Opcional)</span></span>
                  </label>
                  <textarea
                    name="bio"
                    rows={3}
                    maxLength={500}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rosa-400 focus:ring-2 focus:ring-rosa-400/20 text-black bg-white/50 resize-none"
                    placeholder="Ej: Busco aprender matemáticas para la universidad..."
                  />
                  <div className="flex justify-end mt-1">
                    <p className="text-xs text-gray-400">
                      {formData.bio.length}/500
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Error / Success Messages */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm font-medium border border-red-200 rounded-xl">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 text-green-600 text-sm font-medium border border-green-200 rounded-xl">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || (isProfesor && !formData.modalidad)}
              className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-900 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Guardando..." : (
                <span className="flex items-center justify-center gap-2">
                  <Rocket size={18} /> {isProfesor ? "Publicar mi perfil" : "Completar mi perfil"}
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
