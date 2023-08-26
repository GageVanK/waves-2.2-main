import {initializeApp} from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC_RxQ_KIv9grrRXiJPYVIwOcUo7IFB71c",
    authDomain: "waves-36df7.firebaseapp.com",
    projectId: "waves-36df7",
    storageBucket: "waves-36df7.appspot.com",
    messagingSenderId: "684152765492",
    appId: "1:684152765492:web:02a061d8ee34c381071e61"
  };
  
  
  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);