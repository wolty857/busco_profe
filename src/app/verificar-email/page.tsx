"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const error = searchParams.get("error");
  const token = searchParams.get("token");

  useEffect(() => {
    if (token && !success && !error) {
      // Redirigir a la API para que procese el token y nos devuelva
      window.location.href = `/api/verify-email?token=${token}`;
    }
  }, [token, success, error]);

  return (
    <div className="w-full max-w-md mx-4 animate-fade-in text-center">
      <Link href="/" className="inline-block mb-8 group">
        <Image
          src="/images/Logo-BuscoProfe2.svg"
          alt="Busco Profe"
          width={80}
          height={80}
          className="rounded-2xl shadow-lg shadow-rosa-400/10 transition-transform hover:scale-105 mx-auto"
          priority
        />
      </Link>

      <div className="glass rounded-2xl p-8 shadow-xl shadow-rosa-400/5">
        {success ? (
          <div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Cuenta Verificada!</h2>
            <p className="text-gray-600 mb-6">Tu correo ha sido verificado exitosamente. Ya puedes iniciar sesión.</p>
            <Link
              href="/login"
              className="inline-block w-full px-4 py-3 bg-rosa-400 text-white rounded-xl font-bold hover:bg-rosa-500 transition-colors shadow-md shadow-rosa-400/20"
            >
              Ir a Iniciar Sesión
            </Link>
          </div>
        ) : error ? (
          <div>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ocurrió un error</h2>
            <p className="text-gray-600 mb-6">
              {error === "expired_token" && "El enlace de verificación ha expirado."}
              {error === "invalid_token" && "El enlace de verificación no es válido."}
              {error === "missing_token" && "Falta el token de verificación."}
              {error === "user_not_found" && "No se encontró el usuario asociado a este enlace."}
              {error === "server_error" && "Error interno del servidor. Intenta de nuevo más tarde."}
            </p>
            <Link
              href="/reenviar-verificacion"
              className="inline-block w-full px-4 py-3 bg-white text-rosa-500 border-2 border-rosa-400 rounded-xl font-bold hover:bg-rosa-50 transition-colors"
            >
              Solicitar nuevo enlace
            </Link>
          </div>
        ) : token ? (
          <div>
            <div className="w-16 h-16 border-4 border-rosa-100 border-t-rosa-400 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificando...</h2>
            <p className="text-gray-600">Espera un momento mientras validamos tu enlace.</p>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Revisa tu correo</h2>
            <p className="text-gray-600 mb-6">Hemos enviado un enlace de verificación. Haz clic en él para activar tu cuenta.</p>
            <Link
              href="/login"
              className="inline-block w-full px-4 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              Volver al Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-rosa-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rosa-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <Suspense fallback={<div className="w-16 h-16 border-4 border-rosa-100 border-t-rosa-400 rounded-full animate-spin mx-auto"></div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
