export interface DashboardStatusRange {
  status: string;
  total: number;
}

export interface DashboardOrganizationIRM {
  organization_id: string;
  name: string;
  qtd_bom: number;
  qtd_regular: number;
  qtd_ruim: number;
  total_imoveis: number;
  irm: number;
  classificacao_igmi: number;
}

export interface DashboardData {
  ranges: DashboardStatusRange[];
  properties: { total: number };
  inspected: { total: number };
  checklists: { total: number };
  igm: DashboardOrganizationIRM[];
}
