import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-captura-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './captura-email.component.html',
  styleUrls: ['./captura-email.component.css']
})
export class CapturaEmailComponent {
  nome: string = '';
  email: string = '';
  carregando = false;

  constructor(private firestore: Firestore) {}

  async enviar() {
    if (!this.nome || !this.email) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    this.carregando = true;

    try {
      const leadsRef = collection(this.firestore, 'leads');
      await addDoc(leadsRef, {
        nome: this.nome,
        email: this.email,
        data: new Date()
      });

      alert('E-mail cadastrado com sucesso!');
      this.nome = '';
      this.email = '';
    } catch (erro) {
      console.error('Erro ao salvar no Firebase:', erro);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      this.carregando = false;
    }
  }
}
