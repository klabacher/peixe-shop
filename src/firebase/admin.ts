import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';
import { clearFirestoreCache } from './firestore';
import type { StoreSettings } from '../types/product';

// Create Product (Admin only - validated by security rules)
export async function createProduct(productData: {
  name: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  unit: string;
  description: string;
  stock: number;
  image?: string;
  isBestSeller?: boolean;
}) {
  const docRef = await addDoc(collection(db, 'products'), {
    ...productData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  clearFirestoreCache();
  return docRef.id;
}

// Update Product (Admin only - validated by security rules)
export async function updateProduct(productId: string, productData: any) {
  const docRef = doc(db, 'products', productId);
  await updateDoc(docRef, {
    ...productData,
    updatedAt: serverTimestamp(),
  });
  
  clearFirestoreCache();
}

// Delete Product (Admin only - validated by security rules)
export async function deleteProduct(productId: string) {
  const docRef = doc(db, 'products', productId);
  await deleteDoc(docRef);
  
  clearFirestoreCache();
}

// Update stock (useful for inventory management)
export async function updateStock(productId: string, newStock: number) {
  const docRef = doc(db, 'products', productId);
  await updateDoc(docRef, {
    stock: newStock,
    updatedAt: serverTimestamp(),
  });
  
  clearFirestoreCache();
}

// Batch update multiple products
export async function batchUpdateStock(updates: Array<{ id: string; stock: number }>) {
  const promises = updates.map(({ id, stock }) => updateStock(id, stock));
  await Promise.all(promises);
}

// Update Store Settings (Admin only)
export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<void> {
  const docRef = doc(db, 'settings', 'store');
  await setDoc(docRef, {
    ...settings,
    updatedAt: serverTimestamp(),
  }, { merge: true });
  
  clearFirestoreCache();
}
