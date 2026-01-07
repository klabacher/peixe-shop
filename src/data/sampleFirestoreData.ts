// Sample products data to seed Firestore
// Import this via Firebase Console or use Admin SDK script

export const sampleProducts = [
  {
    name: "Salmão Fresco",
    category: "Peixes",
    price: 89.90,
    originalPrice: 99.90,
    unit: "kg",
    description: "Salmão fresco do Chile, ideal para grelhados",
    image: "/images/salmao.jpg",
    isBestSeller: true,
    stock: 50
  },
  {
    name: "Camarão Rosa",
    category: "Frutos do Mar",
    price: 65.00,
    unit: "kg",
    description: "Camarão rosa limpo e congelado",
    image: "/images/camarao.jpg",
    isBestSeller: true,
    stock: 30
  },
  {
    name: "Tilápia Filé",
    category: "Peixes",
    price: 35.90,
    unit: "kg",
    description: "Filé de tilápia sem espinha",
    image: "/images/tilapia.jpg",
    stock: 100
  },
  {
    name: "Polvo Congelado",
    category: "Frutos do Mar",
    price: 120.00,
    originalPrice: 140.00,
    unit: "kg",
    description: "Polvo limpo e congelado",
    image: "/images/polvo.jpg",
    stock: 15
  },
  {
    name: "Kit Moqueca",
    category: "Combos",
    price: 85.00,
    originalPrice: 95.00,
    unit: "kit",
    description: "Kit completo para moqueca (2-3 pessoas)",
    image: "/images/kit-moqueca.jpg",
    isBestSeller: true,
    stock: 20
  }
];

// To import to Firestore:
// 1. Go to Firebase Console → Firestore
// 2. Create 'products' collection
// 3. Add documents with auto-generated IDs
// 4. Copy each object above as document fields

// OR use this Admin SDK script (run with Node.js):
/*
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedProducts() {
  const batch = db.batch();
  
  sampleProducts.forEach((product) => {
    const docRef = db.collection('products').doc();
    batch.set(docRef, product);
  });
  
  await batch.commit();
  console.log('Products seeded successfully!');
}

seedProducts();
*/
