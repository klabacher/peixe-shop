export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Novo campo opcional para promoções
  image: string;
  category: string;
  isBestSeller?: boolean; // Para a aba "Mais Pedidos"
}

export const products: Product[] = [
  {
    id: 1,
    name: "Filé de Salmão Premium",
    description: "Suculento e rico em Ômega 3. Postas altas, perfeitas para um sushi que derrete na boca.",
    price: 89.90,
    originalPrice: 109.90, // Promoção
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    category: "Peixes",
    isBestSeller: true
  },
  {
    id: 2,
    name: "Tilápia Selecionada",
    description: "Filés 100% limpos, de sabor suave e textura macia. Praticidade para o dia a dia.",
    price: 39.90,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    category: "Peixes"
  },
  {
    id: 3,
    name: "Camarão Rosa GG",
    description: "O rei dos frutos do mar. Textura firme e adocicada, ideal para moquecas.",
    price: 120.00,
    originalPrice: 145.00, // Promoção
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80",
    category: "Frutos do Mar",
    isBestSeller: true
  },
  {
    id: 4,
    name: "Combo Paella Valenciana",
    description: "Kit completo com arroz, açafrão, lulas, mexilhões e camarões selecionados.",
    price: 159.90,
    originalPrice: 189.90, // Promoção
    image: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=800&q=80",
    category: "Combos"
  },
  {
    id: 5,
    name: "Vinho Branco Chardonnay",
    description: "Garrafa 750ml. Frutado e leve, harmonização perfeita com peixes brancos.",
    price: 65.00,
    image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80",
    category: "Bebidas"
  },
  {
    id: 6,
    name: "Postas de Robalo",
    description: "Sofisticação em cada pedaço. Carne branca, flocosa e extremamente macia.",
    price: 95.50,
    image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=800&q=80",
    category: "Peixes"
  }
];