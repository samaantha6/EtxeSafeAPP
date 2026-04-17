import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Send } from "lucide-react";
import { useClaims } from "../../context/ClaimsContext";

export default function ClaimDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { claims, updateClaim } = useClaims();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const claim = claims.find((c) => c.id === id);

  // --- LÓGICA DEL CHAT PERSISTENTE ---
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Cargamos el historial del context o el mensaje inicial
  const messages = claim?.chatHistory || [
    { id: 1, text: `Hola, soy tu asistente. Estoy revisando tu incidencia de ${claim?.type}. ¿En qué puedo ayudarte?`, sender: "bot" }
  ];

  // Auto-scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !claim) return;

    const userMessage = { id: Date.now(), text: inputText, sender: "user" as const };
    const newHistory = [...messages, userMessage];
    
    // Guardar en Contexto
    updateClaim(claim.id, { chatHistory: newHistory });
    setInputText("");
    setIsTyping(true);

    // Respuesta Simulada
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(inputText, claim?.status),
        sender: "bot" as const
      };
      updateClaim(claim.id, { chatHistory: [...newHistory, botResponse] });
    }, 1000);
  };

  const getBotResponse = (text: string, status?: string) => {
    const t = text.toLowerCase();
    if (t.includes("pago") || t.includes("cuándo")) return "El pago se procesa tras la aprobación definitiva (24-48h).";
    if (t.includes("estado")) return `Tu incidencia está: ${status}.`;
    return "Recibido. Un agente revisará esto pronto.";
  };

  if (!claim) return <div className="p-6">Incidencia no encontrada</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header ORIGINAL */}
      <div className="bg-primary text-white p-6 flex items-center gap-4">
        <button onClick={() => navigate("/dashboard")}>
          <ArrowLeft />
        </button>
        <h1 className="text-xl">Detalle Incidencia</h1>
      </div>

      {/* Contenido SCROLLABLE */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-md mx-auto w-full">
        
        {/* FOTO NEGRA ORIGINAL */}
        <div className="w-full h-48 bg-black rounded-xl flex items-center justify-center text-white">
          Foto del incidente
        </div>

        {/* INFO ORIGINAL */}
        <div className="bg-card p-4 rounded-xl shadow space-y-2">
          <p><strong>ID:</strong> {claim.id}</p>
          <p><strong>Tipo:</strong> {claim.type === "Sanitario" ? "Loza Sanitaria" : claim.type}</p>
          <p><strong>Estado:</strong> {claim.status}</p>
          <p><strong>Fecha:</strong> {claim.date}</p>
          <p><strong>Importe:</strong> {claim.amount || "Pendiente"}</p>
          <p><strong>Tamaño:</strong> {claim.size} cm²</p>
          <p><strong>Descripción:</strong> {claim.description} </p>
          
          {claim.isBroken && (<p><strong>¿Roto completamente?:</strong> {claim.isBroken}</p>)}
          {claim.hasCrack && (<p><strong>¿Tiene grietas?:</strong> {claim.hasCrack}</p>)}
          {claim.material && (<p><strong>Material:</strong> {claim.material}</p>)}
        </div>

        {/* SECCIÓN CHAT (Ajustada a tu estilo) */}
        <div className="bg-card rounded-xl shadow overflow-hidden flex flex-col h-80 border border-slate-100">
          <div className="p-3 bg-slate-50 border-b text-xs font-bold text-slate-400 uppercase">
            Chat de Soporte
          </div>
          
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m: any) => (
              <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  m.sender === "user" 
                    ? "bg-primary text-white rounded-br-none" 
                    : "bg-slate-100 text-slate-700 rounded-bl-none"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-[10px] text-slate-400 animate-pulse">Bot escribiendo...</div>}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2 bg-white">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe aquí..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button type="submit" className="bg-primary text-white p-2 rounded-lg">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}