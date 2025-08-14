// Coloque esta interface em um arquivo de modelos (ex.: models/produto-firebase.model.ts)
export interface ProdutoFirebase {
  CODPRO?: string | number;
  DESCPRO?: string;
  PRVAPRO?: string | number;
  QTDPRO?: string | number;
  DETALHE?: string;
  [key: string]: any; // para captar variações inesperadas
}
