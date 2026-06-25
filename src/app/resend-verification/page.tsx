"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ocurrió un error.");
        return;
      }

      setMessage(data.message || "Enlace enviado exitosamente.");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-rosa-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rosa-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="w-full max-w-md mx-4 animate-fade-in">
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="group mb-2">
            <Image
              src="/images/Logo-BuscoProfe2.svg"
              alt="Busco Profe"
              width={80}
              height={80}
              className="rounded-2xl shadow-lg shadow-rosa-400/10 transition-transform hover:scale-105"
              priority
            />
          </Link>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            Reenviar correo de activación
          </p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-xl shadow-rosa-400/5">
          {message ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Correo Enviado!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link
                href="/login"
                className="inline-block w-full px-4 py-3 bg-rosa-400 text-white rounded-xl font-bold hover:bg-rosa-500 transition-colors shadow-md shadow-rosa-400/20"
              >
                Volver a Iniciar Sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rosa-400 focus:ring-2 focus:ring-rosa-400/20 transition-all text-black placeholder:text-gray-400"
                  placeholder="Tu email registrado"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-rosa-400 text-white rounded-xl font-bold hover:bg-rosa-500 transition-colors shadow-md shadow-rosa-400/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Enviar Enlace"
                )}
              </button>
              
              <div className="text-center mt-6">
                <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-rosa-400 transition-colors">
                  Volver al login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
