import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, signOut, User, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { Router } from '@angular/router';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.config'; // ✅ use seu config

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

    logout() {
        return signOut(auth).then(() => this.router.navigate(['/login']));
    }

    isLogado(): boolean {
        return this.usuario !== null;
    }

    register(email: string, senha: string) {
        return createUserWithEmailAndPassword(auth, email, senha)
            .then(async cred => {
                await setDoc(doc(db, 'usuarios', cred.user.uid), {
                    email: cred.user.email,
                    uid: cred.user.uid,
                    criadoEm: new Date()
                });
            });
    }
}
