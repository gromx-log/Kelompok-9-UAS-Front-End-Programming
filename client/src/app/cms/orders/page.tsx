'use client'; 
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import CmsLayout from '../cmslayout';
import api from '../../../lib/api'; 
import { FaCheck, FaTimes, FaPencilAlt } from 'react-icons/fa';

interface Order {
  age: any;
  _id: string;
  customerName: string; 
  customerPhone: string;
  deliveryAddress: string;
  deliveryDate: string; 
  deliveryTime: string;
  cakeModel: string;
  cakeBase: string;
  mixBase?: string;
  cakeFlavor?: string;
  cakeFilling?: string;
  cakeSize?: string; 
  cakeTiers: number;
  cakeDiameter: string;
  cakeText: string;
  totalPrice: number;
  paymentStatus: 'Unpaid' | 'DP' | 'Paid'; 
  status: string; 
  createdAt: string;
}

const STATUS_OPTIONS = [
  'Pending', 
  'Confirmed', 
  'In Progress', 
  'Ready', 
  'Delivered', 
  'Cancelled' 
];

const PAYMENT_STATUS_OPTIONS = ['Unpaid', 'DP', 'Paid'];
const TABS = [
  { label: 'Semua', filterValues: ['Semua'] },
  { label: 'Perlu Diproses', filterValues: ['Pending', 'Confirmed', 'In Progress'] },
  { label: 'Siap/Dikirim', filterValues: ['Ready', 'Delivered'] }, 
  { label: 'Dibatalkan', filterValues: ['Cancelled'] }
];

