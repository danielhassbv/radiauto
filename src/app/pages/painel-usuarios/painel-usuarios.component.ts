import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-painel-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './painel-usuarios.component.html',
})
export class PainelUsuariosComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private usuarioService: UsuarioService) { }

  async ngOnInit() {
    this.usuarios = await this.usuarioService.listarUsuarios();
  }

  async remover(uid: string) {
    await this.usuarioService.removerUsuario(uid);
    this.usuarios = this.usuarios.filter(u => u.uid !== uid);
  }
}
