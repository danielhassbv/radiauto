import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

import { HeaderAdministrativoComponent } from '../../shared/header-administrativo/header-administrativo.component';

@Component({
  selector: 'app-listagem-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderAdministrativoComponent],
  templateUrl: './listagem-produtos.component.html',
  styleUrls: ['./listagem-produtos.component.css'],
  animations: [
    trigger('fadeTrigger', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ListagemProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];

  marcas: string[] = [];
  categorias: string[] = [];
  marcasSelecionadas: string[] = [];
  categoriasSelecionadas: string[] = [];

  promocao = false;
  novidade = false;
  precoMin?: number;
  precoMax?: number;

  loadingProdutos = false;
  selectedProduto?: Produto;
  mostrarModal = false;

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe(produtos => {
      this.produtos = produtos;
      this.produtosFiltrados = [...produtos];
      this.marcas = [...new Set(produtos.map(p => p.marca))];
      this.categorias = [...new Set(produtos.map(p => p.categoria))];

    });

  }

  aplicarFiltro(): void {
    this.loadingProdutos = true;
    setTimeout(() => {
      this.produtosFiltrados = this.produtos.filter(p => {
        const marcaOk = this.marcasSelecionadas.length ? this.marcasSelecionadas.includes(p.marca) : true;
        const categoriaOk = this.categoriasSelecionadas.length ? this.categoriasSelecionadas.includes(p.categoria) : true;
        const promocaoOk = this.promocao ? p.promocao : true;
        const novidadeOk = this.novidade ? p.novidade : true;
        const precoMinOk = this.precoMin != null ? p.preco >= this.precoMin : true;
        const precoMaxOk = this.precoMax != null ? p.preco <= this.precoMax : true;
        return marcaOk && categoriaOk && promocaoOk && novidadeOk && precoMinOk && precoMaxOk;
      });
      this.loadingProdutos = false;
    }, 200); // Delay de transição
  }

  toggleMarca(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    input.checked
      ? this.marcasSelecionadas.push(value)
      : this.marcasSelecionadas = this.marcasSelecionadas.filter(m => m !== value);
    this.aplicarFiltro();
  }

  toggleCategoria(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    input.checked
      ? this.categoriasSelecionadas.push(value)
      : this.categoriasSelecionadas = this.categoriasSelecionadas.filter(c => c !== value);
    this.aplicarFiltro();
  }

  onChangeFiltro(): void {
    this.aplicarFiltro();
  }

  abrirModal(produto: Produto): void {
    this.selectedProduto = produto;
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
  }
}
