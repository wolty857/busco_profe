"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <Image
              src="/images/Logo-BuscoProfe2.svg"
              alt="Busco Profe"
              width={42}
              height={42}
              className="rounded-lg"
              priority
            />
            <h1 className="text-2xl font-extrabold text-black tracking-tight">
              Busco{" "}
              <span className="text-rosa-400 group-hover:text-rosa-500 transition-colors">
                Profe
              </span>
            </h1>
          </Link>

          <div className="flex items-center gap-3">
            {status === "loading" ? (
              <div className="w-6 h-6 border-2 border-rosa-400/30 border-t-rosa-400 rounded-full animate-spin"></div>
            ) : session?.user ? (
              <div className="flex items-center gap-4 relative">
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-rosa-50 text-rosa-600 hover:bg-rosa-100 rounded-xl font-bold text-sm transition-colors"
                >
                  Mi Panel
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-full bg-rosa-400 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm overflow-hidden relative transition-transform hover:scale-105 active:scale-95">
                      {session.user.image ? (
                        <Image src={session.user.image} alt={session.user.name || "Usuario"} fill className="object-cover" sizes="40px" />
                      ) : (
                        session.user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                  </button>

                  {/* Menú Desplegable */}
                  {isMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsMenuOpen(false)}
                      ></div>
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 z-50 overflow-hidden py-2 animate-fade-in">
                        <div className="px-4 py-3 border-b border-gray-50 mb-2">
                          <p className="font-bold text-black text-sm truncate">{session.user.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{(session.user as any).rol}</p>
                        </div>
                        <Link href="/mensajes" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors">
                          <span className="text-lg">💬</span> Mis Mensajes
                        </Link>
                        <Link href="/clases" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors">
                          <span className="text-lg">📚</span> Mis Clases
                        </Link>
                        <Link href={`/profesores/${(session.user as any).id}`} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors">
                          <span className="text-lg">👤</span> Mi perfil
                        </Link>
                        <div className="border-t border-gray-50 my-2"></div>
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors text-left"
                        >
                          <span className="text-lg">🚪</span> Cerrar Sesión
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-sm font-semibold text-black hover:text-rosa-400 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-black hover:bg-gray-900 rounded-xl transition-all duration-200 active:scale-95"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Decoraciones */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-rosa-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-rosa-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-40 left-1/2 w-40 h-40 bg-rosa-400/8 rounded-full blur-2xl animate-float"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rosa-50 rounded-full mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-rosa-400 rounded-full animate-pulse-soft"></span>
            <span className="text-rosa-500 font-semibold text-sm">
              +1.000 profesores disponibles
            </span>
          </div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-black tracking-tight leading-tight animate-slide-up">
            Encuentra al{" "}
            <span className="text-rosa-400 relative">
              profesor
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C50 2 150 2 198 8" stroke="#F88ACE" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
              </svg>
            </span>
            <br />
            perfecto para ti
          </h2>

          <p className="text-gray-500 text-lg sm:text-xl mt-6 max-w-2xl mx-auto leading-relaxed animate-slide-up font-medium">
            Conectamos alumnos con profesores particulares verificados.
            Clases presenciales y virtuales en cualquier materia.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-slide-up">
            <Link
              href="/registro"
              className="px-8 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-900 active:scale-95 transition-all duration-200 text-lg shadow-xl shadow-black/10 relative overflow-hidden group"
            >
              <span className="relative z-10">Comenzar ahora</span>
              <div className="absolute inset-0 bg-gradient-to-r from-rosa-400/0 via-rosa-400/20 to-rosa-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
            <Link
              href="/registro"
              className="px-8 py-4 text-black font-bold rounded-2xl border-2 border-gray-200 hover:border-rosa-400 hover:text-rosa-500 transition-all duration-200 text-lg"
            >
              Soy Profesor
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-16 mt-16 animate-fade-in">
            {[
              { number: "+1.000", label: "Profesores" },
              { number: "+50", label: "Materias" },
              { number: "4.8★", label: "Valoración" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-black">
                  {stat.number}
                </p>
                <p className="text-gray-400 text-sm font-medium mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer mínimo */}
      <footer className="py-8 border-t border-gray-100">
        <p className="text-center text-sm text-gray-400 font-medium">
          © 2024 Busco Profe — Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
}
