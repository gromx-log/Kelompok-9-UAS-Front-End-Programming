'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import CmsLayout from '../cmslayout';
import { FaTrash, FaEdit } from 'react-icons/fa';

interface Admin {
  _id: string;
  username: string;
  fullName?: string;
  role: 'owner' | 'admin';
}

export default function CmsAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

  // State edit admin
  const [editItem, setEditItem] = useState<Admin | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editPassword, setEditPassword] = useState('');

  // State owner profile
  const [ownerFullName, setOwnerFullName] = useState('');
  const [ownerUsername, setOwnerUsername] = useState('');
  const [ownerNewPassword, setOwnerNewPassword] = useState('');

  // State tambah admin baru
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // LOAD DATA
  useEffect(() => {
    if (role !== 'owner') return;

    const loadData = async () => {
      try {
        const { data } = await api.get('/api/admins');
        setAdmins(data.admins || data);

        const owner = data.admins.find((a: Admin) => a.role === 'owner');
        if (owner) {
          setOwnerFullName(owner.fullName || '');
          setOwnerUsername(owner.username || '');
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // UPDATE OWNER PROFILE
  const saveOwnerProfile = async () => {
    try {
      await api.put('/api/owner/profile', {
        fullName: ownerFullName,
        username: ownerUsername,
        password: ownerNewPassword || undefined
      });

      alert('Profil Owner berhasil diperbarui!');

      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/cms/login';
    } catch (err) {
      console.error(err);
      alert('Gagal update profil owner');
    }
  };

  // CREATE ADMIN BARU
  const createNewAdmin = async () => {
    if (!newFullName || !newUsername || !newPassword) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      await api.post('/api/admins', {
        fullName: newFullName,
        username: newUsername,
        password: newPassword
      });

      alert("Admin baru berhasil dibuat!");

      const { data } = await api.get('/api/admins');
      setAdmins(data.admins || data);

      setNewFullName('');
      setNewUsername('');
      setNewPassword('');
    } catch (err) {
      console.error(err);
      alert("Gagal membuat admin");
    }
  };

  // DELETE ADMIN
  const deleteAdmin = async (id: string) => {
    if (!confirm('Yakin ingin menghapus admin ini?')) return;

    try {
      await api.delete(`/api/admins/${id}`);
      setAdmins(admins.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus admin');
    }
  };

  // SAVE EDIT ADMIN
  const saveEditAdmin = async () => {
    if (!editItem) return;

    try {
      await api.put(`/api/admins/${editItem._id}`, {
        fullName: editFullName,
        password: editPassword || undefined,
      });

      alert('Admin diperbarui');

      const { data } = await api.get('/api/admins');
      setAdmins(data.admins || data);

      setEditItem(null);
    } catch (err) {
      console.error(err);
      alert('Gagal update admin');
    }
  };

  if (role !== 'owner') {
    return (
      <CmsLayout>
        <div className="p-4">
          <h3>Akses Ditolak</h3>
          <p>Hanya OWNER yang dapat mengelola admin.</p>
        </div>
      </CmsLayout>
    );
  }

  if (loading) {
    return <CmsLayout><div className="p-4">Memuat data admin...</div></CmsLayout>;
  }

  return (
    <CmsLayout>
      <div className="container p-4">
        <h2>Kelola Admin</h2>

        {/* OWNER PROFILE SECTION */}
        <div className="card p-4 my-4">
          <h4>Edit Profil Owner</h4>

          <label>Nama Lengkap</label>
          <input
            className="form-control mb-2"
            value={ownerFullName}
            onChange={(e) => setOwnerFullName(e.target.value)}
          />

          <label>Username</label>
          <input
            className="form-control mb-2"
            value={ownerUsername}
            onChange={(e) => setOwnerUsername(e.target.value)}
          />

          <label>Password Baru (opsional)</label>
          <input
            type="password"
            className="form-control mb-2"
            value={ownerNewPassword}
            onChange={(e) => setOwnerNewPassword(e.target.value)}
          />

          <button className="btn btn-primary mt-2" onClick={saveOwnerProfile}>
            Simpan Profil Owner
          </button>
        </div>

        {/* NEW ADMIN FORM */}
        <div className="card p-4 my-4">
          <h4>Tambah Admin Baru</h4>

          <label>Nama Lengkap</label>
          <input
            className="form-control mb-2"
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
          />

          <label>Username</label>
          <input
            className="form-control mb-2"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            className="form-control mb-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button className="btn btn-success mt-2" onClick={createNewAdmin}>
            Buat Admin
          </button>
        </div>

        {/* ADMIN LIST TABLE */}
        <h4>Daftar Admin</h4>

        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Username</th>
              <th>Role</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin._id}>
                <td>{admin.fullName || '-'}</td>
                <td>{admin.username}</td>
                <td>{admin.role}</td>
                <td>
                  {admin.role !== 'owner' && (
                    <>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => {
                          setEditItem(admin);
                          setEditFullName(admin.fullName || '');
                          setEditPassword('');
                        }}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteAdmin(admin._id)}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EDIT MODAL */}
        {editItem && (
          <div
            className="modal fade show d-block"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          >
            <div className="modal-dialog">
              <div className="modal-content p-3">

                <h4>Edit Admin: {editItem.username}</h4>

                <label>Nama Lengkap</label>
                <input
                  className="form-control mb-2"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                />

                <label>Password Baru (opsional)</label>
                <input
                  type="password"
                  className="form-control mb-2"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                />

                <div className="d-flex justify-content-end mt-3">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => setEditItem(null)}
                  >
                    Batal
                  </button>
                  <button className="btn btn-primary" onClick={saveEditAdmin}>
                    Simpan Perubahan
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </CmsLayout>
  );
}
