// src/components/AdminManagement.tsx
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc,
  doc,
  query,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface Admin {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
}

export const AdminManagement = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    void fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const adminRef = collection(db, 'admins');
      const snapshot = await getDocs(adminRef);
      const adminList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Admin[];
      setAdmins(adminList);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setMessage('Error al cargar administradores');
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      setMessage('Por favor ingresa un correo válido');
      return;
    }

    try {
      setLoading(true);
      // Verificar si ya existe
      const q = query(collection(db, 'admins'), where('email', '==', newAdminEmail));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setMessage('Este correo ya está registrado como administrador');
        return;
      }

      await addDoc(collection(db, 'admins'), {
        email: newAdminEmail,
        role: 'admin',
        createdAt: Timestamp.now()
      });
      
      setNewAdminEmail('');
      setMessage('Administrador agregado exitosamente');
      await fetchAdmins();
    } catch (error) {
      console.error('Error adding admin:', error);
      setMessage('Error al agregar administrador');
    } finally {
      setLoading(false);
    }
  };

  const removeAdmin = async (adminId: string, adminEmail: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar al administrador ${adminEmail}?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteDoc(doc(db, 'admins', adminId));
      setMessage('Administrador eliminado exitosamente');
      await fetchAdmins();
    } catch (error) {
      console.error('Error removing admin:', error);
      setMessage('Error al eliminar administrador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Gestión de Administradores</h2>
        
        <form onSubmit={addAdmin} className="flex gap-4">
          <Input
            type="email"
            placeholder="Correo del nuevo administrador"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Agregando...' : 'Agregar Admin'}
          </Button>
        </form>

        {message && (
          <div className="p-4 rounded-lg bg-primary/10 text-primary flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{message}</p>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.role}</TableCell>
                <TableCell>
                  {admin.createdAt?.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeAdmin(admin.id, admin.email)}
                    disabled={loading}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};