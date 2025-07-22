import { Component } from '@angular/core';
import { auth } from '../../firebase.config';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header-administrativo',
  imports: [],
  templateUrl: './header-administrativo.component.html',
  styleUrl: './header-administrativo.component.css'
})
export class HeaderAdministrativoComponent {
  usuario: User | null = null;

  constructor(private router: Router) {

    onAuthStateChanged(auth, (user) => {
      this.usuario = user;
    });
  }

  logout() {
    signOut(auth).then(() => {
      this.usuario = null;
      this.router.navigate(['/']);
    });
  }


  irParaPainel() {
    this.router.navigate(['/painel-produtos']);
  }


}
