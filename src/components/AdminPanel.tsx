// src/components/AdminPanel.tsx
import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Pencil, 
  Trash2, 
  Search, 
  Download,
  Filter,
  RefreshCcw
} from 'lucide-react';
import { db } from '../lib/firebase';
import type { Registration } from '../types/bootcamp';

interface AdminPanelProps {
  isAdmin: boolean;
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';
type PaymentStatus = 'all' | 'pending' | 'partial' | 'completed';

export const AdminPanel: React.FC<AdminPanelProps> = ({ isAdmin }) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus>('all');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  useEffect(() => {
    if (isAdmin) {
      void fetchRegistrations();
    }
  }, [isAdmin]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const registrationsRef = collection(db, 'registrations');
      const q = query(registrationsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const regs: Registration[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        regs.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate()
        } as Registration);
      });
      
      setRegistrations(regs);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (registrationId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      setLoading(true);
      const registrationRef = doc(db, 'registrations', registrationId);
      await updateDoc(registrationRef, { 
        status: newStatus,
        lastUpdated: Timestamp.now()
      });
      await fetchRegistrations();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentUpdate = async (registrationId: string, newStatus: 'pending' | 'partial' | 'completed') => {
    try {
      setLoading(true);
      const registrationRef = doc(db, 'registrations', registrationId);
      await updateDoc(registrationRef, { 
        paymentStatus: newStatus,
        lastUpdated: Timestamp.now()
      });
      await fetchRegistrations();
    } catch (error) {
      console.error('Error updating payment status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (registrationId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta inscripción?')) {
      try {
        setLoading(true);
        const registrationRef = doc(db, 'registrations', registrationId);
        await deleteDoc(registrationRef);
        await fetchRegistrations();
      } catch (error) {
        console.error('Error deleting registration:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateNotes = async (registrationId: string, notes: string) => {
    try {
      setLoading(true);
      const registrationRef = doc(db, 'registrations', registrationId);
      await updateDoc(registrationRef, { 
        notes,
        lastUpdated: Timestamp.now()
      });
      await fetchRegistrations();
    } catch (error) {
      console.error('Error updating notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Email',
      'Bootcamp',
      'Fecha de Registro',
      'Estado',
      'Estado de Pago',
      'Horario',
      'Plan de Pago'
    ];

    const csvData = registrations.map(reg => [
      reg.id,
      reg.userEmail,
      reg.bootcampName,
      reg.timestamp.toLocaleString(),
      reg.status,
      reg.paymentStatus,
      reg.schedule,
      reg.paymentPlan
    ]);

    const csv = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredRegistrations = registrations
    .filter(reg => 
      reg.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.bootcampName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(reg => statusFilter === 'all' || reg.status === statusFilter)
    .filter(reg => paymentFilter === 'all' || reg.paymentStatus === paymentFilter);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPaymentBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'partial': return 'warning';
      default: return 'secondary';
    }
  };

  if (!isAdmin) return null;
  if (loading) return <div className="flex justify-center p-8">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por email o bootcamp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: FilterStatus) => setStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="approved">Aprobado</SelectItem>
              <SelectItem value="rejected">Rechazado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={(value: PaymentStatus) => setPaymentFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Estado de pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los pagos</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="partial">Parcial</SelectItem>
              <SelectItem value="completed">Completado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" onClick={() => void fetchRegistrations()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Bootcamp</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead>Horario</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegistrations.map((reg) => (
              <TableRow key={reg.id}>
                <TableCell>{reg.userEmail}</TableCell>
                <TableCell>{reg.bootcampName}</TableCell>
                <TableCell>{reg.timestamp.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(reg.status)}>
                    {reg.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getPaymentBadgeVariant(reg.paymentStatus)}>
                    {reg.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>{reg.schedule}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Registro</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">Estado del registro</h4>
                            <Select
                              value={reg.status}
                              onValueChange={(value) => void handleStatusUpdate(reg.id, value as any)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="approved">Aprobado</SelectItem>
                                <SelectItem value="rejected">Rechazado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Estado del pago</h4>
                            <Select
                              value={reg.paymentStatus}
                              onValueChange={(value) => void handlePaymentUpdate(reg.id, value as any)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="partial">Parcial</SelectItem>
                                <SelectItem value="completed">Completado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Notas</h4>
                            <Input
                              defaultValue={reg.notes || ''}
                              onBlur={(e) => void handleUpdateNotes(reg.id, e.target.value)}
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => void handleDelete(reg.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};