import { Component, Input } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

registerLocaleData(localePt, 'pt-BR');

@Component({
  selector: 'app-cadastro-produto',
  standalone: true,
  templateUrl: './cadastro-produto.component.html',
  styleUrl: './cadastro-produto.component.css',
  imports: [CommonModule, FormsModule],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
})
export class CadastroProdutoComponent {
  @Input() produto: Produto = this.criarNovoProduto();

  imagemSelecionada: File | null = null;
  previewImagem: string | ArrayBuffer | null = null;

  constructor(private produtoService: ProdutoService) { }

  async salvar() {
    try {
      if (this.imagemSelecionada) {
        this.produto.imagem = await this.produtoService.uploadImagem(this.imagemSelecionada);
      }

      if (this.produto.id) {
        await this.produtoService.atualizar(this.produto);
      } else {
        await this.produtoService.adicionar(this.produto);
      }

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Produto salvo com sucesso.',
        timer: 2000,
        showConfirmButton: false
      });

      this.limparFormulario();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao salvar o produto. Veja o console.',
      });
      console.error('Erro ao salvar produto:', error);
    }
  }

  selecionarImagem(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imagemSelecionada = file;
      const reader = new FileReader();
      reader.onload = () => this.previewImagem = reader.result;
      reader.readAsDataURL(file);
    }
  }

  atualizarPreco(event: Event): void {
    const input = event.target as HTMLInputElement;
    const numeros = input.value.replace(/\D/g, '');
    const valor = parseFloat(numeros) / 100;
    this.produto.preco = isNaN(valor) ? 0 : Number(valor.toFixed(2));
  }

  formatarReal(valor: number): string {
    return !valor ? 'R$ 0,00' : valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  criarNovoProduto(): Produto {
  return {
    nome: '',
    descricao: '',
    preco: 0,
    quantidade: 0, // adicionado para resolver o erro
    imagem: '',
    marca: '',
    categoria: '',
    promocao: false,
    novidade: false,
  };
}

  limparFormulario(): void {
    this.produto = this.criarNovoProduto();
    this.imagemSelecionada = null;
    this.previewImagem = null;
  }
}
