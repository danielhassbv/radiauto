import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-admin.component.html',
})
export class RegisterAdminComponent {
  email = '';
  senha = '';
  confirmarSenha = '';
  codigoSeguranca = '';

  carregando = false;
  erro = '';
  sucesso = '';

  constructor(private authService: AuthService, private router: Router) {}

  async registrarAdmin() {
    this.erro = '';
    this.sucesso = '';

    if (this.codigoSeguranca !== '7588') {
      this.erro = 'Código de segurança incorreto.';
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não conferem!';
      return;
    }

    this.carregando = true;
    try {
      await this.authService.registrar(this.email, this.senha, 'admin');
      this.sucesso = 'Administrador criado com sucesso!';
      setTimeout(() => {
        this.router.navigate(['/painel-produtos']);
      }, 1500);
    } catch (error: any) {
      this.erro = error.message || 'Erro ao criar administrador';
    } finally {
      this.carregando = false;
    }
  }
}
