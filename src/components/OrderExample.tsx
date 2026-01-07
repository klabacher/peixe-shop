import { useState } from 'react';
import { Box, Button, Typography, Card, Input, FormControl, FormLabel, Alert } from '@mui/joy';
import { useAuth, useCreateOrder } from '../firebase';
import { useCart } from '../context/CartContext';

export default function OrderExample() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const { submitOrder, loading, error } = useCreateOrder();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmitOrder = async () => {
    if (items.length === 0) {
      alert('Cart is empty');
      return;
    }

    if (!customerName || !customerPhone) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const orderId = await submitOrder({
        userId: user?.uid,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total,
        customerInfo: {
          name: customerName,
          phone: customerPhone,
        },
      });
      
      console.log('Order created:', orderId);
      setSuccess(true);
      clearCart();
      setCustomerName('');
      setCustomerPhone('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Order submission failed:', err);
    }
  };

  return (
    <Card>
      <Typography level="h4">Create Order (Single Write)</Typography>
      
      {success && (
        <Alert color="success">Order created successfully! ✅</Alert>
      )}
      
      {error && (
        <Alert color="danger">Failed to create order: {error.message}</Alert>
      )}

      <FormControl>
        <FormLabel>Customer Name</FormLabel>
        <Input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter name"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Phone Number</FormLabel>
        <Input
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="Enter phone"
        />
      </FormControl>

      <Box sx={{ mt: 2 }}>
        <Typography level="body-sm">
          Cart items: {items.length}
        </Typography>
        <Typography level="body-sm">
          Total: R$ {total.toFixed(2)}
        </Typography>
      </Box>

      <Button 
        onClick={handleSubmitOrder} 
        loading={loading}
        disabled={items.length === 0}
        sx={{ mt: 2 }}
      >
        Submit Order
      </Button>
    </Card>
  );
}
