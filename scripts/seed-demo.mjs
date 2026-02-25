/**
 * Script de seed de dados demo
 * Uso: ADMIN_PASSWORD=suasenha node scripts/seed-demo.mjs
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Lê o .env.local para obter as credenciais do Firebase
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
    .filter(([k]) => k)
);

const API_KEY = env.VITE_FIREBASE_API_KEY;
const PROJECT_ID = env.VITE_FIREBASE_PROJECT_ID;
const ADMIN_EMAIL = 'admin@vigano.com.br';
// A senha é passada por variável de ambiente, nunca hardcoded no código
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('❌ Passe a senha do admin via env: ADMIN_PASSWORD=suasenha node scripts/seed-demo.mjs');
  process.exit(1);
}

const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ─────────────────────────────────────────────
//  1. Authenticate
// ─────────────────────────────────────────────
async function getIdToken() {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: true }),
    }
  );
  const data = await res.json();
  if (!data.idToken) throw new Error(`Auth failed: ${JSON.stringify(data)}`);
  console.log(`✅ Autenticado como ${ADMIN_EMAIL}`);
  return data.idToken;
}

// ─────────────────────────────────────────────
//  2. Helpers to convert JS object → Firestore document
// ─────────────────────────────────────────────
function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) fields[k] = toFirestoreValue(v);
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function toFirestoreDoc(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) fields[k] = toFirestoreValue(v);
  return { fields };
}

async function createDoc(collection, data, idToken, docId = null) {
  const url = docId
    ? `${FIRESTORE_BASE}/${collection}/${docId}`
    : `${FIRESTORE_BASE}/${collection}`;
  const method = docId ? 'PATCH' : 'POST';

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(toFirestoreDoc(data)),
  });

  const result = await res.json();
  if (result.error) throw new Error(`Firestore error: ${JSON.stringify(result.error)}`);
  return result;
}

// ─────────────────────────────────────────────
//  3. Demo Products (20+ produtos completos)
// ─────────────────────────────────────────────
const products = [
  // ── PEIXES NOBRES ──
  {
    name: 'Salmão Fresco Inteiro',
    category: 'Peixes Nobres',
    price: 89.90,
    originalPrice: 109.90,
    unit: 'kg',
    description: 'Salmão fresco importado do Chile, com carne cor de rosa intensa e sabor suave. Perfeito para grelhados, sashimi e carpaccio.',
    image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=800&q=80',
    isBestSeller: true,
    stock: 40,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Filé de Salmão',
    category: 'Peixes Nobres',
    price: 99.90,
    originalPrice: null,
    unit: 'kg',
    description: 'Filé de salmão sem espinha, porcionado, pronto para refogar, assar ou preparar sushi. Altíssima qualidade.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
    isBestSeller: true,
    stock: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Atum Fresco (Rabo Amarelo)',
    category: 'Peixes Nobres',
    price: 129.90,
    originalPrice: 149.90,
    unit: 'kg',
    description: 'Atum rabo amarelo (yellowfin) fresco, ideal para sashimi, grelhado ou tataki. Textura firme e sabor único.',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80',
    isBestSeller: false,
    stock: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Robalo Inteiro',
    category: 'Peixes Nobres',
    price: 79.90,
    originalPrice: null,
    unit: 'kg',
    description: 'Robalo fresco, limpinho e escamado. Peixe de sabor delicado e nutritivo, excelente para assar inteiro ou filés grelhados.',
    image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=800&q=80',
    isBestSeller: false,
    stock: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Linguado Filé',
    category: 'Peixes Nobres',
    price: 69.90,
    originalPrice: 79.90,
    unit: 'kg',
    description: 'Filé de linguado sem espinha, carne branca delicada e levinha. Ótimo para fritar, assar ou receitas com molho.',
    image: 'https://images.unsplash.com/photo-1602491674275-316d95560fb1?w=800&q=80',
    isBestSeller: false,
    stock: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── PEIXES POPULARES ──
  {
    name: 'Tilápia Filé',
    category: 'Peixes Populares',
    price: 28.90,
    originalPrice: null,
    unit: 'kg',
    description: 'Filé de tilápia fresco, sem espinha, suave e versátil. Indicado para fritar, assar ou usar em moquecas e caldos.',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80',
    isBestSeller: true,
    stock: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Pescada Inteira',
    category: 'Peixes Populares',
    price: 22.90,
    originalPrice: null,
    unit: 'kg',
    description: 'Pescada amarela fresca, peixe clássico da culinária brasileira. Carne branca, suave e pouco espinhosa.',
    image: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=800&q=80',
    isBestSeller: false,
    stock: 80,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Pintado Filé',
    category: 'Peixes Populares',
    price: 49.90,
    originalPrice: 59.90,
    unit: 'kg',
    description: 'Filé de pintado do Pantanal, peixe nobre e saboroso. Ideal para grelhar, assar ou fazer moqueca. Sem espinha.',
    image: 'https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=800&q=80',
    isBestSeller: false,
    stock: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Sardinha Fresca',
    category: 'Peixes Populares',
    price: 14.90,
    originalPrice: null,
    unit: 'kg',
    description: 'Sardinha fresca, perfeita para grelhar na brasa com limão e sal grosso. Rica em ômega-3 e cálcio.',
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80',
    isBestSeller: false,
    stock: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Cação em Posta',
    category: 'Peixes Populares',
    price: 32.90,
    originalPrice: null,
    unit: 'kg',
    description: 'Postas de cação frescas, carne firme sem espinhas. Ótimo para fritar, grelhar ou fazer caldeirada.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    isBestSeller: false,
    stock: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── FRUTOS DO MAR ──
  {
    name: 'Camarão Rosa Limpo',
    category: 'Frutos do Mar',
    price: 69.90,
    originalPrice: 89.90,
    unit: 'kg',
    description: 'Camarão rosa limpo e descascado, pronto para cozinhar. Ideal para churrasco, risoto, macarrão e frutos do mar.',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80',
    isBestSeller: true,
    stock: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Camarão Cinza com Casca',
    category: 'Frutos do Mar',
    price: 45.90,
    originalPrice: null,
    unit: 'kg',
    description: 'Camarão cinza fresco com casca, sabor mais intenso. Perfeito para moqueca, ensopado e caldeirada.',
    image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=800&q=80',
    isBestSeller: false,
    stock: 40,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Polvo Limpo',
    category: 'Frutos do Mar',
    price: 119.90,
    originalPrice: 139.90,
    unit: 'kg',
    description: 'Polvo limpo e higienizado, pronto para temperar e cozinhar. Ideal para polvo à lagareiro, ensopado ou grelhado.',
    image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=800&q=80',
    isBestSeller: false,
    stock: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Lula Inteira',
    category: 'Frutos do Mar',
    price: 59.90,
    originalPrice: 69.90,
    unit: 'kg',
    description: 'Lula inteira fresca, carne tenra e saborosa. Ótima para fritar, grelhar, rechear ou usar em risotos e massas.',
    image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=800&q=80',
    isBestSeller: false,
    stock: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Mexilhão na Meia Concha',
    category: 'Frutos do Mar',
    price: 39.90,
    originalPrice: null,
    unit: 'kg',
    description: 'Mexilhão pré-cozido na meia concha para fácil preparo. Perfeito para gratinar, temperar com manteiga e alho ou usar em arroz.',
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&q=80',
    isBestSeller: false,
    stock: 35,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Ostra Fresca',
    category: 'Frutos do Mar',
    price: 12.90,
    originalPrice: null,
    unit: 'unid.',
    description: 'Ostra fresca, ideal para comer gratinada, natural com limão ou no caldinho. Tamanho jumbo. Vendida por unidade.',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80',
    isBestSeller: false,
    stock: 80,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── COMBOS E KITS ──
  {
    name: 'Kit Moqueca Baiana (4 pess.)',
    category: 'Combos',
    price: 89.90,
    originalPrice: 115.00,
    unit: 'kit',
    description: 'Tudo que você precisa para uma moqueca perfeita: filé de peixe branco, camarão, leite de coco e dendê. Serve 4 pessoas.',
    image: 'https://images.unsplash.com/photo-1557499305-0af888c3d8ec?w=800&q=80',
    isBestSeller: true,
    stock: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Kit Sushi & Sashimi (2 pess.)',
    category: 'Combos',
    price: 99.90,
    originalPrice: 130.00,
    unit: 'kit',
    description: 'Kit completo para sushi em casa: salmão, atum e camarão frescos em porções para 2 pessoas. Inclui nori e wasabi.',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80',
    isBestSeller: true,
    stock: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Mix Frutos do Mar',
    category: 'Combos',
    price: 75.90,
    originalPrice: 95.00,
    unit: 'kg',
    description: 'Mix de mariscos, camarão, polvo e lula para caldeirada, risoto ou churrasco de frutos do mar. Já limpos e prontos.',
    image: 'https://images.unsplash.com/photo-1535140728325-a4d3707eee61?w=800&q=80',
    isBestSeller: false,
    stock: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Kit Churrasco de Peixe',
    category: 'Combos',
    price: 79.90,
    originalPrice: 99.90,
    unit: 'kit',
    description: 'Kit especial para churrasco: postas de peixe variado, camarão na casca e temperos especiais. Para 4 pessoas.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    isBestSeller: false,
    stock: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── PROMOÇÕES ──
  {
    name: 'Bacalhau Dessalgado Porto',
    category: 'Promoções',
    price: 79.90,
    originalPrice: 119.90,
    unit: 'kg',
    description: '🔥 PROMOÇÃO DA SEMANA — Bacalhau do Porto dessalgado de alta qualidade. Carne desfiada e pronta para uso. Ideal para bacalhoada, bolinha de bacalhau e salada.',
    image: 'https://images.unsplash.com/photo-1607301405752-d7cd9c9f7579?w=800&q=80',
    isBestSeller: true,
    stock: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Camarão 50/60 Inteiro',
    category: 'Promoções',
    price: 34.90,
    originalPrice: 49.90,
    unit: 'kg',
    description: '🔥 OFERTA ESPECIAL — Camarão inteiro tamanho 50/60, fresco e saboroso. Ótimo para caldos, moqueca ou fritar temperadinho.',
    image: 'https://images.unsplash.com/photo-1502364271109-0a9a75a2a9df?w=800&q=80',
    isBestSeller: false,
    stock: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ─────────────────────────────────────────────
//  4. Store Settings
// ─────────────────────────────────────────────
const storeSettings = {
  storeName: 'VIGANÔ',
  storeSubname: 'Pescados',
  storeDescription: 'Frutos do mar direto do barco para a sua mesa. Trabalhamos com produtos frescos, congelados e combos especiais para qualquer ocasião.',
  storeTagline: 'Do mar para a sua mesa',
  address: 'Rua das Palmeiras, 123 - Centro',
  addressCep: '00000-000',
  addressCity: 'São Paulo',
  addressState: 'SP',
  phone: '5511999999999',
  openingHours: 'Seg–Sex: 8h às 18h | Sáb: 8h às 14h',
  logoUrl: '',
  mapsEmbedQuery: 'Viganô Pescados São Paulo',
  updatedAt: new Date().toISOString(),
};

// ─────────────────────────────────────────────
//  5. Main
// ─────────────────────────────────────────────
async function main() {
  console.log('\n🐟 Iniciando seed de dados demo...\n');

  const idToken = await getIdToken();

  // Seed store settings
  console.log('\n📋 Salvando configurações da loja...');
  await createDoc('settings', storeSettings, idToken, 'store');
  console.log('  ✅ Store settings salvo');

  // Seed products
  console.log('\n📦 Adicionando produtos...\n');
  let count = 0;
  for (const product of products) {
    const result = await createDoc('products', product, idToken);
    const name = result.name?.split('/').pop() || '?';
    console.log(`  ✅ [${++count}/${products.length}] ${product.name} (${product.category})`);
  }

  console.log(`\n🎉 Seed completo! ${count} produtos e configurações da loja criados.\n`);
  console.log('🔥 Firebase Firestore: https://console.firebase.google.com/project/vigano-pescados/firestore');
  console.log('🌐 App URL (após deploy): https://vigano-pescados.web.app\n');
}

main().catch((err) => {
  console.error('\n❌ Erro no seed:', err.message);
  process.exit(1);
});
