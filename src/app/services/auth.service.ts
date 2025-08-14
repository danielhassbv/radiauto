import { Injectable } from '@angular/core';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  getAdditionalUserInfo,
  signOut,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public usuario: any = null;

  constructor(private router: Router) {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const ref = doc(db, 'usuarios', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          this.usuario = { uid: user.uid, ...snap.data() };
          localStorage.setItem('usuario', JSON.stringify(this.usuario));

          // expira em 2h
          const expiracao = new Date().getTime() + 2 * 60 * 60 * 1000;
          localStorage.setItem('expiracaoSessao', expiracao.toString());
        }
      } else {
        this.usuario = null;
        localStorage.removeItem('usuario');
        localStorage.removeItem('expiracaoSessao');
      }
    });
  }

  async login(email: string, senha: string) {
    const cred = await signInWithEmailAndPassword(auth, email, senha);
    const ref = doc(db, 'usuarios', cred.user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) throw new Error('Usuário não encontrado');

    const dados = snap.data();
    this.usuario = { uid: cred.user.uid, ...dados };
    localStorage.setItem('usuario', JSON.stringify(this.usuario));

    const expiracao = new Date().getTime() + 2 * 60 * 60 * 1000;
    localStorage.setItem('expiracaoSessao', expiracao.toString());

    // Redireciona conforme role
    if (dados['role'] === 'admin') {
      this.router.navigate(['/painel-admin']);
    } else {
      this.router.navigate(['/painel-cliente']);
    }
  }

  async registrar(email: string, senha: string, role: 'admin' | 'cliente' = 'cliente') {
    const cred = await createUserWithEmailAndPassword(auth, email, senha);
    await setDoc(doc(db, 'usuarios', cred.user.uid), {
      email: cred.user.email,
      uid: cred.user.uid,
      role: role, // atribui role no cadastro
      criadoEm: new Date(),
    });
    return cred;
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
        role: 'cliente',
        criadoEm: new Date(),
        via: 'google',
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
      localStorage.removeItem('usuario');
      localStorage.removeItem('expiracaoSessao');
      this.router.navigate(['/login']);
    });
  }

  isLogado(): boolean {
    const user = localStorage.getItem('usuario');
    const exp = localStorage.getItem('expiracaoSessao');
    if (!user || !exp) return false;

    // verifica expiração
    if (new Date().getTime() > Number(exp)) {
      this.logout();
      return false;
    }
    return true;
  }

  getUsuario() {
    return this.usuario || JSON.parse(localStorage.getItem('usuario') || 'null');
  }
}
