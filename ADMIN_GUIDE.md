# 🔐 Admin Dashboard - Complete Guide

## 📋 Overview

The admin dashboard provides a complete interface for managing products and categories with:
- ✅ Secure authentication (email/password only)
- ✅ Protected routes (admin emails only)
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Real-time product management
- ✅ Category organization
- ✅ Stock tracking
- ✅ Cost-optimized (minimal Firebase writes)

---

## 🚀 Quick Start

### 1. Access Admin Panel
Navigate to: **http://localhost:5173/admin/login**

### 2. Create Admin Account
1. Click "Need an account? Sign up"
2. Enter email: `admin@peixeshop.com`
3. Enter password (min 6 characters)
4. Click "Create Account"

### 3. Add Your Email to Whitelist
Edit `src/components/ProtectedRoute.tsx`:

```typescript
const ADMIN_EMAILS = [
  'admin@peixeshop.com',
  'youremail@example.com',  // ← Add your email here
];
```

### 4. Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

---

## 🎯 Features

### Authentication
- **Email/Password only** - No anonymous access
- **Whitelist-based** - Only approved emails can access
- **Secure** - Firebase Authentication + Firestore rules
- **Session persistence** - Stay logged in

### Product Management
- ✅ **Create** products with all details
- ✅ **Edit** existing products
- ✅ **Delete** products (with confirmation)
- ✅ **View** all products in organized list
- ✅ **Track** stock levels with warnings
- ✅ **Set** best sellers and promotions

### Category Management
- ✅ **Auto-created** from products
- ✅ **Statistics** for each category
- ✅ **Organized** alphabetically
- ✅ **Stock totals** per category

### Dashboard Stats
- 📊 Total products count
- 📊 Active categories
- 📊 In-stock items
- 📊 Low stock alerts

---

## 📁 File Structure

```
src/
├── pages/admin/
│   ├── AdminLogin.tsx          # Login/signup page
│   └── AdminDashboard.tsx      # Main dashboard
├── components/
│   ├── ProtectedRoute.tsx      # Route guard
│   └── admin/
│       ├── ProductForm.tsx     # Add/edit product modal
│       ├── ProductList.tsx     # Product display with actions
│       └── CategoryManager.tsx # Category overview
└── firebase/
    └── admin.ts                # Admin CRUD functions
```

---

## 🔒 Security Setup

### 1. Configure Admin Emails

**File:** `src/components/ProtectedRoute.tsx`

```typescript
const ADMIN_EMAILS = [
  'admin@peixeshop.com',
  'manager@peixeshop.com',
  'owner@example.com',
];
```

### 2. Update Firestore Rules

**File:** `firestore.rules`

```javascript
// Admin check function
function isAdmin() {
  return isSignedIn() && 
         request.auth.token.email != null &&
         (request.auth.token.email == 'admin@peixeshop.com' ||
          request.auth.token.email == 'manager@peixeshop.com');
}

// Products - admin write access
match /products/{productId} {
  allow read: if true;
  allow create, update, delete: if isAdmin();
}
```

### 3. Deploy Rules
```bash
firebase deploy --only firestore:rules
```

**⚠️ Important:** Without deploying rules, writes will fail!

---

## 📝 Usage Guide

### Creating a Product

1. **Navigate** to Admin Dashboard
2. **Click** "Add Product" button
3. **Fill in** the form:
   - **Name** - Product name (required)
   - **Category** - Select from dropdown (required)
   - **Price** - Current price in R$ (required)
   - **Original Price** - For showing discounts (optional)
   - **Unit** - kg, un, kit, etc. (required)
   - **Stock** - Quantity available (required)
   - **Description** - Product details (required)
   - **Image URL** - Image path (optional)
   - **Best Seller** - Toggle for featured products
4. **Click** "Create Product"
5. **Wait** for confirmation and refresh

### Editing a Product

1. **Find** product in list
2. **Click** edit icon (✏️)
3. **Update** any fields
4. **Click** "Update Product"
5. **Wait** for confirmation and refresh

### Deleting a Product

1. **Find** product in list
2. **Click** delete icon (🗑️)
3. **Confirm** deletion
4. **Product removed** immediately

### Managing Categories

1. **Navigate** to "Categories" tab
2. **View** all categories with stats
3. **Add** new category name (pre-define)
4. **Categories auto-created** when adding products

---

## 💰 Cost Optimization

### Minimal Writes
- ✅ Single write per product create/update/delete
- ✅ Batch operations for multiple updates
- ✅ Cache cleared strategically
- ✅ No real-time subscriptions

### Expected Usage
| Action | Firestore Writes | Cost |
|--------|------------------|------|
| Create Product | 1 | $0.0001 |
| Update Product | 1 | $0.0001 |
| Delete Product | 1 | $0.0001 |
| 100 daily edits | 100 | $0.01 |

**Monthly estimate (active management):** < $0.50

---

## 🎨 Dashboard Features

### Statistics Cards
```typescript
- Total Products: Count of all products
- Categories: Unique category count
- In Stock: Products with stock > 0
- Low Stock: Products with stock < 10 (warning)
```

### Product List
- **Card layout** with all info
- **Quick actions** (edit/delete)
- **Status chips** (price, stock, best seller)
- **Visual warnings** for low stock
- **Responsive** design

