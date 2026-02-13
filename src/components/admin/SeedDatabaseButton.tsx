import { useState } from 'react';
import { Button, CircularProgress } from '@mui/joy';
import StorageIcon from '@mui/icons-material/Storage';
import { createProduct } from '../../firebase/admin';
import { sampleProducts } from '../../data/sampleFirestoreData';

export default function SeedDatabaseButton() {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    if (!confirm('This will add sample products to your database. Continue?')) {
      return;
    }

    setLoading(true);
    try {
      let count = 0;
      for (const product of sampleProducts) {
        // We use createProduct from admin.ts which handles createdAt/updatedAt
        await createProduct({
          name: product.name,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          unit: product.unit,
          description: product.description,
          stock: product.stock,
          image: product.image,
          isBestSeller: product.isBestSeller,
        });
        count++;
      }
      alert(`Successfully added ${count} products!`);
      window.location.reload(); // Refresh to show new data
    } catch (error) {
      console.error('Error seeding database:', error);
      alert('Failed to seed database. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="soft"
      color="warning"
      startDecorator={loading ? <CircularProgress size="sm" /> : <StorageIcon />}
      onClick={handleSeed}
      disabled={loading}
    >
      {loading ? 'Semeando...' : 'Semear Banco de Dados'}
    </Button>
  );
}
