import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Manual .env parsing
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.join('=').trim();
  }
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

console.log('Using config:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleProducts = [
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

async function seed() {
  console.log('Seeding products...');
  for (const product of sampleProducts) {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Added product:', product.name, 'with ID:', docRef.id);
    } catch (e) {
      console.error('Error adding product:', product.name, e);
    }
  }
  console.log('Seeding complete!');
  process.exit(0);
}

seed();
