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
    this.router.navigate(['/perfil']);
    this.dropdownLoginAberto = false;
  }

  goToLogin() {
    this.router.navigate(['/login']);
    this.dropdownLoginAberto = false;
  }

  goToRegister() {
    this.router.navigate(['/register']);
    this.dropdownLoginAberto = false;
  }
}
