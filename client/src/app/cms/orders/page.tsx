"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import CmsLayout from "../cmslayout";
import axios from "axios";
import { FaCheck, FaTimes, FaPencilAlt } from "react-icons/fa";

// API instance
const api = axios.create({
  baseURL: "https://kelompok-9-uas-front-end-programming-production.up.railway.app/api",
});

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
  paymentStatus: "Unpaid" | "DP" | "Paid";
  orderStatus: string;
  createdAt: string;
}

const STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "In Progress",
  "Ready",
  "Delivered",
  "Cancelled",
];

const PAYMENT_STATUS_OPTIONS = ["Unpaid", "DP", "Paid"];

const TABS = [
  { label: "Semua", values: ["Semua"] },
  { label: "Perlu Diproses", values: ["Pending", "Confirmed", "In Progress"] },
  { label: "Perlu Dikirim", values: ["Ready"] },
  { label: "Selesai", values: ["Delivered"] },
  { label: "Dibatalkan", values: ["Cancelled"] },
];

export default function CmsOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Perlu Diproses");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [temp, setTemp] = useState<any>({});

  // FETCH (SESUI PERMINTAAN)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get(
          "https://kelompok-9-uas-front-end-programming-production.up.railway.app/api/orders"
        );
        setOrders(data);
      } catch (error) {
        console.error("Gagal mengambil data pesanan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // HANDLE EDIT
  const startEdit = (order: Order) => {
    setEditingId(order._id);
    setTemp({
      price: order.totalPrice,
      date: order.deliveryDate,
      time: order.deliveryTime,
    });
  };

  const cancelEdit = () => {
    setTemp({});
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    try {
      const payload: any = {};
      if (temp.price != null) payload.totalPrice = temp.price;
      if (temp.date) payload.deliveryDate = temp.date;
      if (temp.time) payload.deliveryTime = temp.time;

      const { data } = await api.put(`/orders/${id}`, payload);

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, ...data } : o))
      );

      setEditingId(null);
    } catch (err: any) {
      alert("Gagal update: " + (err.response?.data?.message || "Error"));
    }
  };

  // DROPDOWN UPDATE
  const handleSelectUpdate = async (
    id: string,
    field: "paymentStatus" | "orderStatus",
    value: string
  ) => {
    try {
      let endpoint = `/orders/${id}`;
      let payload: any = { [field]: value };

      if (field === "orderStatus") {
        endpoint = `/orders/${id}/status`;
        payload = { status: value };
      }

      const { data } = await api.put(endpoint, payload);

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, [field]: value } : o))
      );
    } catch (err: any) {
      alert(`Gagal update ${field}: ${err.response?.data?.message}`);
    }
  };

  // FILTERING TABS
  const filtered = orders.filter((order) => {
    if (activeTab === "Semua") return true;
    const group = TABS.find((t) => t.label === activeTab);
    return group?.values.includes(order.orderStatus);
  });

  return (
    <CmsLayout>
      <Head>
        <title>Manajemen Pesanan - KartiniAle CMS</title>
      </Head>

      <div className="container-fluid p-4">
        <h1 className="display-5 fw-bold mb-4">Pesanan Saya</h1>

        {/* TABS */}
        <ul className="nav nav-tabs cms-tabs mb-4">
          {TABS.map((t) => (
            <li className="nav-item" key={t.label}>
              <a
                href="#"
                className={`nav-link ${activeTab === t.label ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(t.label);
                }}
              >
                {t.label}
              </a>
            </li>
          ))}
        </ul>

        {/* TABEL */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table
                className="table table-hover align-middle"
                style={{ minWidth: "2000px" }}
              >
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Kontak</th>
                    <th>Detail Kue</th>
                    <th>Tulisan & Request</th>
                    <th>Pengiriman</th>
                    <th>Total Harga</th>
                    <th>Status Bayar</th>
                    <th>Status Order</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="text-center p-5">
                        Memuat...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center p-5">
                        Tidak ada data.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order) => {
                      const isEdit = editingId === order._id;

                      return (
                        <tr key={order._id}>
                          <td className="fw-bold text-primary">
                            #{order._id.slice(-6).toUpperCase()}
                          </td>

                          <td>
                            <div className="fw-bold">{order.customerName}</div>
                            <small className="text-muted">
                              {order.deliveryAddress}
                            </small>
                          </td>

                          <td>{order.customerPhone}</td>

                          <td>
                            <div className="fw-bold">{order.cakeModel}</div>
                            <small>
                              Base: {order.cakeBase}
                              {order.mixBase ? ` + ${order.mixBase}` : ""}
                            </small>
                            <br />
                            <small>
                              Ukuran: {order.cakeDiameter} ({order.cakeTiers} tier)
                            </small>
                            {order.cakeFlavor && (
                              <small className="d-block">Rasa: {order.cakeFlavor}</small>
                            )}
                          </td>

                          <td>
                            <i>&quot;{order.cakeText}&quot;</i>
                            {order.age && <small> — Umur: {order.age}</small>}
                          </td>

                          {/* DELIVERY */}
                          <td>
                            {isEdit ? (
                              <div className="d-flex flex-column gap-1">
                                <input
                                  type="date"
                                  className="form-control form-control-sm"
                                  value={temp.date}
                                  onChange={(e) =>
                                    setTemp({ ...temp, date: e.target.value })
                                  }
                                />
                                <input
                                  type="time"
                                  className="form-control form-control-sm"
                                  value={temp.time}
                                  onChange={(e) =>
                                    setTemp({ ...temp, time: e.target.value })
                                  }
                                />
                              </div>
                            ) : (
                              <>
                                <div>
                                  {new Date(order.deliveryDate).toLocaleDateString(
                                    "id-ID",
                                  )}
                                </div>
                                <small>{order.deliveryTime} WIB</small>
                              </>
                            )}
                          </td>

                          {/* PRICE */}
                          <td>
                            {isEdit ? (
                              <div className="input-group input-group-sm">
                                <span className="input-group-text">Rp</span>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={temp.price}
                                  onChange={(e) =>
                                    setTemp({
                                      ...temp,
                                      price: parseFloat(e.target.value),
                                    })
                                  }
                                />

                                <button
                                  className="btn btn-success"
                                  onClick={() => saveEdit(order._id)}
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  className="btn btn-secondary"
                                  onClick={cancelEdit}
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            ) : (
                              <div className="d-flex justify-content-between">
                                <span className="fw-bold text-success">
                                  Rp {order.totalPrice.toLocaleString("id-ID")}
                                </span>

                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => startEdit(order)}
                                >
                                  <FaPencilAlt />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* PAYMENT STATUS */}
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={order.paymentStatus}
                              onChange={(e) =>
                                handleSelectUpdate(
                                  order._id,
                                  "paymentStatus",
                                  e.target.value,
                                )
                              }
                            >
                              {PAYMENT_STATUS_OPTIONS.map((p) => (
                                <option key={p}>{p}</option>
                              ))}
                            </select>
                          </td>

                          {/* ORDER STATUS */}
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={order.orderStatus}
                              onChange={(e) =>
                                handleSelectUpdate(
                                  order._id,
                                  "orderStatus",
                                  e.target.value,
                                )
                              }
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s}>{s}</option>
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
