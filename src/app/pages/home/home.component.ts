import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { PromocaoComponent } from '../promocao/promocao.component';
import { FormsModule } from '@angular/forms'; // <== AQUI
import { MarcasComponent } from '../marcas/marcas.component';


@Component({
  selector: 'app-home',
  imports: [HeaderComponent, PromocaoComponent, FormsModule, MarcasComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
