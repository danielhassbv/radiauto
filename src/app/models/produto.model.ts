export interface Produto {
    id?: string;
    nome: string;
    descricao: string;
    preco: number;
    imagem: string;
    marca: string;
    categoria: string;
    promocao: boolean;
    novidade: boolean;
    mostrarAcoes?: boolean; // novo campo para mobiles


}
