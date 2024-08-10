import { updateDoc, doc } from "firebase/firestore";
import { collectionName, db, documentId } from "./firebase";
import { AppSettings } from "./model";

export const putData = async (dataToUpdate: Partial<AppSettings>) => {
  await updateDoc(doc(db, collectionName, documentId), dataToUpdate);
};
