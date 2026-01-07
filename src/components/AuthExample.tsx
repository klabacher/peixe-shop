import { useState } from 'react';
import { Box, Button, Typography, Card, CircularProgress } from '@mui/joy';
import { useAuth, signInAnonymous, signOut } from '../firebase';

export default function AuthExample() {
  const { user, loading } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  const handleAnonymousSignIn = async () => {
    setSigningIn(true);
    try {
      await signInAnonymous();
    } catch (error) {
      console.error('Sign-in failed:', error);
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Card>
      <Typography level="h4">Authentication Status</Typography>
      {user ? (
        <Box>
          <Typography>Signed in as: {user.uid}</Typography>
          <Typography>Anonymous: {user.isAnonymous ? 'Yes' : 'No'}</Typography>
          <Button onClick={signOut} color="danger" sx={{ mt: 2 }}>
            Sign Out
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography>Not signed in</Typography>
          <Button 
            onClick={handleAnonymousSignIn} 
            loading={signingIn}
            sx={{ mt: 2 }}
          >
            Sign In Anonymously (Free)
          </Button>
        </Box>
      )}
    </Card>
  );
}
