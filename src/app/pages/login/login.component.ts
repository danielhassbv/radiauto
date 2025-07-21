import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  senha = '';
  erro = '';
  sucesso = '';
  carregando = false;

  constructor(private auth: AuthService, private router: Router) { }

  login() {
    this.erro = '';
    this.sucesso = '';
    this.carregando = true;

    this.auth.login(this.email, this.senha)
      .then(() => this.router.navigate(['/painel-produtos']))
      .catch(() => this.erro = 'Email ou senha incorretos.')
      .finally(() => this.carregando = false);
  }

  loginGoogle() {
    this.auth.loginComGoogle()
      .then(() => this.router.navigate(['/painel-produtos']))
      .catch(() => this.erro = 'Erro ao entrar com Google.');
  }

  esqueciSenha() {
    if (!this.email) {
      this.erro = 'Digite seu e-mail para redefinir a senha.';
      return;
    }

    this.auth.redefinirSenha(this.email)
      .then(() => this.sucesso = 'Enviamos o link de redefinição para seu e-mail.')
      .catch(() => this.erro = 'Erro ao enviar e-mail de redefinição.');
  }
}
