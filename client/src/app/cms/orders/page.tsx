'use client'; 
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import CmsLayout from '../cmslayout';
import api from '../../../lib/api'; 
import { FaCheck, FaTimes, FaPencilAlt } from 'react-icons/fa';

interface Order {
  _id: string;
  customerName: string; 
  status: string; 
  createdAt: string;
  totalPrice: number;
  paymentStatus: string;
  deliveryDate: string; 
}

// Opsi dropdown untuk Status Order
const STATUS_OPTIONS = [
  'Pending', 
  'Confirmed', 
  'In Progress', 
  'Shipped', 
  'Done', 
  'Cancelled' 
];

// Opsi dropdown untuk Status Pembayaran 
const PAYMENT_STATUS_OPTIONS = ['Belum Bayar', 'DP', 'Lunas'];

// Mapping Tab 
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
  
  // State untuk menyimpan perubahan harga sementara
  const [tempPrices, setTempPrices] = useState<{ [key: string]: number }>({});
  
  // State baru untuk melacak ID baris yang harganya sedang diedit
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  // Ambil data pesanan
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('https://kelompok-9-uas-front-end-programming-production.up.railway.app/api/orders');
        setOrders(data);
      } catch (error) {
        console.error("Gagal mengambil data pesanan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Handler untuk STATUS ORDER
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Panggil endpoint /status
      await api.put(`https://kelompok-9-uas-front-end-programming-production.up.railway.app/api/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map(order => 
        order._id === id ? { ...order, status: newStatus } : order
      ));
    } catch (error: any) {
      alert(`Gagal update status: ${error.response?.data?.message || 'Error'}`);
    }
  };

  // handler untuk detail lainnya (Tgl Kirim, Status Bayar, Harga)
  const handleDetailChange = async (id: string, field: string, value: string | number) => {
    try {
      // Panggil endpoint general PUT /api/orders/:id
      const { data } = await api.put(`https://kelompok-9-uas-front-end-programming-production.up.railway.app/api/orders/${id}`, { [field]: value });
      
      // Update state lokal dengan data terbaru dari server
      setOrders(orders.map(order => 
        order._id === id ? data : order
      ));
    } catch (error: any) {
      alert(`Gagal update ${field}: ${error.response?.data?.message || 'Error'}`);
      // Jika gagal, muat ulang data untuk membatalkan perubahan
      const { data } = await api.get('https://kelompok-9-uas-front-end-programming-production.up.railway.app/api/orders');
      setOrders(data);
    }
  };
  
  // Handler saat tombol "Edit" harga diklik
  const handleEditClick = (order: Order) => {
    setEditingOrderId(order._id);
    // Masukkan harga saat ini ke dalam state temporer
    setTempPrices(prev => ({ ...prev, [order._id]: order.totalPrice }));
  };

  // Handler saat tombol "Batal" (X) diklik
  const handleCancelClick = () => {
    setEditingOrderId(null);
    // Hapus harga temporer
    setTempPrices(prev => {
      const newState = { ...prev };
      if (editingOrderId) {
        delete newState[editingOrderId];
      }
      return newState;
    });
  };

  // Handler saat tombol "Simpan" (Centang) diklik
  const handleConfirmClick = async (orderId: string) => {
    const newPrice = tempPrices[orderId];
    if (newPrice !== undefined && !isNaN(newPrice)) {
      // Panggil API untuk update harga
      await handleDetailChange(orderId, 'totalPrice', newPrice);
    }
    // Keluar dari mode edit
    setEditingOrderId(null);
  };

  // Handler untuk menyimpan perubahan harga di state sementara saat diketik
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, orderId: string) => {
    setTempPrices(prev => ({ ...prev, [orderId]: parseFloat(e.target.value) || 0 }));
  };

  // Helper untuk memformat tanggal ke YYYY-MM-DD
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Logika filter (tetap sama)
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
            <table className="table table-hover align-middle" style={{ minWidth: '1000px' }}>
              <thead className="table-light">
                <tr>
                  <th scope="col">ID Pesanan</th>
                  <th scope="col">Customer</th>
                  <th scope="col" style={{minWidth: '170px'}}>Tgl. Kirim (Edit)</th>
                  <th scope="col" style={{minWidth: '220px'}}>Total Harga (Edit)</th>
                  <th scope="col" style={{minWidth: '170px'}}>Status Bayar (Edit)</th>
                  <th scope="col" style={{minWidth: '170px'}}>Status Order (Edit)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center p-5">Memuat data pesanan...</td></tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="fw-bold">...{order._id.slice(-6)}</td>
                      <td>{order.customerName || 'N/A'}</td>
                      
                      {/* --- KOLOM TANGGAL KIRIM (EDITABLE) --- */}
                      <td>
                        <input
                          type="date"
                          className="form-control"
                          value={formatDateForInput(order.deliveryDate)}
                          onChange={(e) => handleDetailChange(order._id, 'deliveryDate', e.target.value)}
                        />
                      </td>

                      {/* --- KOLOM HARGA (EDITABLE DENGAN TOMBOL) --- */}
                      <td className="price-cell-hover"> 
                        {editingOrderId === order._id ? (
                          // Tampilan saat mode EDIT
                          <div className="input-group">
                            <span className="input-group-text">Rp</span>
                            <input
                              type="number"
                              className="form-control"
                              value={tempPrices[order._id] ?? 0}
                              onChange={(e) => handlePriceChange(e, order._id)}
                            />
                            <button 
                              className="btn btn-success" 
                              type="button" 
                              onClick={() => handleConfirmClick(order._id)}
                              title="Simpan"
                            >
                              <FaCheck />
                            </button>
                            <button 
                              className="btn btn-secondary" 
                              type="button" 
                              onClick={handleCancelClick}
                              title="Batal"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          // Tampilan saat mode NORMAL
                          <div className="d-flex justify-content-between align-items-center">
                            <span>
                              {order.totalPrice != null 
                              ? `Rp ${order.totalPrice.toLocaleString('id-ID')}` 
                              : 'N/A'}
                            </span>
                            <button 
                              className="btn btn-outline-secondary btn-sm ms-2 edit-price-btn" 
                              type="button"
                              onClick={() => handleEditClick(order)}
                              title="Edit Harga"
                            >
                              <FaPencilAlt />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* --- KOLOM STATUS BAYAR (EDITABLE) --- */}
                      <td>
                        <select 
                          className="form-select" 
                          value={order.paymentStatus || 'Belum Bayar'}
                          onChange={(e) => handleDetailChange(order._id, 'paymentStatus', e.target.value)}
                        >
                          {PAYMENT_STATUS_OPTIONS.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>

                      {/* --- KOLOM STATUS ORDER (TETAP SAMA) --- */}
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