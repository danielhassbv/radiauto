import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { doc, setDoc } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import { lastValueFrom } from 'rxjs';

// ✅ Defina aqui a interface para que o TypeScript entenda os campos do Firebase
interface ProdutoFirebase {
    CODPRO: string;
    DESCPRO: string;
    PRVAPRO: string | number;
    QTDPRO: string | number;
    DETALHE?: string;
}

@Injectable({ providedIn: 'root' })
export class FirebaseSyncService {

    constructor(private http: HttpClient) { }

    async sincronizarProdutosFilialParaSupabase() {
        const supabaseUrl = 'https://vflhnhwdwmlaebrfibeq.supabase.co/rest/v1/produtos';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmbGhuaHdkd21sYWVicmZpYmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMDExMzgsImV4cCI6MjA2NTc3NzEzOH0.4_Ot8EA7TMXdyg6Y7Y1wBsOejQFZAizT8F0ffOOy5BM'; // ⚡ troque pela chave anon correta do Supabase

        try {
            // 1. Ler CSV
            const csvText = await lastValueFrom(
                this.http.get('assets/produtos.csv', { responseType: 'text' })
            );
            const separador = csvText.includes(';') ? ';' : ',';
            const linhas = csvText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

            if (linhas.length < 2) {
                alert('⚠️ CSV vazio ou inválido.');
                return;
            }

            const cabecalho = linhas[0].split(separador).map(c => c.trim().toLowerCase());
            const produtosCSV = linhas.slice(1).map(linha => {
                const valores = linha.split(separador).map(v => v.trim());
                const obj: any = {};
                cabecalho.forEach((col, i) => {
                    obj[col] = valores[i] ?? '';
                });
                return obj;
            });

            const codigos = produtosCSV
                .map(p => p['código']?.toString().trim().replace(/^0+/, '').toUpperCase())
                .filter(c => !!c);

            console.log(`📌 CSV: ${codigos.length} códigos lidos`);

            // 2. Buscar dados no Firebase RTDB
            const rtdbUrl = 'https://radiauto-project-default-rtdb.firebaseio.com/produtosFilial1.json';
            const dadosRTDB: any = await lastValueFrom(this.http.get(rtdbUrl));

            const todosProdutos: ProdutoFirebase[] = dadosRTDB ? Object.values(dadosRTDB) : [];
            console.log(`📦 Firebase retornou: ${todosProdutos.length} produtos`);

            // 3. Montar lista completa para envio
            const produtosMap = new Map();

            for (const csvProd of produtosCSV) {
                const codigoCSV = csvProd['código']?.toString().trim().replace(/^0+/, '').toUpperCase();
                const nomeCSV = csvProd['produto']?.toString().trim();

                let produto = todosProdutos.find((p: ProdutoFirebase) =>
                    p.CODPRO?.toString().trim().replace(/^0+/, '').toUpperCase() === codigoCSV
                );

                // fallback pelo nome
                if (!produto && nomeCSV) {
                    produto = todosProdutos.find((p: ProdutoFirebase) =>
                        (p.DESCPRO?.toString().trim().toUpperCase() || '') === nomeCSV.toUpperCase()
                    );
                }

                // monta registro mesmo sem match
                const id = codigoCSV || nomeCSV || `sem-id-${Math.random().toString(36).slice(2, 9)}`;

                produtosMap.set(id, {
                    id: id,
                    nome: produto?.DESCPRO?.trim() || nomeCSV || 'Sem nome',
                    preco: produto?.PRVAPRO
                        ? parseFloat(produto.PRVAPRO.toString().replace(',', '.'))
                        : 0,
                    quantidade: produto?.QTDPRO
                        ? parseInt(produto.QTDPRO.toString())
                        : 0,
                    descricao: produto?.DETALHE?.trim() || ''
                });
            }

            const produtosParaSupabase = Array.from(produtosMap.values());
            console.log(`✅ Total para envio ao Supabase: ${produtosParaSupabase.length}`);

            // 4. Enviar em lotes para Supabase
            const headers = new HttpHeaders({
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            });

            const chunkSize = 100;
            for (let i = 0; i < produtosParaSupabase.length; i += chunkSize) {
                const chunk = produtosParaSupabase.slice(i, i + chunkSize);
                await lastValueFrom(this.http.post(supabaseUrl, chunk, { headers }));
                console.log(`🚀 Lote ${i / chunkSize + 1} enviado com ${chunk.length} produtos`);
            }

            alert(`✅ Todos os ${produtosParaSupabase.length} produtos enviados/atualizados no Supabase.`);

        } catch (error: any) {
            console.error('❌ Erro ao enviar produtos para Supabase:', error);
            if (error.error) console.error('Detalhes do erro:', error.error);
            alert('❌ Erro ao exportar. Veja os logs no console.');
        }
    }
    async sincronizarProdutosFilialParaFirestore() {
        try {
            // 1. Carregar CSV dos assets
            const csvText = await lastValueFrom(
                this.http.get('assets/produtos.csv', { responseType: 'text' })
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

