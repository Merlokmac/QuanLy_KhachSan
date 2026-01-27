import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Container
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Box minHeight="100vh" bgcolor="#f5f5f5">
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Customer Portal</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">
              Welcome, <strong>{user?.FullName}</strong>
            </Typography>
            <Button variant="outlined" onClick={logout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Welcome to Customer Portal
            </Typography>

            <Grid container spacing={2}>
              {[
                ['My Bookings', 'View and manage your reservations'],
                ['Available Rooms', 'Browse and book available rooms'],
                ['My Profile', 'Update your personal information'],
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

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>

            <Grid container spacing={2}>
              {['Search Rooms', 'My Bookings', 'My Profile', 'Contact Support'].map(action => (
                <Grid key={action}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ height: 80 }}
                  >
                    {action}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CustomerDashboard;