### Product Form
- **Modal dialog** for add/edit
- **All fields** in organized grid
- **Validation** for required fields
- **Category/Unit dropdowns**
- **Best seller toggle**
- **Auto-save** on submit

---

## 🔧 Customization

### Add New Categories

**File:** `src/components/admin/ProductForm.tsx`

```typescript
const CATEGORIES = [
  'Peixes',
  'Frutos do Mar',
  'Combos',
  'Bebidas',
  'Temperos',
  'Congelados',    // ← Add here
  'Conservas',     // ← Add here
  'Outros',
];
```

### Add New Units

```typescript
const UNITS = [
  'kg',
  'un',
  'kit',
  'pacote',
  'litro',
  'caixa',    // ← Add here
  'bandeja',  // ← Add here
];
```

### Customize Admin Check

**File:** `src/components/ProtectedRoute.tsx`

```typescript
// Option 1: Email whitelist (current)
const ADMIN_EMAILS = ['admin@example.com'];

// Option 2: Email domain check
const isAdmin = user.email?.endsWith('@peixeshop.com');

// Option 3: Custom user claims (requires Admin SDK)
const isAdmin = user.customClaims?.admin === true;
```

---

## 🐛 Troubleshooting

### "Permission denied" on create/update
**Problem:** Firestore rules not deployed
**Solution:**
```bash
firebase deploy --only firestore:rules
```

### Can't access /admin/dashboard
**Problem:** Email not in whitelist
**Solution:** Add your email to `ADMIN_EMAILS` array

### Product form doesn't submit
**Problem:** Missing required fields
**Solution:** Fill all required fields (marked with *)

### Changes don't appear
**Problem:** Cache not cleared
**Solution:** Refresh page (F5) or clear browser cache

### TypeScript errors
**Problem:** Missing types
**Solution:**
```bash
npm install
npm run build
```

---

## 📱 Mobile Support

The admin dashboard is **fully responsive**:
- ✅ Works on tablets
- ✅ Works on phones
- ✅ Touch-friendly buttons
- ✅ Scrollable modals
- ⚠️ Best on tablets/desktop for productivity

---

## 🚀 Production Deployment

### Pre-deployment Checklist
- [ ] Admin emails configured
- [ ] Firestore rules deployed
- [ ] Test create/edit/delete
- [ ] Verify authentication works
- [ ] Check mobile responsiveness
- [ ] Test with real data

### Deploy
```bash
# Build production
npm run build

# Deploy to Firebase Hosting
firebase deploy

# Or deploy to Vercel/Netlify
# (Connect GitHub repo)
```

---

## 🎓 Best Practices

### DO ✅
- Add only trusted emails to admin list
- Use strong passwords (12+ chars)
- Test in development first
- Keep product names consistent
- Use standard category names
- Deploy security rules before production
- Regular backups via Firebase Console

### DON'T ❌
- Share admin credentials
- Allow anonymous admin access
- Skip security rules deployment
- Create duplicate categories (use same names)
- Delete products with active orders
- Modify security rules without testing

---

## 📊 Admin Analytics

### Track Your Usage
1. Firebase Console → Firestore → Usage
2. Check daily writes (should be low)
3. Monitor admin activity
4. Review product changes

### Expected Admin Usage
- Daily: 10-50 writes (product updates)
- Weekly: 50-200 writes
- Monthly: 200-1000 writes
- **Cost: < $0.50/month** 🎉

---

## 🔐 Security Best Practices

### Authentication
- ✅ Use strong passwords
- ✅ Enable 2FA (Firebase Console)
- ✅ Limit admin email list
- ✅ Regular password changes
- ✅ Log out when done

### Firestore Rules
- ✅ Whitelist admin emails
- ✅ Read-only for public
- ✅ Write-only for admins
- ✅ Test rules in Firebase Console
- ✅ Deploy before production

### Data Safety
- ✅ Confirm before deleting
- ✅ Backup data regularly
- ✅ Test in development
- ✅ Monitor changes
- ✅ Keep audit logs

---

## 🎯 Advanced Features (Optional)

### Add Image Upload
```typescript
// Use Firebase Storage or Cloudinary
import { uploadImage } from './firebase/storage';

const imageUrl = await uploadImage(file);
```

### Add Bulk Import
```typescript
// Import products from CSV/JSON
import { batchCreateProducts } from './firebase/admin';

await batchCreateProducts(productsArray);
```

### Add Order Management
```typescript
// View and manage orders
import { useOrders } from './firebase';

const { orders } = useOrders();
```

---

## 📞 Support

### Common Questions

**Q: How do I add multiple admins?**
A: Add emails to `ADMIN_EMAILS` array and deploy rules

**Q: Can I use custom domains?**
A: Yes, configure in Firebase Hosting settings

**Q: How do I backup products?**
A: Export from Firebase Console → Firestore

**Q: Can I undo deletions?**
A: No, confirm carefully or implement soft deletes

**Q: Mobile app for admin?**
A: Dashboard is responsive, works on mobile browsers

---

## 🎉 You're Ready!

Your admin dashboard is fully configured with:
- ✅ Secure authentication
- ✅ Protected routes
- ✅ Full CRUD operations
- ✅ Cost optimization
- ✅ Mobile support
- ✅ Production-ready

**Access:** `http://localhost:5173/admin/login`

**Enjoy managing your shop! 🐟💼**
