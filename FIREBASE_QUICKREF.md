# Firebase Quick Reference

## 🚀 Essential Commands

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize project
firebase init

# Deploy rules only
firebase deploy --only firestore:rules

# Deploy hosting
firebase deploy --only hosting

# View logs
firebase functions:log
```

## 📝 Environment Variables

Add to `.env.local`:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_OFFLINE_PERSISTENCE=true
```

## 🔥 Common Operations

### Authentication
```typescript
// Anonymous (FREE)
import { signInAnonymous } from './firebase';
await signInAnonymous();

// Email/Password
import { signUpWithEmail, signInWithEmail } from './firebase';
await signUpWithEmail('user@example.com', 'password');
await signInWithEmail('user@example.com', 'password');

// Sign Out
import { signOut } from './firebase';
await signOut();

// Get Current User
import { getCurrentUser } from './firebase';
const user = getCurrentUser();

// Listen to Auth Changes
import { onAuthChange } from './firebase';
const unsubscribe = onAuthChange((user) => {
  console.log('User:', user);
});
```

### Firestore - Products
```typescript
// Get all products (CACHED)
import { getProducts } from './firebase';
const products = await getProducts();

// Get by category (CACHED)
import { getProductsByCategory } from './firebase';
const fish = await getProductsByCategory('Peixes');

// Get single product (CACHED)
import { getProductById } from './firebase';
const product = await getProductById('productId');
```

### Firestore - Orders
```typescript
// Create order (SINGLE WRITE)
import { createOrder } from './firebase';
const orderId = await createOrder({
  userId: user?.uid,
  items: [
    { id: '1', name: 'Salmão', price: 89.90, quantity: 2 }
  ],
  total: 179.80,
  customerInfo: {
    name: 'João Silva',
    phone: '11999999999'
  }
});

// Get user orders (CACHED)
import { getUserOrders } from './firebase';
const orders = await getUserOrders(userId, 10);
```

### React Hooks
```typescript
// Auth Hook
import { useAuth } from './firebase';
function MyComponent() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return user ? <Profile /> : <Login />;
}

// Products Hook
import { useProducts } from './firebase';
function ProductList() {
  const { products, loading, error } = useProducts();
  return products.map(p => <ProductCard key={p.id} product={p} />);
}

// Category Products Hook
import { useProductsByCategory } from './firebase';
function CategoryView() {
  const { products, loading, error } = useProductsByCategory('Peixes');
  return <ProductGrid products={products} />;
}

// Orders Hook
import { useUserOrders } from './firebase';
function OrderHistory() {
  const { orders, loading, error } = useUserOrders(user?.uid);
  return orders.map(o => <OrderCard key={o.id} order={o} />);
}

// Create Order Hook
import { useCreateOrder } from './firebase';
function Checkout() {
  const { submitOrder, loading, error } = useCreateOrder();
  
  const handleSubmit = async () => {
    const orderId = await submitOrder({...orderData});
    console.log('Order created:', orderId);
  };
  
  return <Button onClick={handleSubmit} loading={loading}>Submit</Button>;
}
```

## 🎯 Cost Optimization Tips

### DO ✅
```typescript
// Cache results
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Use offline persistence
enableIndexedDbPersistence(db);

// Limit queries
query(collection(db, 'products'), limit(50));

// Batch writes
const batch = writeBatch(db);
batch.update(ref1, data1);
batch.update(ref2, data2);
await batch.commit(); // Single operation

// Use getDocs() not onSnapshot()
const snapshot = await getDocs(query);
```

### DON'T ❌
```typescript
// NO real-time listeners
onSnapshot(query, (snapshot) => { /* EXPENSIVE */ });

// NO unlimited queries
getDocs(collection(db, 'products')); // Missing limit()

// NO multiple writes
await setDoc(ref1, data1); // Write 1
await setDoc(ref2, data2); // Write 2
await setDoc(ref3, data3); // Write 3
// Use batch instead!

// NO client-side product writes
// Update via Console or Admin SDK only
```

## 📊 Monitoring Usage

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Firestore → Usage tab
4. Check daily stats:
   - Reads
   - Writes
   - Deletes
   - Storage

**Target:** < 10% of free tier daily

## 🔒 Security Rules Reference

```javascript
// Products - Read only
match /products/{productId} {
  allow read: if true;
  allow write: if false; // Admin only
}

// Orders - Create only
match /orders/{orderId} {
  allow create: if true;
  allow read: if request.auth.uid == resource.data.userId;
  allow update, delete: if false;
}

// Users - Own data only
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```

## 🐛 Troubleshooting

### Firebase not initialized
```typescript
import { initializeFirebase } from './firebase';
initializeFirebase(); // Call in main.tsx
```

### Permission denied
- Check `firestore.rules`
- Deploy rules: `firebase deploy --only firestore:rules`
- Verify user is authenticated

### Too many reads
- Check cache is working
- Verify offline persistence enabled
- Add more aggressive caching (increase TTL)

### Import errors
```typescript
// Wrong
import { db } from 'firebase/firestore';

// Correct
import { db } from './firebase';
```

## 📱 Production Checklist

- [ ] Environment variables set
- [ ] Security rules deployed
- [ ] Products collection seeded
- [ ] Offline persistence enabled
- [ ] Cache TTL configured
- [ ] Budget alerts set (optional)
- [ ] Test order flow
- [ ] Monitor usage for 1 week

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com)
- [Firestore Pricing](https://firebase.google.com/pricing)
- [Firestore Quotas](https://firebase.google.com/docs/firestore/quotas)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

**Remember:** With proper caching, you can serve 10,000+ users/month on the free tier! 🎉
