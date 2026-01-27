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

const ReceptionistDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Box minHeight="100vh" bgcolor="#f5f5f5">
      <AppBar position="static" color="inherit">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Receptionist Dashboard</Typography>
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
              Welcome to Receptionist Dashboard
            </Typography>

            <Grid container spacing={2}>
              {[
                ['Check-in / Check-out', 'Process guest arrivals and departures'],
                ['Bookings', 'Manage reservations'],
                ['Room Status', 'Update room availability'],
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
              {['Check-in Guest', 'Check-out Guest', 'New Booking', 'Room Status'].map(action => (
                <Grid key={action}>
                  <Button fullWidth variant="outlined" sx={{ height: 80 }}>
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

export default ReceptionistDashboard;
