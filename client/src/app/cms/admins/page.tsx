'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import CmsLayout from '../cmslayout';
import api from '../../../lib/api';
import { FaUserPlus, FaTrash, FaUserShield } from 'react-icons/fa';

interface Admin {
  _id: string;
  username: string;
  role: string;
  name?: string;
  createdAt: string;
}

export default function CmsAdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State untuk Form Tambah Admin
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Data Admin (Hanya Owner yang bisa)
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        // Cek role di localStorage dulu untuk UX cepat
        const role = localStorage.getItem('role');
        if (role !== 'owner') {
          alert('Akses Ditolak: Halaman ini hanya untuk Owner.');
          router.push('/cms/dashboard');
          return;
        }

        const { data } = await api.get('https://kartini-ale-public.up.railway.app/api/admins');
        setAdmins(data);
      } catch (err: any) {
        console.error('Gagal mengambil data admin:', err);
        if (err.response?.status === 403) {
          alert('Akses Ditolak: Anda bukan Owner.');
          router.push('/cms/dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [router]);

  // 2. Handler Tambah Admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!newUsername || !newPassword) {
      setError('Username dan Password wajib diisi.');
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post('https://kartini-ale-public.up.railway.app/api/admins', {
        username: newUsername,
        password: newPassword,
        name: newName
      });

      alert('Admin baru berhasil dibuat!');
      
      // Reset form
      setNewUsername('');
      setNewPassword('');
      setNewName('');
      
      // Refresh data
      const { data } = await api.get('https://kartini-ale-public.up.railway.app/api/admins');
      setAdmins(data);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat admin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Handler Hapus Admin
  const handleDeleteAdmin = async (id: string) => {
    if (!confirm('Yakin ingin menghapus admin ini?')) return;

    try {
      await api.delete(`https://kartini-ale-public.up.railway.app/api/admins/${id}`);
      setAdmins(admins.filter(admin => admin._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus admin.');
    }
  };

  return (
    <CmsLayout>
      <Head>
        <title>Kelola Admin - KartiniAle CMS</title>
      </Head>

      <div className="container-fluid p-4">
        <h1 className="display-5 fw-bold mb-4" style={{ color: 'var(--color-text)' }}>
          Kelola Admin
        </h1>

        <div className="row g-4">
          {/* --- KOLOM KIRI: DAFTAR ADMIN --- */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-transparent border-0 pt-4 px-4">
                <h4 className="fw-bold mb-0">Daftar Admin</h4>
              </div>
              <div className="card-body p-4">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Username</th>
                        <th>Nama</th>
                        <th>Role</th>
                        <th>Dibuat Pada</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={5} className="text-center p-4">Memuat...</td></tr>
                      ) : admins.map((admin) => (
                        <tr key={admin._id}>
                          <td className="fw-bold">{admin.username}</td>
                          <td>{admin.name || '-'}</td>
                          <td>
                            <span className={`badge ${admin.role === 'owner' ? 'bg-primary' : 'bg-secondary'}`}>
                              {admin.role}
                            </span>
                          </td>
                          <td>{new Date(admin.createdAt).toLocaleDateString('id-ID')}</td>
                          <td>
                            {admin.role !== 'owner' && (
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDeleteAdmin(admin._id)}
                                title="Hapus Admin"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* --- KOLOM KANAN: FORM TAMBAH ADMIN --- */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 bg-light">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaUserPlus size={24} className="text-primary me-2" />
                  <h4 className="fw-bold mb-0">Tambah Admin Baru</h4>
                </div>
                <p className="text-muted small mb-4">
                  Buat akun untuk staf admin baru. Mereka akan memiliki akses untuk mengelola produk dan pesanan.
                </p>

                <form onSubmit={handleCreateAdmin}>
                  <div className="mb-3">
                    <label className="form-label fw-bold small">Username</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Contoh: admin2"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold small">Nama Lengkap (Opsional)</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Nama Admin"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold small">Password</label>
                    <input 
                      type="password" 
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 karakter"
                      required
                    />
                  </div>

                  {error && <div className="alert alert-danger small py-2">{error}</div>}

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 fw-bold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Memproses...' : 'Buat Akun Admin'}
                  </button>
                </form>
              </div>
            </div>
            
            {/* Info Card */}
            <div className="card shadow-sm border-0 mt-4">
              <div className="card-body p-4">
                <div className="d-flex">
                  <FaUserShield size={40} className="text-warning me-3" />
                  <div>
                    <h6 className="fw-bold">Hak Akses Owner</h6>
                    <p className="text-muted small mb-0">
                      Hanya Anda (Owner) yang dapat melihat halaman ini dan membuat admin baru. Admin biasa tidak memiliki akses ke menu ini.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </CmsLayout>
  );
}