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

    async sincronizarFirestoreParaRTDB() {
        const user = auth.currentUser;

        if (!user) {
            alert('⚠️ Você precisa estar logado para sincronizar os dados.');
            console.error('❌ Usuário não autenticado.');
            return;
        }

        const token = await user.getIdToken(true);
        console.log('🔐 Usuário logado:', user.email);
        console.log('📥 Token Firebase (início):', token.slice(0, 20) + '...');

        const firestoreHeaders = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        });

        try {
            // 1. Buscar dados do Firestore
            const firestoreRes: any = await this.http
                .get(this.firestoreUrl, { headers: firestoreHeaders })
                .toPromise();

            if (!firestoreRes.documents) {
                console.warn('⚠️ Nenhum documento encontrado no Firestore.');
                return;
            }

            // 2. Converter documentos do Firestore para estrutura do RTDB
            const dadosRTDB: any = {};
            firestoreRes.documents.forEach((doc: any) => {
                const id = doc.name.split('/').pop();
                const campos = doc.fields;

                dadosRTDB[id] = Object.fromEntries(
                    Object.entries(campos).map(([key, value]: any) => [
                        key,
                        Object.values(value)[0],
                    ])
                );
            });

            console.log('📦 Dados prontos para enviar ao RTDB:', dadosRTDB);

            // 3. Enviar para RTDB usando token na URL
            const rtdbUrlComToken = `${this.rtdbUrl}?auth=${token}`;
            await this.http.put(rtdbUrlComToken, dadosRTDB).toPromise();

            console.log('✅ Sincronização concluída com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao sincronizar dados:', error);
            alert('❌ Erro ao sincronizar dados. Veja o console.');
        }
    }

    async sincronizarRTDBParaFirestore(): Promise<void> {
        const user = auth.currentUser;

        if (!user) {
            alert('⚠️ Você precisa estar logado para sincronizar os dados.');
            console.error('❌ Usuário não autenticado.');
            return;
        }

        const token = await user.getIdToken(true);
        console.log('🔐 Usuário logado:', user.email);
        console.log('📥 Token Firebase (início):', token.slice(0, 20) + '...');

        try {
            // 1. Buscar dados do RTDB
            const rtdbUrlComToken = `${this.rtdbUrl}?auth=${token}`;
            const rtdbRes: any = await this.http.get(rtdbUrlComToken).toPromise();

            if (!rtdbRes) {
                console.warn('⚠️ Nenhum dado encontrado no Realtime Database.');
                return;
            }

            console.log('📤 Dados lidos do RTDB:', rtdbRes);

            // 2. Preparar headers
            const firestoreHeaders = new HttpHeaders({
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });

            // 3. Para cada produto, formatar os dados e enviar para Firestore
            const writePromises = Object.entries(rtdbRes).map(([id, produto]: any) => {
                const docUrl = `https://firestore.googleapis.com/v1/projects/radiauto-project/databases/(default)/documents/produtos/${id}`;

                const firestorePayload = {
                    fields: Object.fromEntries(
                        Object.entries(produto).map(([key, value]: any) => {
                            if (typeof value === 'number') {
                                return [key, { doubleValue: value }];
                            } else if (typeof value === 'boolean') {
                                return [key, { booleanValue: value }];
                            } else {
                                return [key, { stringValue: String(value ?? '') }];
                            }
                        })
                    )
                };

                console.log('📤 Enviando documento para Firestore:', docUrl, firestorePayload);

                return this.http
                    .patch(docUrl, firestorePayload, { headers: firestoreHeaders })
                    .toPromise();
            });

            await Promise.all(writePromises);

            console.log('✅ Sincronização do RTDB para Firestore concluída!');
        } catch (error) {
            console.error('❌ Erro ao sincronizar dados para Firestore:', error);
            alert('❌ Erro ao sincronizar dados para Firestore. Veja o console.');
        }
    }

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

            const entradas = Object.entries(dados).slice(0, 10); // Limita aos primeiros 10

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
