import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { PromocaoComponent } from '../promocao/promocao.component';



@Component({
  selector: 'app-home',
  imports: [HeaderComponent, PromocaoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
