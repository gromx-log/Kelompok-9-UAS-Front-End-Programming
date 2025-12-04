'use client'; 
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import CmsLayout from '../cmslayout';
import api from '../../../lib/api'; 
import { FaCheck, FaTimes, FaPencilAlt, FaExternalLinkAlt, FaClock } from 'react-icons/fa';

interface Order {
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
  age?: number;
  themeDescription: string;
  referenceImageUrl?: string;

  totalPrice: number;
  dpAmount: number;
  remainingPayment: number;
  paymentStatus: 'Unpaid' | 'DP' | 'Paid';
  
  orderStatus: string; 
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

// Mapping Tab
const TABS = [
  { label: 'Semua', filterValues: ['Semua'] },
  { label: 'Perlu Diproses', filterValues: ['Pending'] },
  { label: 'Dikonfirmasi', filterValues: ['Confirmed']},
  { label: 'Diproses', filterValues: ['In Progress']},
  { label: 'Siap Kirim', filterValues: ['Ready'] },
  { label: 'Dikirim', filterValues: ['Delivered'] },
  { label: 'Dibatalkan', filterValues: ['Cancelled'] }
];

export default function CmsOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Perlu Diproses'); 
  
  // State untuk edit harga
  const [tempPrices, setTempPrices] = useState<{ [key: string]: number }>({});
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);



  // FETCH DATA
  useEffect(() => {
      const fetchOrders = async () => {
        try {
          const { data } = await api.get('https://kartini-ale-public.up.railway.app/api/orders');
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
      await api.put(`https://kartini-ale-public.up.railway.app/api/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map(order =>
        order._id === id ? { ...order, orderStatus: newStatus } : order
      ));
    } catch (error: any) {
      alert(`Gagal update status: ${error.response?.data?.message || 'Error'}`);
    }
  };

  // handler untuk detail lainnya (Tgl Kirim, Status Bayar, Harga)
  const handleDetailChange = async (id: string, field: string, value: string | number) => {
    try {
      // Panggil endpoint general PUT /api/orders/:id
      const { data } = await api.put(`https://kartini-ale-public.up.railway.app/api/orders/${id}`, { [field]: value });

      // Update state lokal dengan data terbaru dari server
      setOrders(orders.map(order =>
        order._id === id ? data.order : order
      ));
    } catch (error: any) {
      alert(`Gagal update ${field}: ${error.response?.data?.message || 'Error'}`);
      // Jika gagal, muat ulang data untuk membatalkan perubahan
      const { data } = await api.get('https://kartini-ale-public.up.railway.app/api/orders');
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
    return currentTab?.filterValues.includes(order.orderStatus);
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
            
            {/* Wrapper table-responsive dengan overflow-x auto agar bisa di-scroll ke samping */}
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              {/* Min-width besar agar kolom tidak berantakan dan memaksa scrollbar muncul */}
              <table className="table table-hover align-middle" style={{ minWidth: '1800px' }}>
                <thead className="table-light">
                  <tr>
                    <th scope="col" style={{width: '100px'}}>ID</th>
                    <th scope="col" style={{minWidth: '150px'}}>Customer</th>
                    <th scope="col" style={{minWidth: '120px'}}>Kontak</th>
                    <th scope="col" style={{minWidth: '200px'}}>Detail Kue</th>
                    <th scope="col" style={{minWidth: '150px'}}>Tulisan & Request</th>
                    <th scope="col" style={{minWidth: '180px'}}>Tgl. Kirim (Edit)</th>
                    <th scope="col" style={{minWidth: '220px'}}>Total Harga (Edit)</th>
                    <th scope="col" style={{minWidth: '150px'}}>Status Bayar (Edit)</th>
                    <th scope="col" style={{minWidth: '180px'}}>Status Order (Edit)</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={9} className="text-center p-5">Memuat data pesanan...</td></tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isEditing = editingOrderId === order._id;

                      return (
                        <tr key={order._id}>
                          {/* ID Pesanan */}
                          <td className="fw-bold text-primary">#{order._id.slice(-6).toUpperCase()}</td>
                          
                          {/* Nama Customer */}
                          <td>
                            <div className="fw-bold">{order.customerName || 'N/A'}</div>
                            <small className="text-muted">{order.deliveryAddress}</small>
                          </td>
                          
                          {/* Kontak */}
                          <td>{order.customerPhone || 'N/A'}</td>

                          {/* Detail Kue */}
                          <td>
                            <div className="fw-bold">{order.cakeModel}</div>
                            <small className="d-block">Base: {order.cakeBase || '-'}</small>
                            {order.mixBase && <small className="d-block">Mix Base: {order.mixBase}</small>}
                            <small className="d-block">Rasa: {order.cakeFlavor || '-'}</small>
                            <small className="d-block">Filling: {order.cakeFilling || '-'}</small>
                            <small className="d-block">Tingkat: {order.cakeTiers}</small>
                            <small className="d-block">Diameter: {order.cakeDiameter}</small>
                          </td>

                          {/* Tulisan & Request */}
                          <td>
                            <div className="fst-italic">&quot;{order.cakeText}&quot;</div>
                            <small className="text-muted text-wrap" style={{maxWidth: '200px'}}>
                              {order.themeDescription}
                            </small>
                          </td>
                          
                          {/* Kolom Tgl Kirim (Editable) */}
                          <td>
                            <div className="d-flex align-items-center">
                              <input
                                type="date"
                                className="form-control"
                                value={formatDateForInput(order.deliveryDate)}
                                onChange={(e) => handleDetailChange(order._id, 'deliveryDate', e.target.value)}
                              />
                            </div>

                            {/* Kolom waktu pengiriman (editable) */}
                            <div className="position-relative mt-2">
                              <FaClock
                                className="text-muted"
                                style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  cursor: "pointer",
                                  pointerEvents: "auto",
                                }}
                                onClick={() => {
                                  const selector = `input[data-time-input="${order._id}"]`;
                                  const input = document.querySelector<HTMLInputElement>(selector);
                                  if (!input) return;

                                  input.focus();

                                  const maybeShowPicker = (input as any).showPicker;
                                  if (typeof maybeShowPicker === "function") {
                                    maybeShowPicker.call(input);
                                  }
                                }}
                              />

                              <input
                                type="time"
                                className="form-control"
                                data-time-input={order._id}
                                value={order.deliveryTime ?? ""}
                                onChange={(e) => handleDetailChange(order._id, "deliveryTime", e.target.value)}
                                style={{ paddingRight: "35px" }}
                              />
                            </div>
                          </td>

                          {/* Kolom Harga (Editable dengan tombol) */}
                          <td className="price-cell-hover">
                            {isEditing ? (
                              <div className="input-group input-group-sm">
                                <span className="input-group-text">Rp</span>
                                <input
                                  type="number"
                                  min={0}
                                  className="form-control"
                                  value={tempPrices[order._id] === 0 ? '' : tempPrices[order._id] ?? ''}
                                  onChange={(e) => {
                                    const inputVal = e.target.value;
                                    let val: number | '' = '';
                                    if (inputVal === '') {
                                      val = NaN;  // prevent entering empty string as number
                                    } else {
                                      val = parseFloat(inputVal);
                                      if (isNaN(val) || val < 0) val = 0;
                                    }
                                    setTempPrices(prev => ({ ...prev, [order._id]: val }));
                                  }}
                                />
                                <button className="btn btn-success" onClick={() => handleConfirmClick(order._id)}>
                                  <FaCheck />
                                </button>
                                <button className="btn btn-secondary" onClick={handleCancelClick}>
                                  <FaTimes />
                                </button>
                              </div>
                            ) : (
                              <div className="d-flex flex-column">
                                <span className="fw-bold text-success">
                                  {order.totalPrice != null 
                                    ? `Rp ${order.totalPrice.toLocaleString('id-ID')}` 
                                    : 'N/A'}
                                </span>
                                <small>
                                  Sisa Bayar: Rp {order.remainingPayment.toLocaleString('id-ID')}
                                </small>
                                <button 
                                  className="btn btn-outline-secondary btn-sm mt-1 edit-price-btn" 
                                  type="button"
                                  onClick={() => handleEditClick(order)}
                                  title="Edit Harga"
                                >
                                  <FaPencilAlt />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Kolom Admin Notes / DP Amount */}
                          <td>
                            <input
                              type="number"
                              min={0}
                              className="form-control form-control-sm"
                              value={order.dpAmount === 0 ? '' : order.dpAmount ?? ''}
                              onChange={(e) => {
                                const inputVal = e.target.value;
                                let val: number | '' = '';
                                if (inputVal === '') {
                                  val = NaN;
                                } else {
                                  val = Math.max(0, parseFloat(inputVal));
                                  if (isNaN(val)) val = 0;
                                }
                                handleDetailChange(order._id, 'dpAmount', val);
                              }}
                            />
                            <small className="text-muted">Jumlah DP yang sudah dibayar</small>
                          </td>

                          {/* Kolom Status Bayar (Editable) */}
                          <td>
                            <select 
                              className={`form-select form-select-sm ${
                                order.paymentStatus === 'Paid' ? 'border-success text-success' : 
                                order.paymentStatus === 'DP' ? 'border-warning text-warning' : 'border-danger text-danger'
                              }`}
                              value={order.paymentStatus || 'Unpaid'}
                              onChange={(e) => handleDetailChange(order._id, 'paymentStatus', e.target.value)}
                            >
                              {PAYMENT_STATUS_OPTIONS.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </td>

                          {/* Kolom Status Order (Editable) */}
                          <td>
                            <select 
                              className="form-select form-select-sm"
                              style={{ fontWeight: 'bold' }}
                              value={order.orderStatus} 
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            >
                              {STATUS_OPTIONS.map(status => (
                                <option key={status} value={status}>{status}</option>
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

        {!loading && filteredOrders.length === 0 && (
          <div className="text-center p-5">
            <span className="h1">📋</span>
            <h5 className="mt-3">Belum ada pesanan di tab ini.</h5>
          </div>
        )}
      </div>
    </CmsLayout>
  );
}