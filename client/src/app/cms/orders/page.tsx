'use client'; 
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import CmsLayout from '../cmslayout';
import api from '../../../lib/api'; 

interface Order {
 _id: string;
 customerName: string; 
 status: string; 
 createdAt: string;
 totalPrice: number;
 paymentStatus: string;
 deliveryDate: string; 
}

//Opsi dropdown untuk Status Order
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

  // Ambil data pesanan
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

  // Handler untuk STATUS ORDER
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Panggil endpoint /status
      await api.put(`/api/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map(order => 
        order._id === id ? { ...order, status: newStatus } : order
      ));
    } catch (error: any) {
      alert(`Gagal update status: ${error.response?.data?.message || 'Error'}`);
    }
  };

  // handler untuk detail lainnya
  const handleDetailChange = async (id: string, field: string, value: string | number) => {
    try {
      // Panggil endpoint general PUT /api/orders/:id
      await api.put(`/api/orders/${id}`, { [field]: value });
      
      // Update state lokal
      setOrders(orders.map(order => 
        order._id === id ? { ...order, [field]: value } as Order : order
      ));
    } catch (error: any) {
      alert(`Gagal update ${field}: ${error.response?.data?.message || 'Error'}`);
    }
  };
  
  // Handler khusus untuk input harga 
const handlePriceBlur = (e: React.FocusEvent<HTMLInputElement>, orderId: string) => {
  const newPrice = parseFloat(e.target.value);
  if (!isNaN(newPrice)) {
   handleDetailChange(orderId, 'totalPrice', newPrice);
   
   // Buat salinan state, hapus key-nya, lalu return salinan tersebut
   setTempPrices(prev => {
        const newState = { ...prev };
        delete newState[orderId];
        return newState;
      });
  }
 };

  // Handler untuk menyimpan perubahan harga di state sementara saat diketik
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, orderId: string) => {
    setTempPrices(prev => ({ ...prev, [orderId]: parseFloat(e.target.value) }));
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
          
          {/* --- PERBAIKAN: Tambah wrapper table-responsive --- */}
          <div className="table-responsive">
            {/* Tambahkan min-width agar scroll muncul di layar kecil */}
            <table className="table table-hover align-middle" style={{ minWidth: '1000px' }}>
              <thead className="table-light">
                {/* --- PERBAIKAN: Tambah Kolom Baru --- */}
                <tr>
                  <th scope="col">ID Pesanan</th>
                  <th scope="col">Customer</th>
                  <th scope="col" style={{minWidth: '170px'}}>Tgl. Kirim (Edit)</th>
                  <th scope="col" style={{minWidth: '200px'}}>Total Harga (Edit)</th>
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

                      {/* --- KOLOM HARGA (EDITABLE) --- */}
                      <td>
                        <div className="input-group">
                          <span className="input-group-text">Rp</span>
                          <input
                            type="number"
                            className="form-control"
                            // Gunakan temp state untuk value, dan default value untuk render awal
                            value={tempPrices[order._id] ?? order.totalPrice}
                            onChange={(e) => handlePriceChange(e, order._id)}
                            onBlur={(e) => handlePriceBlur(e, order._id)}
                          />
                        </div>
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
          {/* --- AKHIR PERBAIKAN --- */}

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