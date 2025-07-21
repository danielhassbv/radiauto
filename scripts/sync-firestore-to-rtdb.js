const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // veja abaixo como gerar

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://SEU-PROJETO.firebaseio.com"
});

const firestore = admin.firestore();
const rtdb = admin.database();

async function transferirDados() {
  const snapshot = await firestore.collection('produtos').get();

  const dadosParaRTDB = {};
  snapshot.forEach(doc => {
    dadosParaRTDB[doc.id] = doc.data();
  });

  await rtdb.ref('produtos').set(dadosParaRTDB);
  console.log("Dados transferidos com sucesso!");
}

transferirDados().catch(console.error);
