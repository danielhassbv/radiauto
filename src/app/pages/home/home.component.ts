import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { PromocaoComponent } from '../promocao/promocao.component';
import { FormsModule } from '@angular/forms'; // <== AQUI
import { MarcasComponent } from '../marcas/marcas.component';
import { NovidadesComponent } from '../novidades/novidades.component';
import { CategoriasFiltrosComponent } from '../categorias-filtros/categorias-filtros.component';


@Component({
  standalone: true,
  selector: 'app-home',
  imports: [HeaderComponent, PromocaoComponent, FormsModule, MarcasComponent, NovidadesComponent, CategoriasFiltrosComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
