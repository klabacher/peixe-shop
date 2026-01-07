import type { Product } from '../types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Filé de Salmão Premium',
    description:
      'Suculento e rico em Ômega 3. Postas altas, perfeitas para um sushi que derrete na boca.',
    price: 89.9,
    originalPrice: 109.9,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    category: 'Peixes',
    isBestSeller: true,
    unit: 'kg',
    stock: 50,
  },
  {
    id: '2',
    name: 'Tilápia Selecionada',
    description:
      'Filés 100% limpos, de sabor suave e textura macia. Praticidade para o dia a dia.',
    price: 39.9,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    category: 'Peixes',
    unit: 'kg',
    stock: 65,
  },
  {
    id: '3',
    name: 'Camarão Rosa GG',
    description:
      'O rei dos frutos do mar. Textura firme e adocicada, ideal para moquecas.',
    price: 120.0,
    originalPrice: 145.0,
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
    category: 'Frutos do Mar',
    isBestSeller: true,
    unit: 'kg',
    stock: 30,
  },
  {
    id: '4',
    name: 'Combo Paella Valenciana',
    description:
      'Kit completo com arroz, açafrão, lulas, mexilhões e camarões selecionados.',
    price: 159.9,
    originalPrice: 189.9,
    image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=800&q=80',
    category: 'Combos',
    unit: 'kit',
    stock: 24,
  },
  {
    id: '5',
    name: 'Vinho Branco Chardonnay',
    description:
      'Garrafa 750ml. Frutado e leve, harmonização perfeita com peixes brancos.',
    price: 65.0,
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80',
    category: 'Bebidas',
    unit: 'un',
    stock: 80,
  },
  {
    id: '6',
    name: 'Postas de Robalo',
    description:
      'Sofisticação em cada pedaço. Carne branca, flocosa e extremamente macia.',
    price: 95.5,
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=800&q=80',
    category: 'Peixes',
    unit: 'kg',
    stock: 40,
  },
];