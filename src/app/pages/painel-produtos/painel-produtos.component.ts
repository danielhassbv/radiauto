import { Component, AfterViewInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SyncProdutosComponent } from '../../components/sync-produtos/sync-produtos.component';
import { Router } from '@angular/router';
declare var bootstrap: any;


registerLocaleData(localePt, 'pt-BR');

@Component({
  selector: 'app-painel-produtos',
  templateUrl: './painel-produtos.component.html',
  styleUrls: ['./painel-produtos.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, SyncProdutosComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
})
export class PainelProdutosComponent {
  produto: Produto = this.novoProduto();
  produtos: Produto[] = [];
  imagemSelecionada: File | null = null;
  previewImagem: string | ArrayBuffer | null = null;

  constructor(private produtoService: ProdutoService, private router: Router) {
    this.atualizarLista();
  }



  editar(p: Produto) {
    this.produto = { ...p };
    this.previewImagem = p.imagem || null;

    Swal.fire({
      icon: 'info',
      title: 'Edição',
      text: `Produto "${p.nome}" carregado para edição.`,
      timer: 1500,
      showConfirmButton: false,
    });

    setTimeout(() => {
      const modal = new (window as any).bootstrap.Modal(
        document.getElementById('modalEditar')
      );
      modal.show();
    }, 200);
  }
  abrirCadastroModal() {
    const modalElement = document.getElementById('modalContainer');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();

      this.router.navigate([{ outlets: { modal: ['cadastro-produto'] } }]);
    }
  }
  ngAfterViewInit(): void {
    const modalElement = document.getElementById('modalContainer');

    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        // Ao fechar o modal, remove a rota nomeada "modal"
        this.router.navigate([{ outlets: { modal: null } }]);
      });
    }
  }
  async remover(id: string) {
    await this.produtoService.deletar(id);
    this.atualizarLista();

    Swal.fire({
      icon: 'success',
      title: 'Removido!',
      text: 'Produto removido com sucesso.',
      timer: 1500,
      showConfirmButton: false,
    });
  }

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

      this.produto = this.novoProduto();
      this.previewImagem = null;
      this.imagemSelecionada = null;
      this.atualizarLista();

      Swal.fire({
        icon: 'success',
        title: 'Salvo!',
        text: 'Produto salvo com sucesso.',
        timer: 1500,
        showConfirmButton: false,
      });

      const modalEl = document.getElementById('modalEditar');
      if (modalEl) {
        const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
        modal?.hide();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Erro ao salvar o produto.',
      });
      console.error('Erro ao salvar:', error);
    }
  }

  atualizarLista() {
    this.produtoService.getProdutos().subscribe((produtos) => {
      this.produtos = produtos;
    });
  }

  novoProduto(): Produto {
    return {
      nome: '',
      descricao: '',
      preco: 0,
      imagem: '',
      marca: '',
      categoria: '',
      promocao: false,
      novidade: false,
    };
  }

  atualizarPreco(event: Event): void {
    const input = event.target as HTMLInputElement;
    const numeros = input.value.replace(/\D/g, '');
    const valor = parseFloat(numeros) / 100;
    this.produto.preco = isNaN(valor) ? 0 : Number(valor.toFixed(2));
  }

  selecionarImagem(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagemSelecionada = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImagem = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
