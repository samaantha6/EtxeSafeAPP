import { createContext, useContext, useState } from "react";

export interface Claim {
  id: string;
  type: string;
  status: "Pendiente" | "En revisión" | "Resuelto";
  date: string;
  amount?: string;
  description?: string;
  size?: number;

  hasCrack?: string;
  isBroken?: string;
  material?: string;
}

interface ClaimsContextType {
  claims: Claim[];
  addClaim: (claim: Claim) => void;
  updateClaim: (id: string, updated: Partial<Claim>) => void;
}

const ClaimsContext = createContext<ClaimsContextType | undefined>(undefined);

export function ClaimsProvider({ children }: { children: React.ReactNode }) {
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: "PA-2026-001",
      type: "Vitrocerámica",
      status: "Pendiente",
      date: "12/03/2026",
      amount: "210,00 €",
      description: "Vitrocerámica con varias grietas y zonas dañadas que impiden su correcto funcionamiento. Riesgo de uso y necesidad de sustitución.",
      size: 30,
      hasCrack: "Sí"

    },
    {
      id: "PA-2026-002",
      type: "Cristalería",
      status: "En revisión",
      date: "11/03/2026",
      amount: "155,50 €",
      description: "Cristal roto en ventana principal tras impacto. Se evalúa el alcance del daño y el tipo de vidrio necesario para la reposición.",
      size: 15,
      isBroken: "Sí"
    },
    {
      id: "PA-2026-003",
      type: "Mampara",
      status: "Resuelto",
      date: "10/03/2026",
      amount: "380,00 €",
      description: "Mampara de baño dañada con rotura parcial de uno de los paneles. Sustitución completa ya realizada.",
      size: 50

    },
    {
      id: "PA-2026-004",
      type: "Espejo",
      status: "En revisión",
      date: "09/03/2026",
      amount: "85,00 €",
      description: "Espejo con fisuras visibles en la superficie debido a un golpe. Se está valorando si reparar o reemplazar.",
      size: 10

    },
    {
      id: "PA-2026-005",
      type: "Loza Sanitaria",
      status: "Pendiente",
      date: "08/03/2026",
      amount: "120,00 €",
      description: "Loza sanitaria dañada con grietas en el inodoro. Se requiere revisión para determinar el tipo de reparación o sustitución.",
      size: 12

    },
  ]);

  
  const addClaim = (claim: Claim) => {
    setClaims((prev) => [claim, ...prev]);
  };

  const updateClaim = (id: string, updated: Partial<Claim>) => {
    setClaims((prev) =>
      prev.map((claim) =>
        claim.id === id ? { ...claim, ...updated } : claim
      )
    );

    if (updated.amount) {
      setTimeout(() => {
        setClaims((prev) =>
          prev.map((claim) =>
            claim.id === id && claim.amount
              ? { ...claim, status: "En revisión" }
              : claim
          )
        );
      }, 6000);
    }
  };

  return (
    <ClaimsContext.Provider value={{ claims, addClaim, updateClaim }}>
      {children}
    </ClaimsContext.Provider>
  );
}

export function useClaims() {
  const context = useContext(ClaimsContext);
  if (!context) {
    throw new Error("useClaims must be used inside ClaimsProvider");
  }
  return context;
}