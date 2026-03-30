import { createContext, useContext, useState } from "react";

export interface Claim {
  id: string;
  type: string;
  status: "pendiente" | "en revisión" | "resuelto";
  date: string;
  amount?: string;
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
      status: "pendiente",
      date: "12/03/2026",
      amount: "210,00 €",
    },
    {
      id: "PA-2026-002",
      type: "Cristalería",
      status: "en revisión",
      date: "11/03/2026",
      amount: "155,50 €",
    },
    {
      id: "PA-2026-003",
      type: "Mampara",
      status: "resuelto",
      date: "10/03/2026",
      amount: "380,00 €",
    },
    {
      id: "PA-2026-004",
      type: "Espejo",
      status: "en revisión",
      date: "09/03/2026",
      amount: "85,00 €",
    },
    {
      id: "PA-2026-005",
      type: "Loza Sanitaria",
      status: "pendiente",
      date: "08/03/2026",
      amount: "120,00 €",
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
              ? { ...claim, status: "en revisión" }
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