export default function CmsOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Perlu Diproses'); 
  
  // State untuk menyimpan nilai sementara saat mode edit aktif
  // Kita gunakan tipe 'any' sementara agar fleksibel untuk harga (number) atau tanggal (string)
  const [tempValues, setTempValues] = useState<{ [key: string]: any }>({});
  
  // Melacak ID baris mana yang sedang diedit
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  // FETCH DATA
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

  // HANDLER EDIT 
  const handleEditClick = (order: Order) => {
    setEditingOrderId(order._id);
    // Simpan nilai awal ke temp state
    setTempValues({
      [`price-${order._id}`]: order.totalPrice,
      [`date-${order._id}`]: order.deliveryDate,
      [`time-${order._id}`]: order.deliveryTime
    });
  };

  // Batal Edit
  const handleCancelClick = () => {
    setEditingOrderId(null);
    setTempValues({});
  };

  // Simpan Perubahan (Harga/Tanggal)
  const handleConfirmClick = async (orderId: string) => {
    const newPrice = tempValues[`price-${orderId}`];
    const newDate = tempValues[`date-${orderId}`];
    const newTime = tempValues[`time-${orderId}`];

    try {
      // kirim semua data yang mungkin berubah
      const payload: any = {};
      if (newPrice !== undefined) payload.totalPrice = newPrice;
      if (newDate !== undefined) payload.deliveryDate = newDate;
      if (newTime !== undefined) payload.deliveryTime = newTime;

      const { data } = await api.put(`/api/orders/${orderId}`, payload);
      
      // Update state utama agar tabel berubah tanpa refresh
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, ...data } : o));
      setEditingOrderId(null);
    } catch (error: any) {
      alert(`Gagal update: ${error.response?.data?.message || 'Error'}`);
    }
  };

  // Handle Perubahan Input Sementara
  const handleTempChange = (key: string, value: any) => {
    setTempValues(prev => ({ ...prev, [key]: value }));
  };

  // Handle Perubahan Dropdown 
  const handleDropdownChange = async (id: string, field: string, value: string) => {
    try {
      // Jika mengubah status order, gunakan endpoint khusus status jika ada, 
      // atau gunakan endpoint general update
      let endpoint = `/api/orders/${id}`;
      if (field === 'status') endpoint = `/api/orders/${id}/status`;
      
      const payload = { [field]: value };
      const { data } = await api.put(endpoint, payload);

      // Update state lokal
      setOrders(prev => prev.map(o => o._id === id ? (field === 'status' ? { ...o, status: value } : { ...o, ...data }) : o));
    } catch (error: any) {
      alert(`Gagal update ${field}: ${error.response?.data?.message || 'Error'}`);
      // Rollback state dengan fetch ulang jika perlu
      const { data } = await api.get('/api/orders');
      setOrders(data);
    }
  };

  // Helper format tanggal untuk input type="date"
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Helper format tanggal untuk tampilan tabel
  const formatDateDisplay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
       day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'Semua') return true;
    const currentTab = TABS.find(tab => tab.label === activeTab);
    // Cek apakah status order ada di dalam list filterValues tab yang aktif
    return currentTab?.filterValues.includes(order.status);
  });

  return (
    <CmsLayout>
      <Head>
        <title>Manajemen Pesanan - KartiniAle CMS</title>
      </Head>

      <div className="container-fluid p-4">
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
              <table className="table table-hover align-middle" style={{ minWidth: '2000px' }}>
                <thead className="table-light">
                  <tr>
                    <th scope="col" style={{width: '100px'}}>ID</th>
                    <th scope="col" style={{minWidth: '150px'}}>Customer</th>
                    <th scope="col" style={{minWidth: '120px'}}>Kontak</th>
                    <th scope="col" style={{minWidth: '200px'}}>Detail Kue</th>
                    <th scope="col" style={{minWidth: '150px'}}>Tulisan & Request</th>
                    <th scope="col" style={{minWidth: '200px'}}>Pengiriman (Edit)</th>
                    <th scope="col" style={{minWidth: '200px'}}>Total Harga (Edit)</th>
                    <th scope="col" style={{minWidth: '150px'}}>Status Bayar (Edit)</th>
                    <th scope="col" style={{minWidth: '180px'}}>Status Order (Edit)</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={9} className="text-center p-5">Memuat data pesanan...</td></tr>
                  ) : filteredOrders.length === 0 ? (
                     <tr><td colSpan={9} className="text-center p-5">
                        <span className="h1 d-block">📋</span>
                        <span className="text-muted">Tidak ada pesanan di tab ini.</span>
                     </td></tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isEditing = editingOrderId === order._id;
                      
                      return (
                        <tr key={order._id}>
                          <td className="fw-bold text-primary">#{order._id.slice(-6).toUpperCase()}</td>
                          
                          {/* Info Customer */}
                          <td>
                            <div className="fw-bold">{order.customerName}</div>
                            <small className="text-muted" style={{fontSize: '0.75rem'}}>{order.deliveryAddress}</small>
                          </td>
                          
                          {/* Kontak */}
                          <td>{order.customerPhone}</td>

                          {/* Detail Kue (Gabungan field model) */}
                          <td>
                            <div className="fw-bold">{order.cakeModel}</div>
                            <small className="d-block">Base: {order.cakeBase} {order.mixBase ? `+ ${order.mixBase}` : ''}</small>
                            <small className="d-block">Ukuran: {order.cakeDiameter} ({order.cakeTiers} Tier)</small>
                            {order.cakeFlavor && <small className="d-block">Rasa: {order.cakeFlavor}</small>}
                          </td>

                          {/* Tulisan Kue */}
                          <td>
                            <div className="fst-italic">&quot;{order.cakeText}&quot;</div>
                            {order.age && <small>Umur: {order.age}</small>}
                          </td>

                          {/* Tanggal & Jam Pengiriman (Editable) */}
                          <td>
                            {isEditing ? (
                              <div className="d-flex flex-column gap-1">
                                <input 
                                  type="date" 
                                  className="form-control form-control-sm"
                                  value={tempValues[`date-${order._id}`] !== undefined ? formatDateForInput(tempValues[`date-${order._id}`]) : formatDateForInput(order.deliveryDate)}
                                  onChange={(e) => handleTempChange(`date-${order._id}`, e.target.value)}
                                />
                                <input 
                                  type="time" 
                                  className="form-control form-control-sm"
                                  value={tempValues[`time-${order._id}`] ?? order.deliveryTime}
                                  onChange={(e) => handleTempChange(`time-${order._id}`, e.target.value)}
                                />
                              </div>
                            ) : (
                              <div>
                                <div>{formatDateDisplay(order.deliveryDate)}</div>
                                <small className="text-muted">{order.deliveryTime} WIB</small>
                              </div>
                            )}
                          </td>

                          {/* Harga (Editable) */}
                          <td className="price-cell-hover">
                            {isEditing ? (
                              <div className="input-group input-group-sm">
                                <span className="input-group-text">Rp</span>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={tempValues[`price-${order._id}`] ?? order.totalPrice}
                                  onChange={(e) => handleTempChange(`price-${order._id}`, parseFloat(e.target.value))}
                                />
                                <button className="btn btn-success" onClick={() => handleConfirmClick(order._id)}><FaCheck/></button>
                                <button className="btn btn-secondary" onClick={handleCancelClick}><FaTimes/></button>
                              </div>
                            ) : (
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold text-success">
                                  Rp {order.totalPrice?.toLocaleString('id-ID')}
                                </span>
                                <button 
                                  className="btn btn-outline-secondary btn-sm ms-2 edit-price-btn"
                                  onClick={() => handleEditClick(order)}
                                  title="Edit Harga/Tanggal"
                                >
                                  <FaPencilAlt />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Status Pembayaran (Dropdown Langsung) */}
                          <td>
                            <select 
                              className={`form-select form-select-sm ${
                                order.paymentStatus === 'Paid' ? 'border-success text-success' : 
                                order.paymentStatus === 'DP' ? 'border-warning text-warning' : 'border-danger text-danger'
                              }`}
                              value={order.paymentStatus}
                              onChange={(e) => handleDropdownChange(order._id, 'paymentStatus', e.target.value)}
                            >
                              {PAYMENT_STATUS_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </td>

                          {/* Status Order (Dropdown Langsung) */}
                          <td>
                            <select 
                              className="form-select form-select-sm"
                              value={order.status}
                              onChange={(e) => handleDropdownChange(order._id, 'status', e.target.value)}
                              style={{fontWeight: 'bold'}}
                            >
                              {STATUS_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </CmsLayout>
  );
}