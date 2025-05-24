import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  Skeleton,
  useTheme,
  LinearProgress
} from '@mui/material';
import CountUp from 'react-countup';

const StatCard = ({ icon, title, value, color }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={5}
      sx={{
        p: 3,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${theme.palette[color].main}10, ${theme.palette[color].light}40)`,
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'scale(1.03)'
        }
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          sx={{
            backgroundColor: `${theme.palette[color].main}`,
            p: 2,
            borderRadius: '50%',
            fontSize: 28,
            color: '#fff'
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            <CountUp end={value || 0} duration={1.5} separator="," />
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const StockDashboard = () => {
  const { id } = useParams();
  const [orderStats, setOrderStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await Axios(SummaryApi.getWarehouseById(id));
        if (res.data.success) {
          setOrderStats(res.data.summary);
          setError(null);
        } else {
          setError(res.data.message || "Failed to load warehouse stats");
        }
      } catch (err) {
        setError(err.message || "Network error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStats();
  }, [id]);

  const renderProgress = (label, value, color) => (
    <Grid item xs={12} md={4}>
      <Typography variant="body2" color="textSecondary">
        {label}
      </Typography>
      <Box display="flex" alignItems="center" gap={1}>
        <Box flexGrow={1}>
          <LinearProgress
            variant="determinate"
            value={value}
            color={color}
            sx={{ height: 8, borderRadius: 5 }}
          />
        </Box>
        <Typography fontWeight="bold">{value}%</Typography>
      </Box>
    </Grid>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!orderStats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h6">No statistics available for this warehouse</Typography>
      </Box>
    );
  }

  const {
    totalOrders = 0,
    acceptedOrders = 0,
    cancelledOrders = 0,
    pendingOrders = 0,
    deliveredOrders = 0
  } = orderStats;

  const acceptanceRate = totalOrders > 0 ? Math.round((acceptedOrders / totalOrders) * 100) : 0;
  const cancellationRate = totalOrders > 0 ? Math.round((cancelledOrders / totalOrders) * 100) : 0;
  const fulfillmentRate = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

  return (
    <Box sx={{ p: 4, maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📊 Warehouse Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard icon="📦" title="Total Orders" value={totalOrders} color="primary" />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard icon="✅" title="processing" value={acceptedOrders} color="success" />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard icon="❌" title="Cancelled" value={cancelledOrders} color="error" />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard icon="⏳" title="Pending" value={pendingOrders} color="warning" />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard icon="🚚" title="Delivered" value={deliveredOrders} color="info" />
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 3, mt: 5, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          📈 Advanced Statistics
        </Typography>
        <Grid container spacing={3}>
          {renderProgress("processing Rate", acceptanceRate, "success")}
          {renderProgress("Cancellation Rate", cancellationRate, "error")}
          {renderProgress("Fulfillment Rate", fulfillmentRate, "info")}
        </Grid>
      </Paper>
    </Box>
  );
};

export default StockDashboard;
