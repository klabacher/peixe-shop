# Peixe Shop - React + Vite + Firebase

A modern e-commerce shop with **zero-cost Firebase backend** implementation.

## 🔐 Admin Dashboard

Complete admin panel for managing products and categories:
- **Access:** `/admin/login`
- **Features:** Create, Edit, Delete products
- **Security:** Email whitelist + protected routes
- **Mobile:** Fully responsive

[📖 Admin Guide](./ADMIN_GUIDE.md) - Complete admin documentation

### Quick Admin Setup
```bash
# 1. Access admin login
http://localhost:5173/admin/login

# 2. Create admin account with your email

# 3. Add your email to whitelist
# Edit: src/components/ProtectedRoute.tsx
const ADMIN_EMAILS = ['youremail@example.com'];

# 4. Deploy security rules
firebase deploy --only firestore:rules
```

---

## 🔥 Firebase Features (Zero Monthly Cost)

This project includes a **fully optimized Firebase setup** designed to stay within the free tier:

- ✅ **Authentication** (Anonymous + Email/Password)
- ✅ **Firestore Database** (with aggressive caching)
- ✅ **Security Rules** (production-ready)
- ✅ **Hosting** (optional)
- ✅ **Offline Support** (reduces reads by 90%)

### Cost Optimization Features
- 5-minute client-side cache
- Offline persistence enabled
- No real-time listeners
- Batch operations
- Query limits
- Read-only products from client

**Expected Usage:** < 5% of free tier limits 🎉

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Setup
```bash
# Copy environment template
cp .env.example .env.local

# Add your Firebase config to .env.local
# Get config from: https://console.firebase.google.com
```

### 3. Configure Firebase Project
See **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** for detailed instructions:
- Create Firebase project
- Enable Firestore & Auth
- Deploy security rules
- Seed product data

### 4. Run Development Server
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── firebase/
│   ├── config.ts          # Firebase initialization
│   ├── auth.ts            # Authentication helpers
│   ├── firestore.ts       # Database operations (with caching)
│   ├── hooks.ts           # React hooks for Firebase
│   └── index.ts           # Exports
├── components/
│   ├── AuthExample.tsx    # Auth demo
│   ├── FirestoreProductsExample.tsx
│   ├── OrderExample.tsx
│   └── ...
├── context/
│   └── CartContext.tsx
└── pages/
    ├── HomePage.tsx
    └── CartPage.tsx
```

## 🔒 Security

Firestore security rules included:
- Products: Read-only from client
- Orders: Create-only (users can't modify after creation)
- Users: Can only access own data

## 📊 Firebase Usage Monitoring

Monitor your usage at [Firebase Console](https://console.firebase.google.com):
- Firestore reads/writes/deletes
- Auth monthly active users
- Hosting bandwidth

**Target:** Stay under 10% of free tier limits

## 🛠️ Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code

# Firebase
firebase deploy --only firestore:rules  # Deploy security rules
firebase deploy --only hosting          # Deploy to Firebase Hosting
```

## 💰 Cost Breakdown

### Free Tier Limits
- **Firestore:** 50K reads, 20K writes per day
- **Auth:** 50K MAU (Monthly Active Users)
- **Hosting:** 10GB storage, 360MB/day transfer

### With Optimization
- **Daily Reads:** ~500-1,000 (< 2% of limit)
- **Daily Writes:** ~100-200 (< 1% of limit)
- **Monthly Cost:** **$0.00** 🎉

## 📚 Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md) - Complete setup instructions
- [Cost Optimization Tips](./FIREBASE_SETUP.md#-cost-saving-strategies-implemented)
- [Security Best Practices](./FIREBASE_SETUP.md#-security-best-practices)

## 🎓 Usage Examples

### Authentication
```typescript
import { signInAnonymous, useAuth } from './firebase';

function MyComponent() {
  const { user, loading } = useAuth();
  
  const handleSignIn = async () => {
    await signInAnonymous(); // Free, unlimited
  };
  
  return user ? <div>Signed in!</div> : <Button onClick={handleSignIn}>Sign In</Button>;
}
```

### Products (Cached)
```typescript
import { useProducts } from './firebase';

function ProductList() {
  const { products, loading, error } = useProducts();
  
  // Data cached for 5 minutes
  return products.map(p => <ProductCard key={p.id} product={p} />);
}
```

### Orders (Minimal Writes)
```typescript
import { createOrder } from './firebase';

const orderId = await createOrder({
  userId: user?.uid,
  items: cartItems,
  total: 99.99,
  customerInfo: { name, phone }
});
```

## 🚀 Deployment

### Firebase Hosting (Free)
```bash
npm run build
firebase deploy
```

### Other Platforms
- **Vercel:** Connect GitHub repo
- **Netlify:** Connect GitHub repo
- **Cloudflare Pages:** Connect GitHub repo

All support Firebase without extra cost!

## 🤝 Contributing

Contributions welcome! Please:
1. Keep cost optimizations intact
2. Test with Firebase before submitting
3. Update documentation if needed

## 📄 License

MIT

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
