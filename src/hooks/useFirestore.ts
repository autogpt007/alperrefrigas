import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useFirestore = () => {
  // Get all documents from a collection
  const getCollection = async (collectionName: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting collection:', error);
      throw error;
    }
  };

  // Get a single document
  const getDocument = async (collectionName: string, documentId: string) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  };

  // Add a document
  const addDocument = async (collectionName: string, data: any) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  };

  // Update a document
  const updateDocument = async (collectionName: string, documentId: string, data: any) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  };

  // Delete a document
  const deleteDocument = async (collectionName: string, documentId: string) => {
    try {
      await deleteDoc(doc(db, collectionName, documentId));
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  };

  // Real-time subscription to a collection
  const subscribeToCollection = (collectionName: string, callback: (data: any[]) => void) => {
    const unsubscribe = onSnapshot(collection(db, collectionName), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(data);
    });
    
    return unsubscribe;
  };

  return {
    getCollection,
    getDocument,
    addDocument,
    updateDocument,
    deleteDocument,
    subscribeToCollection
  };
};