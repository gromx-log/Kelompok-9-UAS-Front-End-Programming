'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { FaChartLine, FaShoppingBag, FaMoneyBillWave } from 'react-icons/fa';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import CmsLayout from '../cmslayout';
import api from '../../../lib/api';

// Dashboard Types
interface DashboardOrder {
  _id: string;
  customerName?: string;
  name?: string;
  phone?: string;
  customerPhone?: string;
  cakeModel?: string;
  totalPrice: number;
  dpAmount: number;
  remainingPayment: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

interface DashboardStats {
  newOrdersCount: number;
  totalProductsCount: number;
  totalRevenue: number;
}

interface ChartDataItem {
  name: string;
  orders: number;
  date: string;
}

export default function CmsDashboardPage() {
  const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    newOrdersCount: 0,
    totalProductsCount: 0,
    totalRevenue: 0,
  });
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {

        // GET ORDERS
        const { data: ordersRes } = await api.get('/api/orders');
        const ordersData: DashboardOrder[] = ordersRes.orders ?? ordersRes ?? [];

        // Hitung pesanan 24 jam terakhir
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const newOrders = ordersData.filter(
          (o) => new Date(o.createdAt) > oneDayAgo
        );

        // **INILAH PERBAIKAN REVENUE**
        const revenue = ordersData
          .filter(o => 
            o.paymentStatus === 'Paid' && 
            o.orderStatus === 'Delivered'
          )
          .reduce((acc, curr) => acc + (curr.totalPrice ?? 0), 0);

        // Set 7 pesanan terbaru
        setRecentOrders(ordersData.slice(0, 7));

        // GET PRODUCTS
        const { data: productsData } = await api.get('/api/products');

        // Generate Chart Data
        setChartData(generateChartData(ordersData));

        // Update Stats
        setStats({
          newOrdersCount: newOrders.length,
          totalProductsCount: productsData.length,
          totalRevenue: revenue,
        });

      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <CmsLayout>
      <Head>
        <title>Dashboard - KartiniAle CMS</title>
      </Head>

      <div className="container-fluid p-4">
        <h1 className="display-5 fw-bold mb-4">Dashboard</h1>

        {/* Cards */}
        <div className="row g-4 mb-5">
          
          {/* Pesanan 24 Jam */}
          <div className="col-lg-4 col-md-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex align-items-center">
                <FaShoppingBag size={30} className="me-3 text-primary" />
                <div>
                  <h5 className="text-muted mb-1">Pesanan Baru (24 Jam)</h5>
                  <p className="h3 fw-bold">{loading ? '...' : stats.newOrdersCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Produk */}
          <div className="col-lg-4 col-md-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex align-items-center">
                <FaChartLine size={30} className="me-3 text-primary" />
                <div>
                  <h5 className="text-muted mb-1">Total Produk</h5>
                  <p className="h3 fw-bold">{loading ? '...' : stats.totalProductsCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="col-lg-4 col-md-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex align-items-center">
                <FaMoneyBillWave size={30} className="me-3 text-success" />
                <div>
                  <h5 className="text-muted mb-1">Total Pendapatan (Paid + Delivered)</h5>
                  <p className="h3 fw-bold text-success">
                    {loading ? '...' : `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* CHART (LINE) */}
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-header bg-transparent border-0 pt-4 px-4">
            <h3 className="fw-bold mb-0">Order Harian (7 Hari)</h3>
          </div>
          <div className="card-body p-4">
            {loading ? (
              <p className="text-center py-3">Memuat data...</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#007bff" 
                    strokeWidth={3} 
                    dot={{ r: 5, strokeWidth: 2 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Tabel Pesanan Terbaru */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between">
            <h3 className="fw-bold mb-0">Pesanan Terbaru</h3>
            <small className="text-muted">7 pesanan terakhir</small>
          </div>
          <div className="card-body p-4">
            {loading ? (
              <p>Memuat...</p>
            ) : recentOrders.length === 0 ? (
              <p className="text-muted">Belum ada pesanan.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nama</th>
                      <th>No HP</th>
                      <th>Model Kue</th>
                      <th>Harga</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order._id}>
                        <td className="fw-bold text-primary">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td>{order.customerName ?? order.name ?? '-'}</td>
                        <td>{order.customerPhone ?? order.phone ?? '-'}</td>
                        <td>{order.cakeModel ?? '-'}</td>
                        <td>
                          {order.totalPrice
                            ? `Rp ${order.totalPrice.toLocaleString('id-ID')}`
                            : '-'}
                        </td>
                        <td>
                          <span className="badge bg-info">{order.orderStatus ?? '-'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </CmsLayout>
  );
}

function generateChartData(orders: DashboardOrder[]): ChartDataItem[] {
  const data: ChartDataItem[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dayOrders = orders.filter((order: any) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.toDateString() === date.toDateString();
    });

    data.push({
      name: date.toLocaleDateString('id-ID', { weekday: 'short' }),
      orders: dayOrders.length,
      date: date.toISOString(),
    });
  }

  return data;
}
