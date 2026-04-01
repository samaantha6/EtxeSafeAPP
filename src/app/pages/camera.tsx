import { useState } from "react";
import { useNavigate } from "react-router";
import { X, Zap, ZapOff, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { useLocation } from "react-router";
import { useClaims } from "../../context/ClaimsContext";


export default function Camera() {
  const navigate = useNavigate();
  const [flashOn, setFlashOn] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { state } = useLocation();
  const { addClaim } = useClaims(); 

  const handleCapture = () => {
    // Simulate photo capture with a placeholder
    const placeholderPhoto = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='16' fill='%23374151'%3E¡Foto Hecha!%3C/text%3E%3C/svg%3E";
    setPhoto(placeholderPhoto);
    setShowPreview(true);
  };

  const handleRetake = () => {
    setPhoto(null);
    setShowPreview(false);
  };

  const handleSubmit = () => {
    const newClaim = {
      id: `PA-2026-${Math.floor(Math.random() * 1000)}`,
      type: state.category,
      status: "Pendiente" as const,
      date: new Date().toLocaleDateString(),
      description: state.description,
      size: Number(state.size), 
      hasCrack: state.hasCrack,
      isBroken: state.isBroken,
      material: state.material
    };
    
    addClaim(newClaim);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Camera Viewfinder */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900">
        {showPreview && photo ? (
          <img src={photo} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto border-4 border-white/50 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full" />
              </div>
              <p className="text-white/70">Apunta a la zona dañada</p>
            </div>
          </div>
        )}
      </div>

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
        <button
          onClick={() => navigate("/incident-report")}
          className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <button
          onClick={() => setFlashOn(!flashOn)}
          className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
            flashOn ? "bg-primary" : "bg-black/50 hover:bg-black/70"
          }`}
          aria-label="Toggle flash"
        >
          {flashOn ? <Zap className="w-6 h-6" /> : <ZapOff className="w-6 h-6" />}
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
        {showPreview ? (
          /* Preview Mode Controls */
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleRetake}
                className="flex-1 h-14 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                Reintentar
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 h-14 bg-primary hover:bg-primary/90"
              >
                <Check className="w-5 h-5 mr-2" />
                Enviar
              </Button>
            </div>
          </div>
        ) : (
          /* Capture Mode Controls */
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center gap-8">
              {/* Preview Thumbnail */}
              <div className="w-16 h-16 bg-white/10 rounded-xl border-2 border-white/30 backdrop-blur-sm overflow-hidden">
                {photo && (
                  <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                )}
              </div>

              {/* Shutter Button */}
              <button
                onClick={handleCapture}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform"
                aria-label="Capture photo"
              >
                <div className="w-16 h-16 bg-white border-4 border-black rounded-full" />
              </button>

              {/* Spacer for symmetry */}
              <div className="w-16 h-16" />
            </div>

            <p className="text-center text-white/70 text-sm mt-6">
              Pulsa para sacar la foto
            </p>
          </div>
        )}
      </div>

      {/* Guide Overlay */}
      {!showPreview && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="w-full h-full border-2 border-white/30 m-auto" style={{ maxWidth: "80%", maxHeight: "60%", marginTop: "10%" }}>
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary" />
          </div>
        </div>
      )}
    </div>
  );
}
