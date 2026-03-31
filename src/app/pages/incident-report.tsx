import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useClaims } from "../../context/ClaimsContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function IncidentReport() {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const { addClaim } = useClaims();

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!category) {
    alert("Por favor, selecciona una categoría");
    return;
  }

  const newClaim = {
    id: `PA-2026-${Math.floor(Math.random() * 1000)}`,
    type: category,
    status: "Pendiente" as const,
    date: new Date().toLocaleDateString(),
    description,
  };

  addClaim(newClaim);

  navigate("/camera");
};

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button
            type="button" 
            onClick={() => navigate("/dashboard")}
            className="hover:opacity-80 transition-opacity"
            aria-label="Volver"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl">Reportar Incidente</h1>
            <p className="text-sm text-primary-foreground/80">Paso 1 de 2</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto p-6">
        <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Categoría del Objeto */}
            <div className="space-y-2">
              <Label htmlFor="category">Tipo de Daño</Label>
              <Select 
                value={category} 
                onValueChange={(val) => setCategory(val)}
              >
                <SelectTrigger id="category" className="h-12 w-full">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent position="popper"> 
                  <SelectItem value="Vitroceramica">Vitrocerámica</SelectItem>
                  <SelectItem value="Cristaleria">Cristalería</SelectItem>
                  <SelectItem value="Espejos">Espejos</SelectItem>
                  <SelectItem value="Mamparas">Mamparas</SelectItem>
                  <SelectItem value="Sanitarios">Sanitarios</SelectItem>
                  <SelectItem value="Encimeras">Encimeras</SelectItem>
                  <SelectItem value="Mobiliario">Mobiliario Fijo</SelectItem>
                  <SelectItem value="Otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción de los daños</Label>
              <Textarea
                id="description"
                placeholder="Describe qué ha pasado..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Tamaño */}
            <div className="space-y-2">
              <Label htmlFor="size">Tamaño Daño Aprox. (cm²)</Label>
              <Input
                id="size"
                type="number"
                placeholder="Ej: 50"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
                className="h-12"
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full h-12 mt-4">
              <Camera className="w-5 h-5 mr-2" />
              Siguiente: Subir Foto
            </Button>
          </form>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-900">
            <strong>Consejo:</strong> Una descripción clara ayuda a resolver el parte antes.
          </p>
        </div>
      </div>
    </div>
  );
}