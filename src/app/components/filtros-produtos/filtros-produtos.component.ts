import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtros-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtros-produtos.component.html',
})
export class FiltrosProdutosComponent {
  categoria = '';
  marca = '';
  precoMin?: number;
  precoMax?: number;
  promocao = false;
  novidade = false;

  @Output() filtrosMudaram = new EventEmitter<any>();
  @Output() limpar = new EventEmitter<void>();

  aplicarFiltros() {
    this.filtrosMudaram.emit({
      categoria: this.categoria,
      marca: this.marca,
      precoMin: this.precoMin,
      precoMax: this.precoMax,
      promocao: this.promocao,
      novidade: this.novidade
    });
  }

  limparFiltros() {
    this.categoria = '';
    this.marca = '';
    this.precoMin = undefined;
    this.precoMax = undefined;
    this.promocao = false;
    this.novidade = false;
    this.limpar.emit();
  }
}
