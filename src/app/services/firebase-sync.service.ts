import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { auth } from '../firebase.config';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { lastValueFrom } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class FirebaseSyncService {
    private firestoreUrl =
        'https://firestore.googleapis.com/v1/projects/radiauto-project/databases/(default)/documents/produtos';
    private rtdbUrl =
        'https://radiauto-project-default-rtdb.firebaseio.com/produtos.json';

    constructor(private http: HttpClient) { }


    async sincronizarRTDBParaSupabase() {
        const rtdbUrl = 'https://radiauto-project-default-rtdb.firebaseio.com/produtos.json';

        // Supabase
        const supabaseUrl = 'https://vflhnhwdwmlaebrfibeq.supabase.co/rest/v1/produtos';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmbGhuaHdkd21sYWVicmZpYmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMDExMzgsImV4cCI6MjA2NTc3NzEzOH0.4_Ot8EA7TMXdyg6Y7Y1wBsOejQFZAizT8F0ffOOy5BM'; // ⚠️ Substitua pela sua ANON KEY

        try {
            // 1. Buscar os dados do RTDB
            const dadosRTDB: any = await this.http.get(rtdbUrl).toPromise();

            if (!dadosRTDB) {
                console.warn('⚠️ Nenhum dado encontrado no RTDB.');
                return;
            }

            // 2. Transformar os dados em array de objetos para o Supabase
            const produtos = Object.keys(dadosRTDB).map((id) => ({
                id,
                ...dadosRTDB[id]
            }));

            // 3. Enviar para o Supabase
            const headers = new HttpHeaders({
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            });

            await this.http.post(supabaseUrl, produtos, { headers }).toPromise();
            console.log('✅ Dados enviados ao Supabase com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao sincronizar com o Supabase:', error);
            throw error;
        }
    }

    async sincronizarTABPROparaFirestore() {
        const rtdbUrl = 'https://radiauto-project-default-rtdb.firebaseio.com/TABPRO.json';

        try {
            const dados: any = await lastValueFrom(this.http.get(rtdbUrl));
            if (!dados) {
                alert('⚠️ Nenhum dado encontrado.');
                return;
            }

            const entradas = Object.entries(dados).slice(0, 10); // Limita aos primeiros 5

            const promises = entradas.map(async ([_, value]: [string, any]) => {
                const id = value.CODPRO?.toString() || crypto.randomUUID();

                const produto = {
                    nome: value.DESCPRO || '',
                    descricao: value.DETALHE || '',
                    preco: parseFloat(value.ULTRPRCOM01) || 0,
                    imagem: '',
                    marca: '',
                    categoria: '',
                    promocao: false,
                    novidade: false
                };

                const docRef = doc(db, 'produtos', id);
                await setDoc(docRef, produto);
            });

            await Promise.all(promises);
            alert('✅ TABPRO sincronizado com sucesso (10 itens)!');
        } catch (error) {
            console.error('❌ Erro ao sincronizar TABPRO:', error);
            alert('❌ Erro na sincronização.');
        }
    }




}
