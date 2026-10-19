export type IgmiClassification = "BOM" | "REGULAR" | "RUIM" | "N/A";

interface IgmiInfo {
  label: string;
  classification: IgmiClassification;
  color: string;
}

const IGMI_INFO: Record<number, IgmiInfo> = {
  2: { label: "Gestão Adequada", classification: "BOM", color: "#00a651" },
  1: {
    label: "Gestão em Aperfeiçoamento",
    classification: "REGULAR",
    color: "#e0a800",
  },
  0: { label: "Gestão Vulnerável", classification: "RUIM", color: "#dc2626" },
  [-1]: {
    label: "Sem dados suficientes",
    classification: "N/A",
    color: "#9ca3af",
  },
};

export function getIgmiInfo(classificacaoIgmi: number): IgmiInfo {
  return IGMI_INFO[classificacaoIgmi] ?? IGMI_INFO[-1];
}
