'use client'; 
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import CmsLayout from '../cmslayout';
import api from '../../../lib/api'; 

interface Order {
_id: string;
customerName: string; 
// totalPrice: number; // Dihapus karena tidak ada di model
status: string; 
createdAt: string;
}

const STATUS_OPTIONS = [
 'Pending', 
 'Confirmed', 
 'In Progress', 
 'Shipped', 
 'Done', 
 'Cancelled' 
];

const TABS = [
 { label: 'Semua', filterValues: ['Semua'] },
 { label: 'Perlu Diproses', filterValues: ['Pending', 'Confirmed', 'In Progress'] },
 { label: 'Dikirim', filterValues: ['Shipped'] },
 { label: 'Selesai', filterValues: ['Done'] },
 { label: 'Dibatalkan', filterValues: ['Cancelled'] }
];

export default function CmsOrdersPage() {
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState('Perlu Diproses'); 

useEffect(() => {
 const fetchOrders = async () => {
 try {
  const { data } = await api.get('/api/orders');
  setOrders(data);
 } catch (error) {
  console.error("Gagal mengambil data pesanan:", error);
 } finally {
  setLoading(false);
 }
 };
 fetchOrders();
}, []);

const handleStatusChange = async (id: string, newStatus: string) => {
 try {
 await api.put(`/api/orders/${id}/status`, { status: newStatus });
 setOrders(orders.map(order => 
  order._id === id ? { ...order, status: newStatus } : order
 ));
 } catch (error) {
    // Tampilkan error yang lebih spesifik dari backend
 alert(`Gagal update status: ${error.response?.data?.message || 'Error tidak diketahui'}`);
 }
};

// Logika filter 
const filteredOrders = orders.filter(order => {
  if (activeTab === 'Semua') return true;
  const currentTab = TABS.find(tab => tab.label === activeTab);
  return currentTab?.filterValues.includes(order.status);
 });

return (
 <CmsLayout>
 <Head>
  <title>Manajemen Pesanan - KartiniAle CMS</title>
  <meta name="robots" content="noindex, nofollow" />
 </Head>

 <div className="container-fluid p-4">
  {/* Header */}
  <h1 className="display-5 fw-bold mb-4" style={{ color: 'var(--color-text)' }}>
  Pesanan Saya
  </h1>

  {/* Navigasi Tab */}
  <ul className="nav nav-tabs cms-tabs mb-4">
  {TABS.map(tab => (
   <li className="nav-item" key={tab.label}>
   <a 
    className={`nav-link ${activeTab === tab.label ? 'active' : ''}`} 
    href="#"
    onClick={(e) => { e.preventDefault(); setActiveTab(tab.label); }}
   >
    {tab.label}
   </a>
   </li>
  ))}
  </ul>

  {/* Tabel Pesanan */}
  <div className="card shadow-sm border-0">
  <div className="card-body p-4">
   <div className="table-responsive">
   <table className="table table-hover align-middle">
    <thead className="table-light">
     <tr>
      <th scope="col">ID Pesanan</th>
      <th scope="col">Customer</th>
      <th scope="col">Tanggal</th>
      <th scope="col">Status</th>
     </tr>
    </thead>
    <tbody>
    {loading ? (
     <tr><td colSpan={4} className="text-center p-5">Memuat data pesanan...</td></tr>
    ) : (
     filteredOrders.map((order) => (
     <tr key={order._id}>
      <td className="fw-bold">...{order._id.slice(-6)}</td>
      <td>{order.customerName || 'N/A'}</td>
      <td>{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
      <td>
      <select 
       className="form-select" 
       value={order.status} 
       onChange={(e) => handleStatusChange(order._id, e.target.value)}
      >
       {STATUS_OPTIONS.map(status => (
       <option key={status} value={status}>{status}</option>
       ))}
      </select>
      </td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>
   {!loading && filteredOrders.length === 0 && (
   <div className="text-center p-5">
    <span className="h1">📋</span>
    <h5 className="mt-3">Belum ada pesanan di tab ini.</h5>
  </div>
   )}
  </div>
  </div>
 </div>
 </CmsLayout>
);
}