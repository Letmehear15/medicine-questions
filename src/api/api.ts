import {updateDoc, doc } from "firebase/firestore"; 
import { collectionName, db, documentId } from "./firebase";
import { AppSettings } from "./model";

export const putData = async (dataToUpdate: Partial<AppSettings>) => {
    console.log('asdsads');
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log('asdsads');
        
        return 
    }
    await updateDoc(doc(db, collectionName,documentId), dataToUpdate);
}