import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marcas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.css']
})
export class MarcasComponent implements OnInit {
  marcas: string[] = ['Magneti', 'Pinguim', 'Download', 'RLX', 'Sanden', 'Spal'];
  gruposDeMarcas: string[][] = [];
  cardWidth = 25;

  @ViewChild('carouselRef') carouselRef!: ElementRef;
  carouselInstance: any;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      import('bootstrap').then(({ Carousel }) => {
        this.carouselInstance = new Carousel(this.carouselRef.nativeElement, {
          interval: false,
          ride: false,
        });
      });
    }

    if (isPlatformBrowser(this.platformId)) {
      this.onResize();
      this.gruposDeMarcas = this.agruparMarcas(this.marcas, this.getItensPorSlide());
    }
  }

  getItensPorSlide(): number {
    if (this.cardWidth === 100) return 1;
    if (this.cardWidth === 50) return 2;
    return 4;
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      const largura = window.innerWidth;

      if (largura < 576) {
        this.cardWidth = 100;
      } else if (largura < 768) {
        this.cardWidth = 50;
      } else {
        this.cardWidth = 25;
      }

      this.gruposDeMarcas = this.agruparMarcas(this.marcas, this.getItensPorSlide());
    }
  }

  agruparMarcas(lista: string[], tamanhoGrupo: number): string[][] {
    const grupos: string[][] = [];
    for (let i = 0; i < lista.length; i += tamanhoGrupo) {
      grupos.push(lista.slice(i, i + tamanhoGrupo));
    }
    return grupos;
  }

  getLogoPath(marca: string): string {
    return `assets/marcas/${marca.toLowerCase()}.png`;
  }

  filtrarPorMarca(marca: string) {
    this.router.navigate(['/produtos'], { queryParams: { marca } });
  }

  scrollMarcas(valor: number) {
    this.carouselRef.nativeElement.scrollLeft += valor;
  }
}
