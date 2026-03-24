import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  getDocs,
  query,
  where,
  writeBatch,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';
import { clearFirestoreCache, getStoredCategories } from './firestore';
import type { StoreSettings } from '../types/product';

type ProductPayload = {
  name: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  unit: string;
  description: string;
  stock: number;
  image?: string;
  isBestSeller?: boolean;
  isVisible?: boolean;
};

// Create Product (Admin only - validated by security rules)
export async function createProduct(productData: ProductPayload) {
  const docRef = await addDoc(collection(db, 'products'), {
    ...productData,
    isVisible: productData.isVisible ?? true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  clearFirestoreCache();
  return docRef.id;
}

// Update Product (Admin only - validated by security rules)
export async function updateProduct(productId: string, productData: Partial<ProductPayload>) {
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

// ─── Category Management ──────────────────────────────────────────────────────

async function saveCategoryList(list: string[]): Promise<void> {
  const docRef = doc(db, 'settings', 'categories');
  await setDoc(docRef, { list: [...new Set(list)].sort(), updatedAt: serverTimestamp() }, { merge: false });
  clearFirestoreCache();
}

export async function addCategory(name: string): Promise<void> {
  const existing = await getStoredCategories();
  if (existing.map(c => c.toLowerCase()).includes(name.toLowerCase())) {
    throw new Error('Categoria já existe');
  }
  await saveCategoryList([...existing, name]);
}

export async function renameCategory(oldName: string, newName: string): Promise<void> {
  if (!newName.trim()) throw new Error('Nome inválido');
  if (oldName === newName) return;

  // Batch update all products with the old category name
  const q = query(collection(db, 'products'), where('category', '==', oldName));
  const snapshot = await getDocs(q);
  if (snapshot.docs.length > 0) {
    const batch = writeBatch(db);
    snapshot.docs.forEach(d => {
      batch.update(doc(db, 'products', d.id), { category: newName, updatedAt: serverTimestamp() });
    });
    await batch.commit();
  }

  // Update stored categories list
  const existing = await getStoredCategories();
  const updated = existing.map(c => c === oldName ? newName : c);
  // Also add newName if oldName wasn't in the list (product-derived category)
  if (!updated.includes(newName)) updated.push(newName);
  await saveCategoryList(updated.filter(c => c !== oldName || c === newName));
}

export async function deleteCategory(categoryName: string, reassignTo: string): Promise<void> {
  if (!reassignTo.trim()) throw new Error('Selecione uma categoria de destino');
  if (reassignTo === categoryName) throw new Error('A categoria de destino deve ser diferente');

  // Batch update all products to the new category
  const q = query(collection(db, 'products'), where('category', '==', categoryName));
  const snapshot = await getDocs(q);
  if (snapshot.docs.length > 0) {
    const batch = writeBatch(db);
    snapshot.docs.forEach(d => {
      batch.update(doc(db, 'products', d.id), { category: reassignTo, updatedAt: serverTimestamp() });
    });
    await batch.commit();
  }

  // Remove from stored categories list
  const existing = await getStoredCategories();
  await saveCategoryList(existing.filter(c => c !== categoryName));
}

export async function deleteCategoryEmpty(categoryName: string): Promise<void> {
  const existing = await getStoredCategories();
  await saveCategoryList(existing.filter(c => c !== categoryName));
}

