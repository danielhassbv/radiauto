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
  categoriasUnicas: string[] = [];
  categoriaDestaque = 'arrefecimento'; // 🔴 Categoria à esquerda
  categoriasRestantes: string[] = [];

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe(produtos => {
      this.produtos = produtos;
      this.categoriasUnicas = [...new Set(produtos.map(p => p.categoria))];
      this.categoriasRestantes = this.categoriasUnicas.filter(c => c !== this.categoriaDestaque);
    });
  }

  getImagemCategoria(categoria: string): string {
    const imagens: { [key: string]: string } = {
      'arrefecimento': 'assets/img/arrefecimento-banner.png',
      'ar-condicionado': 'assets/img/ar-condicionado-banner.png',
      'direção': 'assets/img/categorias/direcao.png',
      'freios': 'assets/img/categorias/freios.png',
      'suspensão': 'assets/img/categorias/suspensao.png',
      'ignição': 'assets/img/categorias/ignicao.png',
      'motor': 'assets/img/categorias/motor.png'
      // adicione outras aqui
    };
    return imagens[categoria.toLowerCase()] || 'assets/img/default-categoria.png';
  }
}
