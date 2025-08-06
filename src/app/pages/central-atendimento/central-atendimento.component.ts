import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Filial {
  nome: string;
  endereco: string;
  fone: string;
  whatsapp: string;
}

@Component({
  selector: 'app-central-atendimento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './central-atendimento.component.html',
  styleUrls: ['./central-atendimento.component.css']
})
export class CentralAtendimentoComponent {
  filiais: Filial[] = [
    { 
      nome: 'ANANINDEUA / PA', 
      endereco: 'Av. Independência, 1234 - Centro, Ananindeua - PA', 
      fone: '(91) 3000-1234', 
      whatsapp: '(91) 98888-1234' 
    },
    { 
      nome: 'BELÉM / PA', 
      endereco: 'Rua das Flores, 567 - Umarizal, Belém - PA', 
      fone: '(91) 3200-5678', 
      whatsapp: '(91) 98888-5678' 
    },
    { 
      nome: 'MARITUBA / PA', 
      endereco: 'Travessa São João, 890 - Centro, Marituba - PA', 
      fone: '(91) 3300-8901', 
      whatsapp: '(91) 98888-8901' 
    }
  ];
}
