import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const ManagerDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Box minHeight="100vh" bgcolor="#f5f5f5">
      <AppBar position="static" color="inherit">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Manager Dashboard</Typography>
          <Box display="flex" gap={2}>
            <Typography variant="body2">
              Welcome, <strong>{user?.FullName}</strong>
            </Typography>
            <Button variant="outlined" onClick={logout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Welcome to Manager Dashboard
            </Typography>

            <Grid container spacing={2}>
              {[
                ['Account Management', 'Manage employee & customer accounts'],
                ['Room Management', 'Oversee all room operations'],
                ['Reports', 'View business analytics'],
              ].map(([title, desc]) => (
                <Grid key={title}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ManagerDashboard;
