import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Inject,
  PLATFORM_ID,
  HostListener
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';

declare var bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-novidades',
  imports: [CommonModule],
  templateUrl: './novidades.component.html',
  styleUrl: './novidades.component.css'
})
export class NovidadesComponent implements OnInit {
  produtos: Produto[] = []; // todos os produtos
  novidades: Produto[] = []; // apenas os produtos com novidade: true
  gruposDeProdutos: Produto[][] = []; // produtos para o carrossel
  cardWidth = 25;

  @ViewChild('carouselNovidadesRef') carouselNovidadesRef!: ElementRef;
  carouselInstance: any;

  constructor(
    private produtoService: ProdutoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.produtoService.getProdutos().subscribe(produtos => {
        this.produtos = produtos;
        this.novidades = produtos.filter(p => p.novidade); // 🔥 só novidades

        this.onResize(); // ajusta cardWidth e agrupa
        this.gruposDeProdutos = this.agruparProdutos(this.novidades, this.getProdutosPorSlide());

        // Inicializa o carrossel com delay para garantir renderização
        setTimeout(() => {
          import('bootstrap').then(({ Carousel }) => {
            if (this.carouselNovidadesRef?.nativeElement) {
              this.carouselInstance = new Carousel(this.carouselNovidadesRef.nativeElement, {
                interval: 4000,
                ride: 'carousel',
                pause: 'hover'
              });
            }
          });
        }, 100);
      });
    }
  }

  getProdutosPorSlide(): number {
    if (this.cardWidth === 100) return 1;
    if (this.cardWidth === 50) return 2;
    return 4;
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      const largura = window.innerWidth;
      this.cardWidth = largura < 576 ? 100 : largura < 768 ? 50 : 25;
      this.gruposDeProdutos = this.agruparProdutos(this.novidades, this.getProdutosPorSlide());
    }
  }

  agruparProdutos(lista: Produto[], tamanhoGrupo: number): Produto[][] {
    const grupos: Produto[][] = [];
    for (let i = 0; i < lista.length; i += tamanhoGrupo) {
      grupos.push(lista.slice(i, i + tamanhoGrupo));
    }
    return grupos;
  }
}
