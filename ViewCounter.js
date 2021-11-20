import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js'
import {getDatabase, ref, set, get} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-database.js'

let fireAddress = "fireAssignments/Materials Report";
let config = {
  apiKey: "AIzaSyAwKRqxNdoO05hLlGZwb5AgWugSBzruw6A",
  authDomain: "myaccounts-4a6c7.firebaseapp.com",
  databaseURL: "https://myaccounts-4a6c7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "myaccounts-4a6c7",
  storageBucket: "myaccounts-4a6c7.appspot.com",
  messagingSenderId: "678570989696",
  appId: "1:678570989696:web:ca70c09476d4c5f627ee65"
};

const APP = initializeApp(config);
const DB = getDatabase(APP);

let count = 0;

async function incCount(){
  let countRef = ref(DB, "myPortfolio/views");
  let oldCount = (await get(countRef)).val();
  count = oldCount + 1;
  await set(countRef, count);
}

incCount();

export {count}
