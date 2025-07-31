import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { doc, setDoc } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseSyncService {

    constructor(private http: HttpClient) { }

    // ✅ Sincronizar RTDB para Supabase
    async sincronizarRTDBParaSupabase() {
        const rtdbUrl = 'https://radiauto-project-default-rtdb.firebaseio.com/produtosFilial1.json';

        const supabaseUrl = 'https://vflhnhwdwmlaebrfibeq.supabase.co/rest/v1/produtos';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmbGhuaHdkd21sYWVicmZpYmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMDExMzgsImV4cCI6MjA2NTc3NzEzOH0.4_Ot8EA7TMXdyg6Y7Y1wBsOejQFZAizT8F0ffOOy5BM';

        try {
            const dadosRTDB: any = await this.http.get(rtdbUrl).toPromise();
            if (!dadosRTDB) {
                console.warn('⚠️ Nenhum dado encontrado na tabela produtosFilial1.');
                return;
            }

            const produtos = Object.keys(dadosRTDB).map((id) => ({
                id,
                codpro: dadosRTDB[id].CODPRO,
                descpro: dadosRTDB[id].DESCPRO,
                prvapro: dadosRTDB[id].PRVAPRO,
                qtdpro: dadosRTDB[id].QTDPRO,
            }));

            const headers = new HttpHeaders({
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            });

            for (const produto of produtos) {
                try {
                    console.log('➡️ Enviando para Supabase:', produto);
                    await this.http.post(supabaseUrl, produto, { headers }).toPromise();
                    console.log(`✅ Enviado: ${produto.codpro}`);
                } catch (erro) {
                    console.error(`❌ Erro ao enviar ${produto.codpro}`, erro);
                }
            }

            console.log('🚀 Sincronização concluída com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao sincronizar com o Supabase:', error);
        }
    }

    // ✅ Sincronizar TABPRO → Firestore (teste de 10 itens)
    async sincronizarTABPROparaFirestore() {
        const rtdbUrl = 'https://radiauto-project-default-rtdb.firebaseio.com/TABPRO.json';

        try {
            const dados: any = await lastValueFrom(this.http.get(rtdbUrl));
            if (!dados) {
                alert('⚠️ Nenhum dado encontrado.');
                return;
            }

            const entradas = Object.entries(dados).slice(0, 10);

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
async sincronizarProdutosFilialParaFirestore() {
    try {
        // 1. Carregar CSV dos assets
        const csvText = await lastValueFrom(
            this.http.get('assets/produtos=final.csv', { responseType: 'text' })
        );

        // Detectar separador automaticamente
        const separador = csvText.includes(';') ? ';' : ',';

        // Quebrar linhas e filtrar linhas úteis
        const linhas = csvText
            .split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 0);

        if (linhas.length < 2) {
            alert('⚠️ O arquivo CSV está vazio ou inválido.');
            return;
        }

        // Ler cabeçalho (colunas em minúsculas sem espaços)
        const cabecalho = linhas[0]
            .split(separador)
            .map(c => c.trim().toLowerCase());

        // Converter linhas em objetos
        const produtosCSV = linhas.slice(1).map(linha => {
            const valores = linha.split(separador).map(v => v.trim());
            const obj: any = {};
            cabecalho.forEach((col, i) => {
                obj[col] = valores[i] ?? ''; // evita undefined
            });
            return obj;
        });

        // Normalizar CODPRO do CSV
        const codigos = produtosCSV
            .map(p => p['codpro']?.toString().trim().replace(/^0+/, ''))
            .filter(c => !!c); // remove nulos/undefined

        console.log("📝 Cabeçalho CSV:", cabecalho);
        console.log("📦 Produtos válidos no CSV:", codigos.length);
        console.log("🔎 Exemplo de códigos CSV:", codigos.slice(0, 10));

        // 2. Buscar todos produtos do RTDB
        const rtdbUrl = 'https://radiauto-project-default-rtdb.firebaseio.com/produtosFilial1.json';
        const dadosRTDB: any = await lastValueFrom(this.http.get(rtdbUrl));

        if (!dadosRTDB) {
            alert('⚠️ Nenhum dado encontrado em produtosFilial1.');
            return;
        }

        console.log("📊 Amostra do RTDB:", Object.values(dadosRTDB).slice(0, 5));

        // 3. Filtrar apenas os que estão no CSV
        const produtosFiltrados = Object.values(dadosRTDB).filter((p: any) => {
            const codigoRTDB = p.CODPRO?.toString().trim().replace(/^0+/, '');
            return codigos.includes(codigoRTDB);
        });

        console.log(`✅ Encontrados ${produtosFiltrados.length} produtos correspondentes`);

        if (produtosFiltrados.length === 0) {
            console.warn("⚠️ Nenhum produto encontrado. Verifique se a coluna CODPRO existe no CSV e bate com o RTDB.");
            alert("⚠️ Nenhum produto encontrado. Veja os logs no console.");
            return;
        }

        // 4. Criar/atualizar coleção 'produtos'
        const promises = produtosFiltrados.map(async (produto: any) => {
            const id = produto.CODPRO?.toString().trim().replace(/^0+/, '');
            if (!id) return;

            const docRef = doc(db, 'produtos', id);
            const dados = {
                id,
                nome: produto.DESCPRO?.trim() || '',
                preco: parseFloat(produto.PRVAPRO) || 0,
                quantidade: parseInt(produto.QTDPRO) || 0
            };
            await setDoc(docRef, dados, { merge: false });
            console.log(`🔥 Produto ${id} salvo no Firestore`);
        });

        await Promise.all(promises);
        alert(`🚀 Migração concluída! ${produtosFiltrados.length} produtos salvos no Firestore.`);
    } catch (error) {
        console.error('❌ Erro ao sincronizar produtos:', error);
        alert('❌ Erro ao migrar produtos. Veja os logs no console.');
    }
}

async sincronizarProdutosFirestoreParaSupabase() {
    const supabaseUrl = 'https://vflhnhwdwmlaebrfibeq.supabase.co/rest/v1/produtos';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmbGhuaHdkd21sYWVicmZpYmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMDExMzgsImV4cCI6MjA2NTc3NzEzOH0.4_Ot8EA7TMXdyg6Y7Y1wBsOejQFZAizT8F0ffOOy5BM';

    try {
        // 1. Buscar todos os produtos do Firestore
        const produtosRef = collection(db, 'produtos');
        const snapshot = await getDocs(produtosRef);

        if (snapshot.empty) {
            alert('⚠️ Nenhum produto encontrado no Firestore.');
            return;
        }

        const produtos: any[] = [];
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            produtos.push({
                id: data['id'],
                nome: data['nome'],
                preco: data['preco'],
                quantidade: data['quantidade']
            });
        });

        console.log(`📦 Exportando ${produtos.length} produtos para o Supabase...`);

        // 2. Configurar headers do Supabase
        const headers = new HttpHeaders({
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
        });

        // 3. Enviar em lote para o Supabase
        await this.http.post(supabaseUrl, produtos, { headers }).toPromise();

        alert(`🚀 Exportação concluída! ${produtos.length} produtos enviados ao Supabase.`);
        console.log('✅ Dados enviados:', produtos);

    } catch (error) {
        console.error('❌ Erro ao exportar produtos para Supabase:', error);
        alert('❌ Erro ao exportar para Supabase. Veja logs no console.');
    }
}
}

