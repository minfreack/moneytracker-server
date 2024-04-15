const admin =  require('./admin');

const firebaseBucket = process.env.FIREBASE_BUCKET;

const db = admin.firestore();

const store = admin.storage().bucket(firebaseBucket);

const auth = admin.auth();


module.exports = { auth, db, store };
