import { Component, AfterViewInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SyncProdutosComponent } from '../../components/sync-produtos/sync-produtos.component';
import { Router } from '@angular/router';
declare var bootstrap: any;
import { auth } from '../../firebase.config';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { HeaderAdministrativoComponent } from '../../shared/header-administrativo/header-administrativo.component';

registerLocaleData(localePt, 'pt-BR');

@Component({
  selector: 'app-painel-produtos',
  templateUrl: './painel-produtos.component.html',
  styleUrls: ['./painel-produtos.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, SyncProdutosComponent, HeaderAdministrativoComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({ height: '*', opacity: 1, padding: '*', overflow: 'hidden' })),
      state('collapsed', style({ height: '0px', opacity: 0, padding: '0px', overflow: 'hidden' })),
      transition('expanded <=> collapsed', [animate('300ms ease')]),
    ])
  ],
})
export class PainelProdutosComponent implements AfterViewInit {

  produto: Produto = this.novoProduto();
  produtos: Produto[] = [];
  produtosPaginados: Produto[] = [];

  imagemSelecionada: File | null = null;
  previewImagem: string | ArrayBuffer | null = null;

  usuario: User | null = null;

  // Paginação
  paginaAtual = 1;
  itensPorPagina = 5;
  totalPaginas = 0;
  paginasVisiveis: number[] = [];

  constructor(private produtoService: ProdutoService, private router: Router) {
    this.atualizarLista();
    onAuthStateChanged(auth, (user) => this.usuario = user);
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('modalContainer');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.router.navigate([{ outlets: { modal: null } }]);
      });
    }
  }

  irParaListagem() {
    this.router.navigate(['/listagem-produtos']);
  }

  abrirCadastroModal() {
    const modalElement = document.getElementById('modalContainer');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
      this.router.navigate([{ outlets: { modal: ['cadastro-produto'] } }]);
    }
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
      const modal = new bootstrap.Modal(document.getElementById('modalEditar'));
      modal.show();
    }, 200);
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
        const modal = bootstrap.Modal.getInstance(modalEl);
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
      this.totalPaginas = Math.ceil(this.produtos.length / this.itensPorPagina);
      this.paginaAtual = 1;
      this.atualizarPaginacao();
    });
  }

  atualizarPaginacao() {
    const range = 2;
    const inicio = Math.max(1, this.paginaAtual - range);
    const fim = Math.min(this.totalPaginas, this.paginaAtual + range);

    this.paginasVisiveis = [];
    for (let i = inicio; i <= fim; i++) {
      this.paginasVisiveis.push(i);
    }

    const start = (this.paginaAtual - 1) * this.itensPorPagina;
    const end = start + this.itensPorPagina;
    this.produtosPaginados = this.produtos.slice(start, end);
  }

  proxima() {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.atualizarPaginacao();
    }
  }

  anterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPaginacao();
    }
  }

  irParaPagina(pagina: number) {
    this.paginaAtual = pagina;
    this.atualizarPaginacao();
  }

  logout() {
    signOut(auth).then(() => {
      this.usuario = null;
      this.router.navigate(['/login']);
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
      quantidade: 0
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
      reader.onload = () => this.previewImagem = reader.result;
      reader.readAsDataURL(file);
    }
  }
}
