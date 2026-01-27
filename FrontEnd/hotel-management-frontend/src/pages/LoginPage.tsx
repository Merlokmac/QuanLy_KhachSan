import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  Alert
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch {
      setError('Login failed');
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" bgcolor="#f5f5f5">
      <Container maxWidth="xs">
        <Card sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Hotel Management
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} mt={2}>
            <TextField
              fullWidth
              label="Username"
              name="Username"
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Password"
              name="Password"
              type="password"
              margin="normal"
              onChange={handleChange}
            />
            <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
              Sign In
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
