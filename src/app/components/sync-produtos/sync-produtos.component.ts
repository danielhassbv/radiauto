import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseSyncService } from '../../services/firebase-sync.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-sync-produtos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sync-produtos.component.html',
  styleUrls: ['./sync-produtos.component.css']
})
export class SyncProdutosComponent {
  mensagem = '';
  sucesso = false;
  mostrarToast = false;

  carregandoFirestoreParaRTDB = false;
  carregandoRTDBParaFirestore = false;

  constructor(
    private syncService: FirebaseSyncService,
    private http: HttpClient
  ) { }
  async sincronizar() {
    this.carregandoFirestoreParaRTDB = true;
    this.fecharToast();

    try {
      await this.syncService.sincronizarFirestoreParaRTDB();
      this.sucesso = true;
      this.mensagem = '✅ Dados sincronizados com sucesso!';
    } catch (error) {
      this.sucesso = false;
      this.mensagem = '❌ Ocorreu um erro ao sincronizar.';
      console.error(error);
    }

    this.carregandoFirestoreParaRTDB = false;
    this.mostrarToast = true;
    setTimeout(() => this.fecharToast(), 4000);
  }

  async sincronizarParaFirestore() {
    this.carregandoRTDBParaFirestore = true;
    this.fecharToast();

    try {
      await this.syncService.sincronizarRTDBParaFirestore();
      this.sucesso = true;
      this.mensagem = '✅ Dados sincronizados do Realtime para Firestore!';
    } catch (error) {
      this.sucesso = false;
      this.mensagem = '❌ Erro ao sincronizar do Realtime para o Firestore.';
      console.error(error);
    }

    this.carregandoRTDBParaFirestore = false;
    this.mostrarToast = true;
    setTimeout(() => this.fecharToast(), 4000);
  }

  fecharToast() {
    this.mostrarToast = false;
  }

  carregandoRTDBParaSupabase = false;

  async sincronizarRTDBParaSupabase() {
    this.carregandoRTDBParaSupabase = true;
    this.fecharToast();

    try {
      await this.syncService.sincronizarRTDBParaSupabase();
      this.sucesso = true;
      this.mensagem = '✅ Dados sincronizados com Supabase com sucesso!';
    } catch (error) {
      this.sucesso = false;
      this.mensagem = '❌ Erro ao sincronizar com Supabase.';
    }

    this.carregandoRTDBParaSupabase = false;
    this.mostrarToast = true;
    setTimeout(() => this.fecharToast(), 4000);
  }

  carregandoTABPROParaFirestore = false;

  sincronizarTABPROparaFirestore() {
    this.carregandoTABPROParaFirestore = true;

    this.syncService.sincronizarTABPROparaFirestore()
      .finally(() => this.carregandoTABPROParaFirestore = false);
  }


}
