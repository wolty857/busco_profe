"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function RegistroPage() {
  const router = useRouter();
  const { isLoading, error, success, setLoading, setError, setSuccess, clearMessages } =
    useAuthStore();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: elegir rol, 2: formulario

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    clearMessages();
  };

  const selectRole = (rol: string) => {
    setFormData({ ...formData, rol });
    setStep(2);
    clearMessages();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setSuccess("¡Cuenta creada exitosamente! Iniciando sesión...");

      // Auto-login tras registro
      setTimeout(async () => {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.ok) {
          if (formData.rol === "profesor") {
            router.push("/completar-perfil");
          } else {
            router.push("/");
          }
          router.refresh();
        }
      }, 1000);
    } catch {
      setError("Error al crear la cuenta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Decoraciones de fondo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-rosa-400/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-rosa-400/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-rosa-400/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md mx-4 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <h1 className="text-4xl font-extrabold text-black tracking-tight">
              ¡¡Busco{" "}
              <span className="text-rosa-400 group-hover:text-rosa-500 transition-colors">
                Profe
              </span>
              !!
            </h1>
          </Link>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            {step === 1 ? "¿Cómo quieres usar la plataforma?" : "Crea tu cuenta gratuita"}
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-xl shadow-rosa-400/5">
          {/* PASO 1: Selección de rol */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <button
                id="rol-alumno"
                onClick={() => selectRole("alumno")}
                className="w-full p-5 rounded-xl border-2 border-gray-100 hover:border-rosa-400 transition-all duration-300 text-left group hover:shadow-lg hover:shadow-rosa-400/5 active:scale-[0.98]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-rosa-50 rounded-xl flex items-center justify-center group-hover:bg-rosa-100 transition-colors flex-shrink-0">
                    <svg className="w-7 h-7 text-rosa-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-black text-lg">Soy Alumno</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Busco un profesor particular para aprender algo nuevo
                    </p>
                  </div>
                </div>
              </button>

              <button
                id="rol-profesor"
                onClick={() => selectRole("profesor")}
                className="w-full p-5 rounded-xl border-2 border-gray-100 hover:border-rosa-400 transition-all duration-300 text-left group hover:shadow-lg hover:shadow-rosa-400/5 active:scale-[0.98]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-rosa-50 rounded-xl flex items-center justify-center group-hover:bg-rosa-100 transition-colors flex-shrink-0">
                    <svg className="w-7 h-7 text-rosa-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-black text-lg">Soy Profesor</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Quiero ofrecer mis clases y llegar a más alumnos
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* PASO 2: Formulario de registro */}
          {step === 2 && (
            <div className="animate-fade-in">
              {/* Badge del rol seleccionado */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-rosa-50 text-rosa-500 text-xs font-bold rounded-full uppercase tracking-wide">
                    {formData.rol === "alumno" ? "👨‍🎓 Alumno" : "👨‍🏫 Profesor"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-400 hover:text-rosa-400 transition-colors font-medium"
                >
                  Cambiar
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
                <div>
                  <label
                    htmlFor="registro-nombre"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Nombre completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <input
                      id="registro-nombre"
                      name="nombre"
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rosa-400 focus:ring-2 focus:ring-rosa-400/20 transition-all duration-200 text-black placeholder:text-gray-400 bg-white/50"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="registro-email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <input
                      id="registro-email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rosa-400 focus:ring-2 focus:ring-rosa-400/20 transition-all duration-200 text-black placeholder:text-gray-400 bg-white/50"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="registro-password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    <input
                      id="registro-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-rosa-400 focus:ring-2 focus:ring-rosa-400/20 transition-all duration-200 text-black placeholder:text-gray-400 bg-white/50"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-rosa-400 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="registro-confirm"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <input
                      id="registro-confirm"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rosa-400 focus:ring-2 focus:ring-rosa-400/20 transition-all duration-200 text-black placeholder:text-gray-400 bg-white/50"
                      placeholder="Repite tu contraseña"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl animate-slide-down">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <span className="text-red-600 text-sm font-medium">{error}</span>
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl animate-slide-down">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-600 text-sm font-medium">{success}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  id="registro-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-black text-white font-semibold rounded-xl hover:bg-gray-900 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className={`${isLoading ? "opacity-0" : "opacity-100"} transition-opacity`}>
                    Crear cuenta
                  </span>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-rosa-400/0 via-rosa-400/10 to-rosa-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>
              </form>
            </div>
          )}

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/login"
                className="text-rosa-400 hover:text-rosa-500 font-semibold transition-colors"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Al registrarte aceptas nuestros{" "}
          <span className="text-rosa-400 cursor-pointer hover:underline">Términos</span>
          {" "}y{" "}
          <span className="text-rosa-400 cursor-pointer hover:underline">Privacidad</span>
        </p>
      </div>
    </div>
  );
}
