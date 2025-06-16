// firebase.js
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC2zL7ozRgQ9mEAY_1IFYkweHnDa86iamw",
  authDomain: "macdonakds-eb8e7.firebaseapp.com",
  projectId: "macdonakds-eb8e7",
  storageBucket: "macdonakds-eb8e7.firebasestorage.app",
  messagingSenderId: "135484060912",
  appId: "1:135484060912:web:ce14467b4a21dda8dcfe35",
  measurementId: "G-VCFWF3027T"
  
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const database = getDatabase(app);

export async function addData(data: any) {
  localStorage.setItem('visitor', data.id);

const userID=localStorage.getItem('visitor')
if(userID){
  try {
    const docRef = await doc(db, 'pays',userID!);
    await setDoc(docRef, data,{merge:true});

    console.log('Document written with ID: ', docRef.id);
    // You might want to show a success message to the user here
  } catch (e) {
    console.error('Error adding document: ', e);
    // You might want to show an error message to the user here
} 
}
}
export const handlePay = async (paymentInfo: any, setPaymentInfo: any) => {
  try {
    const visitorId =paymentInfo.id;
    if (visitorId) {
      const docRef = doc(db, 'pays', visitorId);
      await setDoc(
        docRef,
        { ...paymentInfo, status: 'pending' },
        { merge: true }
      );
      setPaymentInfo((prev: any) => ({ ...prev, status: 'pending' }));
    }
  } catch (error) {
    console.error('Error adding document: ', error);
    alert('Error adding payment info to Firestore');
  }
};
export { db,database };
