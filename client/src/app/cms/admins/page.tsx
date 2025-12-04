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

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const role = localStorage.getItem("role");

        if (role !== "owner") {
          router.push("/cms/dashboard");
          return;
        }

        const { data } = await api.get("/api/admins");
        setAdmins(data.admins ?? data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e: any) => {
    e.preventDefault();

    try {
      await api.post("/api/admins", {
        username: newUsername,
        password: newPassword,
        name: newName,
      });

      const { data } = await api.get("/api/admins");
      setAdmins(data.admins ?? data);

      setNewUsername('');
      setNewPassword('');
      setNewName('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    await api.delete(`/api/admins/${id}`);
    setAdmins((prev) => prev.filter((x) => x._id !== id));
  };

  return (
    <CmsLayout>
      <Head>
        <title>Kelola Admin</title>
      </Head>

      <div className="container p-4">
        <h1>Kelola Admin</h1>

        {loading ? (
          <p>Memuat...</p>
        ) : (
          <table className="table mt-4">
            <thead>
              <tr>
                <th>Username</th>
                <th>Nama</th>
                <th>Role</th>
                <th>Dibuat</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id}>
                  <td>{admin.username}</td>
                  <td>{admin.name ?? '-'}</td>
                  <td>{admin.role}</td>
                  <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                  <td>
                    {admin.role !== "owner" && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteAdmin(admin._id)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <hr />

        <h3>Tambah Admin Baru</h3>

        <form onSubmit={handleCreateAdmin}>
          <input
            className="form-control mb-2"
            placeholder="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <input
            className="form-control mb-2"
            placeholder="Nama"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            className="form-control mb-2"
            placeholder="Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button className="btn btn-primary">Buat Admin</button>
        </form>
      </div>
    </CmsLayout>
  );
}
