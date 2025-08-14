import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  menuMobileAberto = false;
  dropdownLoginAberto = false;

  constructor(public auth: AuthService, private router: Router) { }

  toggleMobileMenu() {
    this.menuMobileAberto = !this.menuMobileAberto;
  }

  toggleLoginDropdown() {
    this.dropdownLoginAberto = !this.dropdownLoginAberto;
  }

  logout() {
    this.auth.logout();
    this.dropdownLoginAberto = false;
  }

  goToProfile() {
    const usuario = this.auth.getUsuario();

    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    if (usuario.role === 'cliente') {
      this.router.navigate(['/painel-cliente']);
    } else if (usuario.role === 'admin') {
      this.router.navigate(['/painel-produtos']);
    } else {
      // fallback de segurança
      this.router.navigate(['/login']);
    }

    this.dropdownLoginAberto = false;
  }

  goToLogin() {
    this.router.navigate(['/login']);
    this.dropdownLoginAberto = false;
  }

  goToRegister() {
    this.router.navigate(['/registro']); // corrigido pra bater com a rota do cliente
    this.dropdownLoginAberto = false;
  }
}
