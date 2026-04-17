import { useState } from "react";
import { useNavigate } from "react-router";
import { 
  Power, 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  Filter, 
  X,
  LayoutDashboard,
  List as ListIcon,
  Wallet,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useClaims } from "../../context/ClaimsContext";
import { getPricePerCm2 } from "../../utils/pricing";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Resuelto": return "bg-green-100 text-green-700 border-green-200";
    case "Pendiente": return "bg-red-100 text-red-700 border-red-200";
    case "En revisión": return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Resuelto": return <CheckCircle className="w-4 h-4" />;
    case "Pendiente": return <Clock className="w-4 h-4" />;
    case "En revisión": return <FileText className="w-4 h-4" />;
    default: return null;
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { claims, updateClaim } = useClaims();

  // Estados
  const [activeTab, setActiveTab] = useState<"lista" | "stats">("lista");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Todo");
  const [categoryFilter, setCategoryFilter] = useState("Todo");

  const handleClaimClick = (e: React.MouseEvent, claim: any) => {
    e.stopPropagation(); 
    if (claim.amount) return;
    setLoadingId(claim.id);

    setTimeout(() => {
      const size = Number(claim.size);
      const pricePerCm2 = getPricePerCm2(claim.type);
      const calculated = size * pricePerCm2;
      const variation = 0.9 + Math.random() * 0.2;
      const finalPrice = calculated * variation;
      updateClaim(claim.id, { amount: `${finalPrice.toFixed(2)} €` });
      setLoadingId(null);
    }, 1500);
  };

  const filteredClaims = claims.filter((claim) => {
    const statusMatch = statusFilter === "Todo" || claim.status === statusFilter;
    const categoryMatch = categoryFilter === "Todo" || claim.type === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const resetFilters = () => {
    setStatusFilter("Todo");
    setCategoryFilter("Todo");
  };

  // --- Lógica de Estadísticas ---
  const totalClaims = claims.length;
  const resueltas = claims.filter(c => c.status === "Resuelto").length;
  const pendientes = claims.filter(c => c.status === "Pendiente").length;
  const revision = claims.filter(c => c.status === "En revisión").length;

  const dineroTotal = claims.reduce((acc, c) => {
    if (!c.amount) return acc;

    const limpio = c.amount.replace(",", ".").replace(/[^0-9.]/g, "");
    const precio = parseFloat(limpio);
    
    return acc + (isNaN(precio) ? 0 : precio);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 pb-12 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => navigate("/")} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Power className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              {activeTab === "lista" ? "Mis Incidencias" : "Estadísticas"}
            </h1>
            <p className="text-xs text-primary-foreground/70">
              {activeTab === "lista" ? `${filteredClaims.length} resultados` : "Cuadro de mando general"}
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab(activeTab === "lista" ? "stats" : "lista");
              setShowFilters(false);
            }}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
          >
            {activeTab === "lista" ? <LayoutDashboard className="w-6 h-6" /> : <ListIcon className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-6">
        {activeTab === "lista" ? (
          <>
            {/* Filtro flotante solo en modo lista */}
            <div className="flex justify-end -mt-5 mb-4 relative z-20">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-2xl shadow-lg transition-all ${showFilters ? "bg-slate-800 text-white" : "bg-white text-primary"}`}
              >
                {showFilters ? <X className="w-6 h-6" /> : <Filter className="w-6 h-6" />}
              </button>
            </div>

            {showFilters && (
              <Card className="shadow-xl border-none mb-6 animate-in slide-in-from-top-4 duration-300">
                <CardContent className="p-5 space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700">Estado</label>
                    <div className="flex flex-wrap gap-2">
                      {["Todo", "Pendiente", "En revisión", "Resuelto"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatusFilter(s)}
                          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                            statusFilter === s ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700">Categoría</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Todo", "Vitrocerámica", "Cristalería", "Espejo", "Mampara", "Sanitario", "Encimera", "Otros"].map((c) => (
                        <button
                          key={c}
                          onClick={() => setCategoryFilter(c)}
                          className={`px-3 py-2 rounded-lg text-left text-xs transition-all border ${
                            categoryFilter === c ? "border-primary bg-primary/5 text-primary font-bold" : "border-slate-100 text-slate-500"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setShowFilters(false)} className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-bold">
                    Aplicar Filtros
                  </button>
                </CardContent>
              </Card>
            )}

            {/* Listado */}
            <div className="space-y-4">
              {filteredClaims.length > 0 ? (
                filteredClaims.map((claim) => (
                  <Card 
                    key={claim.id} 
                    className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer bg-white" 
                    onClick={() => navigate(`/claim/${claim.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-800 text-lg leading-tight">{claim.type}</h3>
                          <p className="text-[10px] font-mono text-slate-400">REF: {claim.id.slice(0, 8)}</p>
                        </div>
                        <Badge variant="outline" className={`${getStatusColor(claim.status)} border-none py-1 px-3 rounded-lg font-bold shadow-sm`}>
                          <span className="flex items-center gap-1.5 text-[11px]">{getStatusIcon(claim.status)} {claim.status}</span>
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Fecha</span>
                          <span className="text-sm font-medium text-slate-600">{claim.date}</span>
                        </div>
                        <div className="text-right">
                          {claim.amount ? (
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400 uppercase font-bold">Importe</span>
                              <span className="text-lg font-black text-primary">{claim.amount}</span>
                            </div>
                          ) : loadingId === claim.id ? (
                            <span className="text-orange-500 font-bold text-sm animate-pulse">Calculando...</span>
                          ) : (
                            <button 
                              onClick={(e) => handleClaimClick(e, claim)}
                              className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                              💸 Calcular
                            </button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-20">
                  <p className="text-slate-400">No hay incidencias que coincidan</p>
                  <button onClick={resetFilters} className="text-primary underline text-sm mt-2">Limpiar filtros</button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* --- VISTA DE CUADRO DE MANDO --- */
          <div className="space-y-4 -mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Wallet className="w-20 h-20" />
              </div>
              <CardContent className="p-6">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Indemnizado</p>
                <h2 className="text-4xl font-black mt-1">{dineroTotal.toFixed(2)}€</h2>
                <div className="flex gap-4 mt-4 text-[10px] font-bold uppercase">
                   <span className="flex items-center gap-1 text-green-400">
                     <CheckCircle2 className="w-3 h-3" /> {resueltas} Resueltas
                   </span>
                   <span className="flex items-center gap-1 text-orange-400">
                     <Clock className="w-3 h-3" /> {pendientes + revision} Pendientes
                   </span>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-2xl shadow-sm text-center border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Reportes</p>
                <p className="text-xl font-black text-slate-800">{totalClaims}</p>
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-sm text-center border border-slate-100">
                <p className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Efectividad</p>
                <p className="text-xl font-black text-green-600">{totalClaims > 0 ? ((resueltas/totalClaims)*100).toFixed(0) : 0}%</p>
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-sm text-center border border-slate-100">
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter">En curso</p>
                <p className="text-xl font-black text-orange-600">{revision}</p>
              </div>
            </div>

            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary rounded-full"></div>
                  Frecuencia por Categoría
                </h3>
                <div className="space-y-4">
                  {["Vitrocerámica", "Cristalería", "Espejo", "Mampara", "Sanitario", "Encimera", "Otros"].map((cat) => {
                    const count = claims.filter(c => c.type === cat).length;
                    const porcentaje = totalClaims > 0 ? (count / totalClaims) * 100 : 0;
                    if (count === 0) return null;

                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-xs mb-1 font-semibold text-slate-600">
                          <span>{cat}</span>
                          <span className="text-slate-400">{count}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${porcentaje}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* FAB: Solo visible en lista */}
      {activeTab === "lista" && (
        <button 
          onClick={() => navigate("/incident-report")} 
          className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-white rounded-2xl shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40"
        >
          <Plus className="w-8 h-8" />
        </button>
      )}
    </div>
  );
}