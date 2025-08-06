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
  selector: 'app-lubrificantes',
  templateUrl: './lubrificantes.component.html',
  styleUrls: ['./lubrificantes.component.css'],
  imports: [CommonModule]
})
export class LubrificantesComponent implements OnInit {
  produtos: Produto[] = [];
  lubrificantes: Produto[] = [];
  gruposDeProdutos: Produto[][] = [];
  cardWidth = 25;

  @ViewChild('carouselLubrificantesRef') carouselLubrificantesRef!: ElementRef;
  carouselInstance: any;

  constructor(
    private produtoService: ProdutoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.produtoService.getProdutos().subscribe(produtos => {
        this.produtos = produtos;

        // Filtra categorias que contenham "OLEO" (com ou sem acento)
        this.lubrificantes = produtos.filter(p => {
          const categoria = p.categoria?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase() || '';
          return categoria.includes('OLEO');
        });

        this.onResize();
        this.gruposDeProdutos = this.agruparProdutos(this.lubrificantes, this.getProdutosPorSlide());

        setTimeout(() => {
          import('bootstrap').then(({ Carousel }) => {
            if (this.carouselLubrificantesRef?.nativeElement) {
              this.carouselInstance = new Carousel(this.carouselLubrificantesRef.nativeElement, {
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
      this.gruposDeProdutos = this.agruparProdutos(this.lubrificantes, this.getProdutosPorSlide());
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
