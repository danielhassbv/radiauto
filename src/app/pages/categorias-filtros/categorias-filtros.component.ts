import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias-filtros',
  templateUrl: './categorias-filtros.component.html',
  styleUrls: ['./categorias-filtros.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class CategoriasFiltrosComponent implements OnInit {
  produtos: Produto[] = [];
  categoriasFiltradas: string[] = [];
  categoriaDestaque = 'ARREFECIMENTO'; // Destaque fixo em maiúsculas

  // Categorias permitidas
  categoriasPermitidas = [
    'RADIADORES',
    'INTERCOOLER',
    'COLMEIA',
    'ADITIVOS',
    'VENTOINHA',
    'EMBREAGEM VISCOSA',
    'RESFRIADOR DE ÓLEO',
    'VÁLVULA TERMOESTÁTICA'
  ];

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe(produtos => {
      this.produtos = produtos;

      // Extrai categorias únicas em maiúsculas
      const categoriasUnicas = [
        ...new Set(
          produtos.map(p =>
            (p.categoria && p.categoria.trim())
              ? p.categoria.trim().toUpperCase()
              : 'OUTROS'
          )
        )
      ];

      // Filtra apenas as categorias permitidas
      this.categoriasFiltradas = categoriasUnicas.filter(c =>
        this.categoriasPermitidas.includes(c)
      );
    });
  }

  getImagemCategoria(categoria: string): string {
    if (!categoria) return 'assets/img/default-categoria.png';

    const imagens: { [key: string]: string } = {
      'ARREFECIMENTO': 'assets/img/arrefecimento-banner.jpg',
      'RADIADORES': 'assets/img/radiador.webp',
      'INTERCOOLER': 'assets/img/intercooler.webp',
      'COLMEIA': 'assets/img/colmeia.webp',
      'ADITIVOS': 'assets/img/aditivos.webp',
      'VENTOINHA': 'assets/img/ventoinha.webp',
      'EMBREAGEM VISCOSA': 'assets/img/embreagem.webp',
      'RESFRIADOR DE ÓLEO': 'assets/img/resfriador.webp',
      'VÁLVULA TERMOESTÁTICA': 'assets/img/valvula.webp',
      'OUTROS': 'assets/img/outros.png'
    };

    return imagens[categoria] || 'assets/img/default-categoria.png';
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    if (!imgElement.src.includes('default-categoria.png')) {
      imgElement.src = 'assets/img/default-categoria.png';
    }
  }
}
