"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import ProfileSection from "@/components/dashboard/ProfileSection";
import MessagesSection from "@/components/dashboard/MessagesSection";
import ClassesSection from "@/components/dashboard/ClassesSection";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("perfil");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/teacher-profile");
        if (res.ok) {
          const data = await res.json();
          setUserData(data.user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated") fetchData();
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-rosa-400/30 border-t-rosa-400 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm font-medium">Cargando tu panel...</p>
        </div>
      </div>
    );
  }

  const profile = userData?.teacherProfile;
  const reviews = userData?.reviewsReceived || [];
  const avgRating = reviews.length > 0
    ? (reviews.reduce((a: number, r: any) => a + r.estrellas, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={userData?.nombre}
        userImage={profile?.foto}
        userRole={userData?.rol}
      />

      <main className="flex-1 lg:ml-72">
        <div className="p-6 lg:p-10 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-black">
              {activeTab === "perfil" && "Mi Perfil"}
              {activeTab === "mensajes" && "Mis Mensajes"}
              {activeTab === "clases" && "Mis Clases"}
            </h1>
            <p className="text-gray-400 font-medium text-sm mt-1">
              {activeTab === "perfil" && "Administra tu información profesional"}
              {activeTab === "mensajes" && "Historial de conversaciones con alumnos"}
              {activeTab === "clases" && "Gestiona tus anuncios de clase"}
            </p>
          </div>

          {/* Stats Cards */}
          {activeTab === "perfil" && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Valoración", value: `${avgRating} ★`, color: "bg-yellow-50 text-yellow-600" },
                { label: "Reseñas", value: reviews.length, color: "bg-blue-50 text-blue-600" },
                { label: "Precio/hr", value: `$${profile?.precio_hora || 0}`, color: "bg-green-50 text-green-600" },
                { label: "Modalidad", value: profile?.modalidad || "—", color: "bg-rosa-50 text-rosa-500" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{s.label}</p>
                  <p className={`text-xl font-extrabold capitalize ${s.color.split(" ")[1]}`}>{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Content */}
          {activeTab === "perfil" && (
            <ProfileSection userData={userData} onUpdate={setUserData} />
          )}
          {activeTab === "mensajes" && <MessagesSection />}
          {activeTab === "clases" && (
            <ClassesSection profile={profile} />
          )}
        </div>
      </main>
    </div>
  );
}
