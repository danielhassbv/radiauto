import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Inject,
  PLATFORM_ID,
  HostListener // ✅ adicione isso aqui
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';

declare var bootstrap: any;

@Component({
  selector: 'app-promocao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promocao.component.html',
  styleUrls: ['./promocao.component.css'],
})
export class PromocaoComponent implements OnInit {
  produtos: Produto[] = [];
  gruposDeProdutos: Produto[][] = [];
  cardWidth = 25;
  @ViewChild('carouselRef') carouselRef!: ElementRef;
  carouselInstance: any;

  constructor(
    private produtoService: ProdutoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('bootstrap').then(({ Carousel }) => {
        this.carouselInstance = new Carousel(this.carouselRef.nativeElement, {
          interval: false,
          ride: false,
        });
      });

      this.produtoService.getProdutos().subscribe(produtos => {
        this.produtos = produtos;
        this.onResize(); // dispara cálculo de tamanho ao carregar
        this.gruposDeProdutos = this.agruparProdutos(produtos, this.getProdutosPorSlide());
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
      this.gruposDeProdutos = this.agruparProdutos(this.produtos, this.getProdutosPorSlide());
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
