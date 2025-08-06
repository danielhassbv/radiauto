import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { PromocaoComponent } from '../promocao/promocao.component';
import { FormsModule } from '@angular/forms'; // <== AQUI
import { MarcasComponent } from '../marcas/marcas.component';
import { NovidadesComponent } from '../novidades/novidades.component';
import { CategoriasFiltrosComponent } from '../categorias-filtros/categorias-filtros.component';
import { RadiadoresComponent } from '../radiadores/radiadores.component';
import { ArCondicionadoComponent } from '../ar-condicionado/ar-condicionado.component';
import { LubrificantesComponent } from '../lubrificantes/lubrificantes.component';
import { CapturaEmailComponent } from '../captura-email/captura-email.component';
import { QuemSomosComponent } from '../quem-somos/quem-somos.component';
import { CentralAtendimentoComponent } from '../central-atendimento/central-atendimento.component';
import { FooterComponent } from '../../shared/footer/footer.component';


@Component({
  standalone: true,
  selector: 'app-home',
  imports: [HeaderComponent, PromocaoComponent, FormsModule, MarcasComponent, NovidadesComponent,
    CategoriasFiltrosComponent, RadiadoresComponent, ArCondicionadoComponent, LubrificantesComponent, 
    CapturaEmailComponent, QuemSomosComponent, CentralAtendimentoComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
