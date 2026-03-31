export const getPricePerCm2 = (type: string) => {
  const normalized = type.trim().toLowerCase();

  switch (normalized) {
    case "vitroceramica": return 10.5;
    case "cristaleria": return 12.8;
    case "espejos": return 8.2;
    case "mamparas": return 15.4;
    case "sanitarios": return 14.6;
    case "encimeras": return 25;
    case "mobiliario": return 18.2;
    default: return 8.5;
  }
};