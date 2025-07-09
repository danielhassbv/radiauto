import { Injectable } from '@angular/core';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config'; // ✅ use seu config

@Injectable({ providedIn: 'root' })
export class UsuarioService {

    async listarUsuarios() {
        const snap = await getDocs(collection(db, 'usuarios'));
        return snap.docs.map(doc => doc.data());
    }

    async removerUsuario(uid: string) {
        await deleteDoc(doc(db, 'usuarios', uid));
    }
}
