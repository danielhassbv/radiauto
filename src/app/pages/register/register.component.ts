import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  carregando = false;
  erro = '';
  sucesso = '';

  constructor(private authService: AuthService, private router: Router) {}

  async registrar() {
    this.erro = '';
    this.sucesso = '';

    if (this.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não conferem!';
      return;
    }

    this.carregando = true;
    try {
      await this.authService.registrar(this.email, this.senha, 'cliente');
      this.sucesso = 'Conta criada com sucesso!';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    } catch (error: any) {
      this.erro = error.message || 'Erro ao registrar';
    } finally {
      this.carregando = false;
    }
  }

  async registrarComGoogle() {
    this.erro = '';
    this.sucesso = '';
    this.carregando = true;

    try {
      await this.authService.loginComGoogle();
      this.sucesso = 'Conta criada com sucesso pelo Google!';
      setTimeout(() => {
        this.router.navigate(['/painel-cliente']);
      }, 1500);
    } catch (error: any) {
      this.erro = error.message || 'Erro ao registrar com Google';
    } finally {
      this.carregando = false;
    }
  }
}
