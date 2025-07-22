import { Injectable } from '@angular/core';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    User,
    getAdditionalUserInfo,
    signOut
} from 'firebase/auth';

import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    public usuario: User | null = null;

    constructor(private router: Router) {
        onAuthStateChanged(auth, (user) => {
            this.usuario = user;
        });
    }

    login(email: string, senha: string) {
        return signInWithEmailAndPassword(auth, email, senha);
    }

    registrar(email: string, senha: string) {
        return createUserWithEmailAndPassword(auth, email, senha)
            .then(async cred => {
                await setDoc(doc(db, 'usuarios', cred.user.uid), {
                    email: cred.user.email,
                    uid: cred.user.uid,
                    criadoEm: new Date()
                });
            });
    }

    async loginComGoogle() {
        const provider = new GoogleAuthProvider();
        const cred = await signInWithPopup(auth, provider);

        const isNovoUsuario = getAdditionalUserInfo(cred)?.isNewUser;

        if (isNovoUsuario) {
            await setDoc(doc(db, 'usuarios', cred.user.uid), {
                email: cred.user.email,
                uid: cred.user.uid,
                nome: cred.user.displayName || '',
                criadoEm: new Date(),
                via: 'google'
            });
        }

        return cred;
    }

    redefinirSenha(email: string) {
        return sendPasswordResetEmail(auth, email);
    }

    logout() {
        return signOut(auth).then(() => {
            this.usuario = null;
            this.router.navigate(['/']);
        });
    }

    isLogado(): boolean {
        return this.usuario !== null;
    }
}
