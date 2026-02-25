import { useState } from 'react';
import { Button, CircularProgress, Typography, Box } from '@mui/joy';
import StorageIcon from '@mui/icons-material/Storage';
import { createProduct } from '../../firebase/admin';
import { updateStoreSettings } from '../../firebase/admin';
import { uploadImageFromUrl } from '../../supabase';
import { DEFAULT_STORE_SETTINGS } from '../../types/product';
import { clearFirestoreCache } from '../../firebase/firestore';

const SEED_PRODUCTS = [
  {
    name: 'Filé de Salmão Premium',
    category: 'Peixes',
    price: 89.90,
    originalPrice: 109.90,
    unit: 'kg',
    description: 'Suculento e rico em Ômega 3. Postas altas, perfeitas para um sushi que derrete na boca.',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    isBestSeller: true,
    stock: 50,
  },
  {
    name: 'Tilápia Selecionada',
    category: 'Peixes',
    price: 39.90,
    unit: 'kg',
    description: 'Filés 100% limpos, de sabor suave e textura macia. Praticidade para o dia a dia.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    stock: 65,
  },
  {
    name: 'Camarão Rosa GG',
    category: 'Frutos do Mar',
    price: 120.00,
    originalPrice: 145.00,
    unit: 'kg',
    description: 'O rei dos frutos do mar. Textura firme e adocicada, ideal para moquecas.',
    imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
    isBestSeller: true,
    stock: 30,
  },
  {
    name: 'Combo Paella Valenciana',
    category: 'Combos',
    price: 159.90,
    originalPrice: 189.90,
    unit: 'kit',
    description: 'Kit completo com arroz, açafrão, lulas, mexilhões e camarões selecionados.',
    imageUrl: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=800&q=80',
    stock: 24,
  },
  {
    name: 'Vinho Branco Chardonnay',
    category: 'Bebidas',
    price: 65.00,
    unit: 'un',
    description: 'Garrafa 750ml. Frutado e leve, harmonização perfeita com peixes brancos.',
    imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80',
    stock: 80,
  },
  {
    name: 'Postas de Robalo',
    category: 'Peixes',
    price: 95.50,
    unit: 'kg',
    description: 'Sofisticação em cada pedaço. Carne branca, flocosa e extremamente macia.',
    imageUrl: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=800&q=80',
    isBestSeller: true,
    stock: 40,
  },
];

export default function SeedDatabaseButton() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');

  const handleSeed = async () => {
    if (!confirm('Isso adicionará produtos demo e configurações padrão ao banco de dados. Continuar?')) {
      return;
    }

    setLoading(true);
    try {
      let count = 0;
      for (const product of SEED_PRODUCTS) {
        const { imageUrl, ...productData } = product;
        setProgress(`Enviando imagem ${count + 1}/${SEED_PRODUCTS.length}...`);
        
        let uploadedImageUrl: string;
        try {
          uploadedImageUrl = await uploadImageFromUrl(imageUrl, 'products');
        } catch (err) {
          console.warn(`Falha no upload de imagem para ${product.name}, usando URL original`, err);
          uploadedImageUrl = imageUrl;
        }

        setProgress(`Criando produto ${count + 1}/${SEED_PRODUCTS.length}...`);
        await createProduct({
          ...productData,
          image: uploadedImageUrl,
        });
        count++;
      }

      // Seed store settings
      setProgress('Salvando configurações da loja...');
      await updateStoreSettings(DEFAULT_STORE_SETTINGS);

      clearFirestoreCache();
      alert(`${count} produtos e configurações da loja adicionados com sucesso!`);
      window.location.reload();
    } catch (error) {
      console.error('Error seeding database:', error);
      alert('Falha ao semear banco de dados. Verifique o console.');
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  return (
    <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button
        variant="soft"
        color="warning"
        startDecorator={loading ? <CircularProgress size="sm" /> : <StorageIcon />}
        onClick={handleSeed}
        disabled={loading}
        size="sm"
      >
        {loading ? 'Semeando...' : 'Semear Demo'}
      </Button>
      {progress && (
        <Typography level="body-xs" sx={{ mt: 0.5, color: 'warning.plainColor', textAlign: 'center' }}>
          {progress}
        </Typography>
      )}
    </Box>
  );
}
