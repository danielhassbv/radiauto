import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-painel-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './painel-cliente.component.html',
  styleUrls: ['./painel-cliente.component.css']
})
export class PainelClienteComponent implements OnInit {
  usuario: any = null;
  pedidos: any[] = [];
  carregando = true;

  constructor(private authService: AuthService, private firestore: Firestore, private router: Router) {}

  async ngOnInit() {
    if (!this.authService.isLogado()) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuario = this.authService.getUsuario();

    // Buscar pedidos do cliente
    const ref = collection(this.firestore, 'pedidos');
    const q = query(ref, where('uidCliente', '==', this.usuario.uid));
    const snap = await getDocs(q);

    this.pedidos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    this.carregando = false;
  }

  logout() {
    this.authService.logout();
  }
}
