import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  Card
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate(ROUTES.LOGIN);
    } catch (err: any) {
      setError('Registration failed');
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" bgcolor="#f5f5f5">
      <Container maxWidth="sm">
        <Card sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Customer Registration
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} mt={2}>
            <Grid container spacing={2}>
              {[
                ['Username', 'Username'],
                ['Password', 'Password'],
                ['FullName', 'Full Name'],
                ['PhoneNumber', 'Phone Number'],
              ].map(([name, label]) => (
                <Grid key={name}>
                  <TextField
                    fullWidth
                    label={label}
                    name={name}
                    type={name === 'Password' ? 'password' : 'text'}
                    onChange={handleChange}
                  />
                </Grid>
              ))}
            </Grid>

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              type="submit"
            >
              Register
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default RegisterPage;
