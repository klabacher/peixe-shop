import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  query, 
  where,
  orderBy,
  limit,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';

// In-memory cache to reduce Firestore reads (EXTREME COST SAVING)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Products Collection
export async function getProducts() {
  const cacheKey = 'products_all';
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  const snapshot = await getDocs(collection(db, 'products'));
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  setCache(cacheKey, products);
  return products;
}

export async function getProductById(productId: string) {
  const cacheKey = `product_${productId}`;
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;

  const docRef = doc(db, 'products', productId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  
  const product = { id: snapshot.id, ...snapshot.data() };
  setCache(cacheKey, product);
  return product;
}

export async function getProductsByCategory(category: string) {
  const cacheKey = `products_category_${category}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  const q = query(
    collection(db, 'products'),
    where('category', '==', category),
    limit(50) // Limit results to reduce reads
  );
  const snapshot = await getDocs(q);
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  setCache(cacheKey, products);
  return products;
}

// Orders Collection (minimize writes)
export async function createOrder(orderData: {
  userId?: string;
  items: any[];
  total: number;
  customerInfo: any;
}) {
  // Single write operation
  const orderRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  return orderRef.id;
}

export async function getUserOrders(userId: string, limitCount = 10) {
  const cacheKey = `orders_user_${userId}_${limitCount}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  setCache(cacheKey, orders);
  return orders;
}

// Batch operations to minimize writes
export async function batchUpdateProducts(updates: Array<{ id: string; data: any }>) {
  const batch = writeBatch(db);
  updates.forEach(({ id, data }) => {
    const ref = doc(db, 'products', id);
    batch.update(ref, data);
  });
  await batch.commit();
  // Invalidate cache
  cache.clear();
}

// Clear cache manually if needed
export function clearFirestoreCache() {
  cache.clear();
}
