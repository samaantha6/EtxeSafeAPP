import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useClaims } from "../../context/ClaimsContext";

export default function ClaimDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { claims } = useClaims();

  const claim = claims.find((c) => c.id === id);

  if (!claim) {
    return <div className="p-6">Incidencia no encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-6 flex items-center gap-4">
        <button onClick={() => navigate("/dashboard")}>
          <ArrowLeft />
        </button>
        <h1 className="text-xl">Detalle Incidencia</h1>
      </div>

      {/* Contenido */}
      <div className="max-w-md mx-auto p-6 space-y-6">

        {/* FOTO NEGRA */}
        <div className="w-full h-48 bg-black rounded-xl flex items-center justify-center text-white">
          Foto del incidente
        </div>

        {/* INFO */}
        <div className="bg-card p-4 rounded-xl shadow space-y-2">
          <p><strong>ID:</strong> {claim.id}</p>
          <p><strong>Tipo:</strong> {claim.type}</p>
          <p><strong>Estado:</strong> {claim.status}</p>
          <p><strong>Fecha:</strong> {claim.date}</p>
          <p><strong>Importe:</strong> {claim.amount || "Pendiente"}</p>
          <p><strong>Tamaño:</strong> {claim.size} cm²</p>
          <p><strong>Descripción:</strong> {claim.description} </p>
          
          {claim.isBroken && (<p><strong>¿Roto completamente?:</strong> {claim.isBroken}</p>)}
          {claim.hasCrack && (<p><strong>¿Tiene grietas?:</strong> {claim.hasCrack}</p>)}
          {claim.material && (<p><strong>Material:</strong> {claim.material}</p>)}
        </div>

      </div>
    </div>
  );
}