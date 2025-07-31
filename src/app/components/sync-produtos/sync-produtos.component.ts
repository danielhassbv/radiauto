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

  carregandoFirestoreParaRTDB = false;
  carregandoRTDBParaFirestore = false;
  carregandoRTDBParaSupabase = false;
  carregandoTABPROParaFirestore = false;
  carregandoProdutosFilialParaFirestore = false;

  constructor(
    private syncService: FirebaseSyncService,
    private http: HttpClient
  ) { }

  fecharToast() {
    this.mostrarToast = false;
  }

  async sincronizarRTDBParaSupabase() {
    this.carregandoRTDBParaSupabase = true;
    this.fecharToast();
    try {
      await this.syncService.sincronizarRTDBParaSupabase();
      this.sucesso = true;
      this.mensagem = '✅ Dados sincronizados com Supabase com sucesso!';
    } catch {
      this.sucesso = false;
      this.mensagem = '❌ Erro ao sincronizar com Supabase.';
    }
    this.carregandoRTDBParaSupabase = false;
    this.mostrarToast = true;
    setTimeout(() => this.fecharToast(), 4000);
  }

  async sincronizarTABPROparaFirestore() {
    this.carregandoTABPROParaFirestore = true;
    try {
      await this.syncService.sincronizarTABPROparaFirestore();
    } finally {
      this.carregandoTABPROParaFirestore = false;
    }
  }

  carregandoFirestoreParaSupabase = false;

  async sincronizarProdutosFirestoreParaSupabase() {
    this.carregandoFirestoreParaSupabase = true;
    this.fecharToast();
    try {
      await this.syncService.sincronizarProdutosFirestoreParaSupabase();
      this.sucesso = true;
      this.mensagem = '✅ Produtos exportados do Firestore para o Supabase!';
    } catch {
      this.sucesso = false;
      this.mensagem = '❌ Erro ao exportar para Supabase.';
    }
    this.carregandoFirestoreParaSupabase = false;
    this.mostrarToast = true;
    setTimeout(() => this.fecharToast(), 4000);
  }


  async sincronizarProdutosFilialParaFirestore() {
    this.carregandoProdutosFilialParaFirestore = true;
    this.fecharToast();
    try {
      await this.syncService.sincronizarProdutosFilialParaFirestore();
      this.sucesso = true;
      this.mensagem = '✅ Tabela produtos criada com sucesso no Firestore!';
    } catch {
      this.sucesso = false;
      this.mensagem = '❌ Erro ao criar tabela produtos.';
    }
    this.carregandoProdutosFilialParaFirestore = false;
    this.mostrarToast = true;
    setTimeout(() => this.fecharToast(), 4000);
  }

}
