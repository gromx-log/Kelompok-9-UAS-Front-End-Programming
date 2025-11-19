'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { FaChartBar, FaShoppingBag, FaMoneyBillWave } from 'react-icons/fa';
import CmsLayout from '../cmslayout';
import api from '../../../lib/api';

// Tipe data untuk Order di Dashboard 
interface DashboardOrder {
  _id: string;
  customerName: string;
  customerPhone: string; 
  cakeType: string;     
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  newOrdersCount: number;
  totalProductsCount: number;
  totalRevenue: number; 
}

export default function CmsDashboardPage() {
  const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    newOrdersCount: 0,
    totalProductsCount: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data pesanan
        const { data: ordersData } = await api.get('/api/orders');
        
        // Filter pesanan 24 jam terakhir 
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const newOrders = ordersData.filter((order: any) => new Date(order.createdAt) > oneDayAgo);

        // --- LOGIKA PENDAPATAN ---
        // Hitung total dari order yang statusnya 'Done'
        const revenue = ordersData
          .filter((order: any) => order.status === 'Done')
          .reduce((acc: number, curr: any) => acc + (curr.totalPrice || 0), 0);

        // Ambil 7 pesanan terbaru untuk tabel
        const latest7Orders = ordersData.slice(0, 7);
        setRecentOrders(latest7Orders);
        
        // Ambil data produk (untuk statistik Total Products)
        const { data: productsData } = await api.get('/api/products');

        // Update state statistik
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
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="container-fluid p-4">
        {/* Header Dashboard */}
        <h1 className="display-5 fw-bold mb-4" style={{ color: 'var(--color-text)' }}>
          Dashboard
        </h1>

        {/* Kartu Statistik */}
        <div className="row g-4 mb-5">
          
          {/* Pesanan Baru */}
          <div className="col-lg-4 col-md-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex align-items-center">
                <span className="me-3">
                  <FaShoppingBag size={30} color="var(--color-accent)" />
                </span>
                <div>
                  <h5 className="card-title text-muted mb-1">Pesanan Baru (24 Jam)</h5>
                  <p className="card-text h3 fw-bold">
                    {loading ? '...' : stats.newOrdersCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Produk */}
          <div className="col-lg-4 col-md-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex align-items-center">
                <span className="me-3">
                  <FaChartBar size={30} color="var(--color-accent)" />
                </span>
                <div>
                  <h5 className="card-title text-muted mb-1">Total Produk</h5>
                  <p className="card-text h3 fw-bold">
                    {loading ? '...' : stats.totalProductsCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Pendapatan (BARU) */}
          <div className="col-lg-4 col-md-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex align-items-center">
                <span className="me-3">
                  <FaMoneyBillWave size={30} color="var(--color-accent)" />
                </span>
                <div>
                  <h5 className="card-title text-muted mb-1">Total Pendapatan</h5>
                  <p className="card-text h3 fw-bold text-success">
                    {/* Format Rupiah */}
                    {loading 
                      ? '...' 
                      : `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`
                    }
                  </p>
                  <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                    (Dari pesanan selesai)
                  </small>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Section Pesanan Terbaru */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <h3 className="fw-bold mb-0">Pesanan Terbaru</h3>
            <small className="text-muted">7 Pesanan Terakhir</small>
          </div>
          <div className="card-body p-4">
            {loading ? (
              <p className="text-center py-3">Memuat data...</p>
            ) : recentOrders.length === 0 ? (
              <p className="text-muted text-center py-3">Belum ada pesanan terbaru.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Customer</th>
                      <th scope="col">No. HP</th>
                      <th scope="col">Kue</th>
                      <th scope="col">Harga</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="fw-bold text-primary">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td>{order.customerName}</td>
                        <td>{order.customerPhone}</td>
                        <td>{order.cakeType}</td>
                        <td>
                          {order.totalPrice 
                            ? `Rp ${order.totalPrice.toLocaleString('id-ID')}` 
                            : '-'}
                        </td>
                        <td>
                          <span className={`badge bg-${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
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

// Helper function untuk warna badge status
function getStatusColor(status: string) {
  switch (status) {
    case 'Pending': return 'warning';
    case 'Confirmed': return 'info';
    case 'In Progress': return 'primary';
    case 'Shipped': return 'secondary';
    case 'Done': return 'success';
    case 'Cancelled': return 'danger';
    default: return 'secondary';
  }
}