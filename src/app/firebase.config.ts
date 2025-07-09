import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { environment } from '../environments/environment'; // ajuste o caminho se necessário

const app = initializeApp(environment.firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };