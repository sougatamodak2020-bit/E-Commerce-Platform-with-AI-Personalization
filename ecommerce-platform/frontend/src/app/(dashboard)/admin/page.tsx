'use client';

import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tab,
  Tabs,
} from '@mui/material';
import {
  TrendingUp,
  People,
  ShoppingCart,
  AttachMoney,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const salesData = [
  { month: 'Jan', sales: 4000, revenue: 2400 },
  { month: 'Feb', sales: 3000, revenue: 1398 },
  { month: 'Mar', sales: 2000, revenue: 9800 },
  { month: 'Apr', sales: 2780, revenue: 3908 },
  { month: 'May', sales: 1890, revenue: 4800 },
  { month: 'Jun', sales: 2390, revenue: 3800 },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', amount: 299.99, status: 'Delivered', date: '2024-02-28' },
  { id: 'ORD-002', customer: 'Jane Smith', amount: 149.99, status: 'Processing', date: '2024-02-27' },
  { id: 'ORD-003', customer: 'Bob Johnson', amount: 499.99, status: 'Shipped', date: '2024-02-26' },
  { id: 'ORD-004', customer: 'Alice Williams', amount: 89.99, status: 'Pending', date: '2024-02-25' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);

  const stats = [
    { title: 'Total Revenue', value: '\,239', change: '+12.5%', icon: <AttachMoney />, color: '#4CAF50' },
    { title: 'Total Orders', value: '1,245', change: '+8.2%', icon: <ShoppingCart />, color: '#2196F3' },
    { title: 'Active Users', value: '8,492', change: '+15.3%', icon: <People />, color: '#FF9800' },
    { title: 'Conversion Rate', value: '3.24%', change: '+2.1%', icon: <TrendingUp />, color: '#9C27B0' },
  ];

  return (
    <Container maxWidth=\"xl\" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant=\"h3\" fontWeight={700} gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant=\"body1\" color=\"text.secondary\">
          Welcome back! Here's what's happening with your store today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  borderLeft: 4,
                  borderColor: stat.color,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ color: stat.color, fontSize: 40 }}>{stat.icon}</Box>
                    <Chip label={stat.change} color=\"success\" size=\"small\" />
                  </Box>
                  <Typography variant=\"h4\" fontWeight={700} gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant=\"body2\" color=\"text.secondary\">
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant=\"h6\" fontWeight={600} gutterBottom>
              Sales Overview
            </Typography>
            <ResponsiveContainer width=\"100%\" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray=\"3 3\" />
                <XAxis dataKey=\"month\" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type=\"monotone\" dataKey=\"sales\" stroke=\"#2196F3\" strokeWidth={2} />
                <Line type=\"monotone\" dataKey=\"revenue\" stroke=\"#4CAF50\" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant=\"h6\" fontWeight={600} gutterBottom>
              Top Categories
            </Typography>
            <ResponsiveContainer width=\"100%\" height={260}>
              <BarChart data={[
                { category: 'Electronics', sales: 450 },
                { category: 'Fashion', sales: 380 },
                { category: 'Home', sales: 280 },
                { category: 'Sports', sales: 135 },
              ]}>
                <CartesianGrid strokeDasharray=\"3 3\" />
                <XAxis dataKey=\"category\" />
                <YAxis />
                <Tooltip />
                <Bar dataKey=\"sales\" fill=\"#9C27B0\" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label=\"Recent Orders\" />
            <Tab label=\"Products\" />
            <Tab label=\"Users\" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Order ID</strong></TableCell>
                  <TableCell><strong>Customer</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell align=\"right\"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>\</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={
                          order.status === 'Delivered' ? 'success' :
                          order.status === 'Shipped' ? 'info' :
                          order.status === 'Processing' ? 'warning' : 'default'
                        }
                        size=\"small\"
                      />
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell align=\"right\">
                      <IconButton size=\"small\">
                        <Visibility />
                      </IconButton>
                      <IconButton size=\"small\">
                        <Edit />
                      </IconButton>
                      <IconButton size=\"small\" color=\"error\">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}
