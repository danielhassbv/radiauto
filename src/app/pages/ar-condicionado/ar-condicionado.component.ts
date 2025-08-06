import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ar-condicionado',
  templateUrl: './ar-condicionado.component.html',
  styleUrls: ['./ar-condicionado.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class ArCondicionadoComponent implements OnInit {
  produtos: Produto[] = [];
  categoriasFiltradas: string[] = [];
  categoriaDestaque = 'AR CONDICIONADO'; // Categoria destaque

  // Categorias exclusivas de ar condicionado
  categoriasPermitidas = [
    'AR CONDICIONADO',
    'COMPRESSORES',
    'CONDENSADORES',
    'EVAPORADORES',
    'FILTROS SECADORES',
    'TUBULAÇÃO',
    'VENTOINHA AR',
    'OUTROS'
  ];

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe(produtos => {
      this.produtos = produtos;

      const categoriasUnicas = [
        ...new Set(
          produtos.map(p =>
            (p.categoria && p.categoria.trim())
              ? p.categoria.trim().toUpperCase()
              : 'OUTROS'
          )
        )
      ];

      this.categoriasFiltradas = categoriasUnicas.filter(c =>
        this.categoriasPermitidas.includes(c)
      );
    });
  }

  getImagemCategoria(categoria: string): string {
    if (!categoria) return 'assets/img/default-categoria.png';

    const imagens: { [key: string]: string } = {
      'AR CONDICIONADO': 'assets/img/ar-condicionado-banner.jpg',
      'COMPRESSORES': 'assets/img/compressor.webp',
      'CONDENSADORES': 'assets/img/condensador.webp',
      'EVAPORADORES': 'assets/img/evaporador.webp',
      'FILTROS SECADORES': 'assets/img/filtro.webp',
      'TUBULAÇÃO': 'assets/img/tubulacao.webp',
      'VENTOINHA AR': 'assets/img/ventoinha-ar.webp',
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
