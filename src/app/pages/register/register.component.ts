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
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  senha = '';
  confirmarSenha = '';
  erro = '';
  sucesso = '';
  carregando = false;

  constructor(private auth: AuthService, private router: Router) { }

  registrar() {
    this.erro = '';
    this.sucesso = '';

    if (this.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem.';
      return;
    }

    if (this.senha.length < 6) {
      this.erro = 'A senha deve ter pelo menos 6 caracteres.';
      return;
    }

    this.carregando = true;

    this.auth.registrar(this.email, this.senha)
      .then(() => {
        this.sucesso = 'Conta criada com sucesso!';
        this.router.navigate(['/painel-produtos']);
      })
      .catch(err => {
        this.erro = 'Erro ao registrar: ' + (err.message || 'Tente novamente.');
      })
      .finally(() => this.carregando = false);
  }
  registrarComGoogle() {
    this.carregando = true;
    this.erro = '';
    this.sucesso = '';

    this.auth.loginComGoogle()
      .then(() => {
        this.sucesso = 'Conta criada com Google!';
        this.router.navigate(['/painel-produtos']);
      })
      .catch(() => {
        this.erro = 'Erro ao registrar com Google.';
      })
      .finally(() => {
        this.carregando = false;
      });
  }

}
