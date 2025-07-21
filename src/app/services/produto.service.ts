import { Injectable } from '@angular/core';
import {
    Firestore,
    collection,
    collectionData,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
} from '@angular/fire/firestore';
import { Produto } from '../models/produto.model';
import { Observable } from 'rxjs';
import {
    Storage,
    ref,
    uploadBytes,
    getDownloadURL,
} from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
    private colecao: any;

    constructor(private firestore: Firestore, private storage: Storage) {
        this.colecao = collection(this.firestore, 'produtos');
    }

    async uploadImagem(file: File): Promise<string> {
        const caminho = `produtos/${crypto.randomUUID()}_${file.name}`;
        const storageRef = ref(this.storage, caminho);
        const snapshot = await uploadBytes(storageRef, file);
        return getDownloadURL(snapshot.ref);
    }

    getProdutos(): Observable<Produto[]> {
        return collectionData(this.colecao, { idField: 'id' }) as Observable<
            Produto[]
        >;
    }

    adicionar(produto: Produto): Promise<any> {
        return addDoc(this.colecao, produto);
    }

    atualizar(produto: Produto): Promise<void> {
        const docRef = doc(this.firestore, `produtos/${produto.id}`);
        const { id, ...dados } = produto;
        return updateDoc(docRef, dados);
    }

    deletar(id: string): Promise<void> {
        const docRef = doc(this.firestore, `produtos/${id}`);
        return deleteDoc(docRef);
    }
}
