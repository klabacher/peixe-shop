import { Box, Typography, CircularProgress, Grid, Card, CardContent, Chip } from '@mui/joy';
import { useProducts } from '../firebase';

export default function FirestoreProductsExample() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="danger">Error loading products: {error.message}</Typography>
        <Typography level="body-sm" sx={{ mt: 1 }}>
          Make sure Firebase is configured and products collection exists.
        </Typography>
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>No products found in Firestore.</Typography>
        <Typography level="body-sm" sx={{ mt: 1 }}>
          Add products via Firebase Console or use the mock data temporarily.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography level="h3">Products from Firestore</Typography>
        <Chip color="success" size="sm">Cached</Chip>
      </Box>
      <Grid container spacing={2}>
        {products.map((product: any) => (
          <Grid key={product.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography level="title-lg">{product.name}</Typography>
                <Typography level="body-sm">{product.category}</Typography>
                <Typography level="h4" sx={{ mt: 1 }}>
                  R$ {product.price.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
