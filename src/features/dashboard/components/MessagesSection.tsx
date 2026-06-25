"use client";

export default function MessagesSection() {
  // Placeholder — el módulo de mensajería real se implementará después
  const mockMessages = [
    { id: 1, name: "María López", message: "Hola profe, quería consultarte por clases de matemáticas para mi hijo.", time: "Hace 2 horas", unread: true },
    { id: 2, name: "Juan Pérez", message: "Perfecto, nos vemos el martes entonces. ¡Gracias!", time: "Ayer", unread: false },
    { id: 3, name: "Laura García", message: "¿Tenés disponibilidad los sábados a la mañana?", time: "Hace 3 días", unread: false },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-black">Conversaciones</h3>
          <span className="bg-rosa-50 text-rosa-500 px-3 py-1 rounded-full text-xs font-bold">
            {mockMessages.filter(m => m.unread).length} nuevos
          </span>
        </div>

        <div className="divide-y divide-gray-50">
          {mockMessages.map((msg) => (
            <button key={msg.id} className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors text-left">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                msg.unread ? "bg-rosa-400 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {msg.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-sm truncate ${msg.unread ? "font-bold text-black" : "font-semibold text-gray-700"}`}>
                    {msg.name}
                  </p>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{msg.time}</span>
                </div>
                <p className={`text-sm truncate ${msg.unread ? "text-gray-700" : "text-gray-400"}`}>
                  {msg.message}
                </p>
              </div>
              {msg.unread && (
                <div className="w-2.5 h-2.5 rounded-full bg-rosa-400 flex-shrink-0"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center py-6">
        <p className="text-gray-400 text-sm font-medium">
          💡 El sistema de mensajería en tiempo real se activará próximamente
        </p>
      </div>
    </div>
  );
}
