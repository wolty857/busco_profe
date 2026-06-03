import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function TeacherProfilePage({ params }: { params: { id: string } }) {
  const teacherId = parseInt(params.id);

  if (isNaN(teacherId)) {
    return notFound();
  }

  const teacher = await prisma.user.findUnique({
    where: { id: teacherId, rol: "profesor" },
    include: {
      teacherProfile: true,
      reviewsReceived: {
        include: { alumno: true },
        orderBy: { createdAt: "desc" }
      },
    },
  });

  if (!teacher || !teacher.teacherProfile) {
    return notFound();
  }

  const profile = teacher.teacherProfile;
  const reviews = teacher.reviewsReceived;
  const avgRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.estrellas, 0) / reviews.length 
    : 0;
  
  const titulos = profile.titulos ? JSON.parse(profile.titulos as string) : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Navbar Minimalista */}
      <nav className="glass border-b border-gray-100/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl text-black">
            <Image
              src="/images/Logo-BuscoProfe2.svg"
              alt="Busco Profe"
              width={38}
              height={38}
              className="rounded-lg"
            />
            Busco <span className="text-rosa-400">Profe</span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-black">
            ← Volver al inicio
          </Link>
        </div>
      </nav>

      {/* Header Profile */}
      <div className="bg-white border-b border-gray-200 pt-10 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rosa-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
          
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-rosa-50 border-4 border-white shadow-xl shadow-rosa-400/10 flex-shrink-0 overflow-hidden relative">
            {profile.foto ? (
              <Image src={profile.foto} alt={teacher.nombre} fill className="object-cover" sizes="(max-width: 768px) 128px, 160px" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-rosa-300 font-bold bg-gradient-to-br from-rosa-50 to-rosa-100">
                {teacher.nombre.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info Básica */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-black">{teacher.nombre}</h1>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Verificado
              </span>
            </div>
            
            <p className="text-lg md:text-xl text-gray-500 font-medium mb-4">
              Profesor de <span className="text-rosa-500 font-bold">{profile.materia}</span>
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-600">
              <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-xl">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="text-black">{avgRating.toFixed(1)}</span>
                <span className="text-gray-400 font-medium">({reviews.length} reseñas)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-xl">
                <span className="text-xl">💰</span>
                <span className="text-black">${profile.precio_hora}/hr</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-xl">
                <span className="text-xl">{profile.modalidad === 'presencial' ? '🏫' : profile.modalidad === 'virtual' ? '💻' : '🔄'}</span>
                <span className="capitalize text-black">{profile.modalidad}</span>
              </div>
            </div>
          </div>

          {/* CTA WhatsApp Fijo Desktop */}
          <div className="hidden md:block">
            <a 
              href={`https://wa.me/${profile.telefono}?text=Hola%20${teacher.nombre},%20vi%20tu%20perfil%20en%20Busco%20Profe%20y%20me%20gustaría%20tomar%20clases%20de%20${profile.materia}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#20bd5a] active:scale-95 transition-all duration-200 shadow-xl shadow-[#25D366]/20"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Contactar por WhatsApp
            </a>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-2 space-y-10">
          
          {/* Biografía */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-black mb-4">Sobre mí</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {profile.bio}
            </p>
          </section>

          {/* Video de Presentación (si existe) */}
          {profile.video_url && (
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-black mb-4">Video de presentación</h2>
              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden relative">
                <video 
                  src={profile.video_url} 
                  controls 
                  className="w-full h-full object-cover"
                  poster={profile.foto || ""}
                />
              </div>
            </section>
          )}

          {/* Reseñas */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-black mb-6">Reseñas ({reviews.length})</h2>
            
            {reviews.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                <span className="text-4xl mb-3 block">⭐</span>
                <p className="text-gray-500 font-medium">Aún no hay reseñas para este profesor.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-black">{review.alumno.nombre}</div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.estrellas ? "text-yellow-400" : "text-gray-200"}>★</span>
                        ))}
                      </div>
                    </div>
                    {review.comentario && (
                      <p className="text-gray-600 text-sm mt-2">{review.comentario}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-3">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Títulos / Certificados */}
          {titulos.length > 0 && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-black mb-4 flex items-center gap-2">
                <span>🎓</span> Títulos y Certificados
              </h3>
              <div className="space-y-3">
                {titulos.map((titulo: any, idx: number) => (
                  <a 
                    key={idx}
                    href={titulo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-rosa-50 hover:text-rosa-500 rounded-xl transition-colors text-sm font-semibold text-gray-600 border border-gray-100 group"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-rosa-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    {titulo.name || `Certificado ${idx + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Garantía */}
          <div className="bg-gradient-to-br from-rosa-400 to-rosa-500 p-6 rounded-3xl text-white shadow-lg shadow-rosa-400/20">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <span>🛡️</span> Garantía Busco Profe
            </h3>
            <p className="text-rosa-50 text-sm leading-relaxed">
              Profesores verificados. Si la primera clase no cumple tus expectativas, te ayudamos a encontrar otro profesor.
            </p>
          </div>

        </div>

      </div>

      {/* CTA WhatsApp Fijo Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-50">
        <a 
          href={`https://wa.me/${profile.telefono}?text=Hola%20${teacher.nombre},%20vi%20tu%20perfil%20en%20Busco%20Profe%20y%20me%20gustaría%20tomar%20clases%20de%20${profile.materia}.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] text-white font-bold rounded-xl active:scale-95 transition-transform shadow-lg shadow-[#25D366]/20"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          Contactar por WhatsApp
        </a>
      </div>

    </div>
  );
}
