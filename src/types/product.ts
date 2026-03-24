export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isBestSeller?: boolean;
  isVisible?: boolean;
  unit?: string;
  stock?: number;
}

export interface StoreSettings {
  storeName: string;
  storeSubname: string;
  storeDescription: string;
  storeTagline: string;
  maintenanceMode: boolean;
  address: string;
  addressCep: string;
  addressCity: string;
  addressState: string;
  phone: string;
  openingHours: string;
  logoUrl?: string;
  mapsEmbedQuery: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'VIGANÔ',
  storeSubname: 'PESCADOS',
  storeDescription: 'Há anos selecionando os peixes mais nobres e os camarões mais frescos para você. Nossa missão é levar saúde, sabor e a tradição da alta gastronomia diretamente para a sua família em Colatina.',
  storeTagline: 'O Frescor do Mar, na Sua Mesa.',
  maintenanceMode: false,
  address: 'Rua dos Peixes, 123 - Centro',
  addressCep: '29700-000',
  addressCity: 'Colatina',
  addressState: 'ES',
  phone: '5527999999999',
  openingHours: 'Seg a Sex, 09:00 às 19:00',
  mapsEmbedQuery: 'Colatina, ES, Brasil',
};
