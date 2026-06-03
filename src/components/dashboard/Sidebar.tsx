"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userName: string;
  userImage: string | null;
  userRole: string;
}

const menuItems = [
  { id: "perfil", label: "Mi Perfil", icon: "👤" },
  { id: "mensajes", label: "Mis Mensajes", icon: "💬" },
  { id: "clases", label: "Mis Clases", icon: "📚" },
];

export default function DashboardSidebar({ activeTab, setActiveTab, userName, userImage, userRole }: SidebarProps) {
  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-100 fixed top-0 left-0 bottom-0 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-gray-50">
          <Link href="/" className="group flex items-center gap-2.5">
            <Image
              src="/images/Logo-BuscoProfe2.svg"
              alt="Busco Profe"
              width={38}
              height={38}
              className="rounded-lg"
            />
            <h1 className="text-xl font-extrabold text-black">
              Busco <span className="text-rosa-400">Profe</span>
            </h1>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-rosa-400 flex items-center justify-center text-white font-bold overflow-hidden relative flex-shrink-0">
              {userImage ? (
                <Image src={userImage} alt={userName} fill className="object-cover" sizes="48px" />
              ) : (
                <span className="text-lg">{userName?.charAt(0)?.toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-black text-sm truncate">{userName}</p>
              <p className="text-xs text-gray-400 capitalize">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-black text-white shadow-lg shadow-black/10"
                  : "text-gray-500 hover:text-black hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-50 space-y-1">
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">
            <span className="text-lg">🏠</span> Ir al inicio
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors text-left"
          >
            <span className="text-lg">🚪</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 flex items-center justify-around px-2 py-2 safe-area-bottom">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === item.id ? "text-rosa-500 bg-rosa-50" : "text-gray-400"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label.replace("Mis ", "")}
          </button>
        ))}
        <Link href="/" className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-gray-400">
          <span className="text-xl">🏠</span>
          Inicio
        </Link>
      </nav>
    </>
  );
}
