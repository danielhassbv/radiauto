import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseSyncService } from '../../services/firebase-sync.service';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-sync-produtos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sync-produtos.component.html',
  styleUrls: ['./sync-produtos.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({ height: '*', opacity: 1, padding: '*', overflow: 'hidden' })),
      state('collapsed', style({ height: '0px', opacity: 0, padding: '0px', overflow: 'hidden' })),
      transition('expanded <=> collapsed', [animate('300ms ease')]),
    ])
  ]
})
export class SyncProdutosComponent {
  mensagem = '';
  sucesso = false;
  mostrarToast = false;

  carregandoRTDBParaSupabase = false;

  constructor(
    private syncService: FirebaseSyncService,
    private http: HttpClient
  ) { }

  fecharToast() {
    this.mostrarToast = false;
  }


  async sincronizarProdutosFilialParaSupabase() {
    this.carregandoRTDBParaSupabase = true;
    this.fecharToast();
    try {
      await this.syncService.sincronizarProdutosFilialParaSupabase();
      this.sucesso = true;
      this.mensagem = '✅ Produtos sincronizados com sucesso no Supabase!';
    } catch (e) {
      console.error(e);
      this.sucesso = false;
      this.mensagem = '❌ Erro ao sincronizar produtos com Supabase.';
    }
    this.carregandoRTDBParaSupabase = false;
    this.mostrarToast = true;
    setTimeout(() => this.fecharToast(), 4000);
  }



}
