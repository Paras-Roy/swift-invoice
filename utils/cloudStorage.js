import { doc,query,where, setDoc,collection,getDocs, deleteDoc, addDoc } from "firebase/firestore"; 
import { db } from "../config/firebase";

export default async function uploadInvoice1(invoice) {
    try {
        const q = query(collection(db, "invoice1"), where("fileID", "==", invoice.fileID));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // If a document with the specified fileID exists, update it
            const invoiceDoc = querySnapshot.docs[0];
            await setDoc(invoiceDoc.ref, invoice);
            console.log("Document updated with ID: ", invoice.fileID);
        } else {
            // If no document with the specified fileID exists, create a new one
            const newDocRef = await addDoc(collection(db, "invoice1"), invoice);
            console.log("New document created with ID: ", newDocRef.id);
        }
    } catch (e) {
        console.error("Error adding/updating document: ", e);
    }
}


export async function getInvoicesForAuthor(authorID) {
    try {
        const q = query(collection(db, "invoice1"), where("authorID", "==", authorID));
        
        // Get the documents that match the query
        const querySnapshot = await getDocs(q);

        // Extract the data from the documents
        const invoices = querySnapshot.docs.map((doc) => doc.data());

        return invoices;
    } catch (e) {
        console.error("Error getting invoices: ", e);
        return [];
    }
}


export const deleteInvoiceByFileID = async (fileID) => {
    try {
      const q = query(collection(db, 'invoice1'), where('fileID', '==', fileID));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // If a document with the specified fileID exists, delete it
        const invoiceDoc = querySnapshot.docs[0];
        await deleteDoc(invoiceDoc.ref);
        console.log('Document successfully deleted');
      } else {
        console.log('No document found with fileID:', fileID);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };
