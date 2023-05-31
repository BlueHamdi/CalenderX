import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, getDocs, doc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAyBZP0c2ZgBqPVgtbV9ffo6RegJCysxg",
  authDomain: "calenderx-3bdef.firebaseapp.com",
  projectId: "calenderx-3bdef",
  storageBucket: "calenderx-3bdef.appspot.com",
  messagingSenderId: "356144504007",
  appId: "1:356144504007:web:9b6a5c5a0c34535d1372e2",
  measurementId: "G-0YG9X3TVN8"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app)


const addEvent = async (event) => {
  const docRef = await addDoc(collection(db, "events"),
    event
  )
}

const getEvents = async () => {
  return new Promise(async (resolve, reject) => {
    const q = query(collection(db, "events"));

    const querySnapshot = await getDocs(q);

    var results = []

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      var data = doc.data()
      var eventObj = {
        id: doc.id,
        date: data.date,
        title: data.title,
        endTime: data.endTime,
        startTime: data.startTime
      }
      results.push(eventObj);
    });

    resolve(results);
  });
}

const deleteEvent = async (id) => {
  console.log("deleted event with id:", id)
  await deleteDoc(doc(db, "events", id));
}

export { db, addEvent, getEvents, deleteEvent }