import { useNavigate } from "react-router";
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

interface Claim {
  id: string;
  type: string;
  status: "pendiente" | "en revisión" | "resuelto";
  date: string;
  amount?: string;
}

const mockClaims: Claim[] = [
  {
    id: "PA-2026-001",
    type: "Vitrocerámica",
    status: "pendiente",
    date: "12/03/2026",
    amount: "210,00 €"
  },
  {
    id: "PA-2026-002",
    type: "Cristalería",
    status: "en revisión",
    date: "11/03/2026",
    amount: "155,50 €"
  },
  {
    id: "PA-2026-003",
    type: "Mampara",
    status: "resuelto",
    date: "10/03/2026",
    amount: "380,00 €"
  },
  {
    id: "PA-2026-004",
    type: "Espejo",
    status: "en revisión",
    date: "09/03/2026",
    amount: "85,00 €"
  },
  {
    id: "PA-2026-005",
    type: "Loza Sanitaria",
    status: "pendiente",
    date: "08/03/2026",
    amount: "120,00 €"
  }
];

const getStatusColor = (status: Claim["status"]) => {
  switch (status) {
    case "resuelto":
      return "bg-green-100 text-green-700 border-green-200";
    case "pendiente":
      return "bg-red-100 text-red-700 border-red-200";
    case "en revisión":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }
};

const getStatusIcon = (status: Claim["status"]) => {
  switch (status) {
    case "resuelto":
      return <CheckCircle className="w-4 h-4" />;
    case "pendiente":
      return <Clock className="w-4 h-4" />;
    case "en revisión":
      return <FileText className="w-4 h-4" />;
  }
};

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 pb-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl mb-1">Mis Incidencias</h1>
          <p className="text-primary-foreground/80">Consulta tus incidencias</p>
        </div>
      </div>

      {/* Claims List */}
      <div className="max-w-md mx-auto px-6 -mt-4">
        <div className="space-y-4">
          {mockClaims.map((claim) => (
            <Card key={claim.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-base mb-1">{claim.type}</h3>
                    <p className="text-sm text-muted-foreground">{claim.id}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(claim.status)} flex items-center gap-1`}
                  >
                    {getStatusIcon(claim.status)}
                    <span className="capitalize">{claim.status.replace("-", " ")}</span>
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{claim.date}</span>
                  {claim.amount && (
                    <span className="font-medium">{claim.amount}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate("/incident-report")}
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        aria-label="Nueva Incidencia"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}