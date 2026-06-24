"use client";
import { BookOpen, DollarSign, MapPin, Monitor, RefreshCcw, MessageCircle } from "lucide-react";

interface ClassesSectionProps {
  profile: any;
}

export default function ClassesSection({ profile }: ClassesSectionProps) {
  return (
    <div className="space-y-6">
      {/* Anuncio Activo */}
      {profile && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-black">Tu anuncio activo</h3>
            <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Publicado
            </span>
          </div>

          <div className="p-6">
            <div className="flex items-start gap-5 p-5 bg-gradient-to-r from-rosa-50/50 to-white rounded-2xl border border-rosa-100/50">
              <div className="w-14 h-14 rounded-2xl bg-rosa-100 flex items-center justify-center text-2xl flex-shrink-0">
                <BookOpen size={28} className="text-rosa-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-black text-lg">{profile.materia}</h4>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{profile.bio}</p>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="bg-white px-3 py-1 rounded-lg text-xs font-semibold text-gray-600 border border-gray-100 flex items-center">
                    <DollarSign size={14} className="mr-1" /> ${profile.precio_hora}/hr
                  </span>
                  <span className="bg-white px-3 py-1 rounded-lg text-xs font-semibold text-gray-600 border border-gray-100 capitalize flex items-center">
                    {profile.modalidad === "presencial" ? <MapPin size={14} className="mr-1" /> : profile.modalidad === "virtual" ? <Monitor size={14} className="mr-1" /> : <RefreshCcw size={14} className="mr-1" />} {profile.modalidad}
                  </span>
                  {profile.telefono && (
                    <span className="bg-white px-3 py-1 rounded-lg text-xs font-semibold text-gray-600 border border-gray-100 flex items-center">
                      <MessageCircle size={14} className="mr-1" /> WhatsApp activo
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Próximas funcionalidades */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h3 className="font-bold text-black mb-4">Gestión de clases</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: "📅", title: "Agenda de clases", desc: "Organiza tu calendario de clases con tus alumnos" },
            { icon: "📊", title: "Estadísticas", desc: "Visualiza tus métricas de contacto y conversiones" },
            { icon: "🏷️", title: "Multi-materia", desc: "Publica anuncios en más de una materia" },
            { icon: "⭐", title: "Destacar anuncio", desc: "Posiciona tu perfil en las primeras búsquedas" },
          ].map((item) => (
            <div key={item.title} className="p-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <span className="text-2xl block mb-2">{item.icon}</span>
              <p className="font-bold text-black text-sm">{item.title}</p>
              <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
              <span className="inline-block mt-3 text-xs font-bold text-rosa-400 bg-rosa-50 px-2 py-0.5 rounded-md">Próximamente</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
