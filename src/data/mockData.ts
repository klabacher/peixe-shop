export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Salmão Fresco",
    description: "Filé de salmão fresco, rico em ômega 3. Ideal para sushi ou grelhado.",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    category: "Peixes"
  },
  {
    id: 2,
    name: "Tilápia",
    description: "Filé de tilápia sem espinhas. Sabor suave e versátil.",
    price: 39.90,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    category: "Peixes"
  },
  {
    id: 3,
    name: "Camarão Rosa",
    description: "Camarão rosa médio limpo. Perfeito para moquecas e risotos.",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80",
    category: "Frutos do Mar"
  },
  {
    id: 4,
    name: "Robalo",
    description: "Posta de robalo fresco. Carne branca e macia.",
    price: 95.50,
    image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=800&q=80",
    category: "Peixes"
  },
  {
    id: 5,
    name: "Lula em Anéis",
    description: "Anéis de lula congelados. Ótimo para empanar.",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1501595091296-3aa970afb3ff?auto=format&fit=crop&w=800&q=80",
    category: "Frutos do Mar"
  },
  {
    id: 6,
    name: "Atum",
    description: "Posta de atum vermelho fresco. Ideal para selar.",
    price: 110.00,
    image: "https://images.unsplash.com/photo-1501595091296-3aa970afb3ff?auto=format&fit=crop&w=800&q=80",
    category: "Peixes"
  }
];
