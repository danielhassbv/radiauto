import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  email = '';
  senha = '';
  confirmarSenha = '';
  erro = '';

  constructor(private auth: AuthService, private router: Router) { }

  registrar() {
    if (this.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem';
      return;
    }

    if (this.senha.length < 6) {
      this.erro = 'A senha deve ter pelo menos 6 caracteres';
      return;
    }

    this.auth.register(this.email, this.senha)
      .then(() => this.router.navigate(['/painel-produtos']))
      .catch(err => this.erro = 'Erro ao registrar: ' + err.message);
  }

}
