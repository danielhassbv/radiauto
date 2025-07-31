export interface Produto {
  id?: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  imagem: string;
  marca: string;
  categoria: string;
  promocao: boolean;
  novidade: boolean;
  mostrarAcoes?: boolean; // campo opcional para resolver NG9
}