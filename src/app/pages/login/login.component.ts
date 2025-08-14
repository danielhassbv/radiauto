import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  senha = '';
  erro = '';
  sucesso = '';
  carregando = false;

  constructor(private auth: AuthService, private router: Router) {}

  async login() {
    this.erro = '';
    this.sucesso = '';
    this.carregando = true;

    try {
      await this.auth.login(this.email, this.senha);

      const usuario = this.auth.getUsuario();
      if (!usuario) {
        this.erro = 'Erro ao obter informações do usuário.';
        return;
      }

      if (usuario.role === 'admin') {
        this.router.navigate(['/painel-produtos']);
      } else {
        this.router.navigate(['/painel-cliente']);
      }
    } catch (err) {
      this.erro = 'Email ou senha incorretos.';
    } finally {
      this.carregando = false;
    }
  }

  async loginGoogle() {
    this.erro = '';
    this.sucesso = '';
    try {
      await this.auth.loginComGoogle();
      const usuario = this.auth.getUsuario();

      if (usuario?.role === 'admin') {
        this.router.navigate(['/painel-produtos']);
      } else {
        this.router.navigate(['/painel-cliente']);
      }
    } catch {
      this.erro = 'Erro ao entrar com Google.';
    }
  }

  esqueciSenha() {
    if (!this.email) {
      this.erro = 'Digite seu e-mail para redefinir a senha.';
      return;
    }

    this.auth
      .redefinirSenha(this.email)
      .then(() => (this.sucesso = 'Enviamos o link de redefinição para seu e-mail.'))
      .catch(() => (this.erro = 'Erro ao enviar e-mail de redefinição.'));
  }
}
