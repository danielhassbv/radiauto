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
  selector: 'app-radiadores',
  imports: [CommonModule],
  templateUrl: './radiadores.component.html',
  styleUrl: './radiadores.component.css'
})
export class RadiadoresComponent implements OnInit {
  produtos: Produto[] = []; // todos os produtos
  radiadores: Produto[] = []; // apenas os produtos da categoria radiadores
  gruposDeProdutos: Produto[][] = []; // produtos para o carrossel
  cardWidth = 25;

  @ViewChild('carouselRadiadoresRef') carouselRadiadoresRef!: ElementRef;
  carouselInstance: any;

  constructor(
    private produtoService: ProdutoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.produtoService.getProdutos().subscribe(produtos => {
        this.produtos = produtos;
        this.radiadores = produtos.filter(p => 
          p.categoria?.toLowerCase() === 'radiadores'
        );

        this.onResize(); // ajusta cardWidth e agrupa
        this.gruposDeProdutos = this.agruparProdutos(this.radiadores, this.getProdutosPorSlide());

        // Inicializa o carrossel com delay para garantir renderização
        setTimeout(() => {
          import('bootstrap').then(({ Carousel }) => {
            if (this.carouselRadiadoresRef?.nativeElement) {
              this.carouselInstance = new Carousel(this.carouselRadiadoresRef.nativeElement, {
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
      this.gruposDeProdutos = this.agruparProdutos(this.radiadores, this.getProdutosPorSlide());
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
