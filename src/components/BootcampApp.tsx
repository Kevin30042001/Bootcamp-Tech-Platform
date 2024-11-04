// src/components/BootcampApp.tsx
import React, { useState, useEffect } from 'react';

import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged,
    User 
  } from 'firebase/auth';
  import { 
    collection, 
    addDoc, 
    getDocs, 
    query,
    where,
    Timestamp 
  } from 'firebase/firestore';
import { 
  LogIn, 
  LogOut, 
  AlertCircle, 
  Calendar, 
  Clock, 
  DollarSign 
} from 'lucide-react';

// UI Components
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from './ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from './ui/tabs';

// Local imports
import { auth, db } from '../lib/firebase';
import { isUserAdmin } from '../lib/firebase';
import { bootcamps } from '../data/bootcamps';
import type { 
  Bootcamp, 
  Registration, 
  RegistrationFormData 
} from '../types/bootcamp';
import { AdminPanel } from './AdminPanel';
import { AdminManagement } from './AdminManagement';
import { RegistrationDialog } from './RegistrationDialog';
export const BootcampApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await checkAdminStatus(currentUser.email);
        void fetchRegistrations();
      } else {
        setRegistrations([]);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkAdminStatus = async (email: string | null) => {
    if (!email) {
      setIsAdmin(false);
      return;
    }
    const adminStatus = await isUserAdmin(email);
    setIsAdmin(adminStatus);
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('Iniciando proceso de login...');
      
      const provider = new GoogleAuthProvider();
      console.log('Provider creado');
      
      const result = await signInWithPopup(auth, provider);
      console.log('Resultado del popup:', result);
      
      if (result.user) {
        console.log('Usuario autenticado:', result.user.email);
        setMessage('¡Bienvenido!');
        await checkAdminStatus(result.user.email);
      }
    } catch (error: any) {
      console.error('Error detallado:', error);
      console.error('Código de error:', error.code);
      console.error('Mensaje de error:', error.message);
      
      let errorMessage = 'Error al iniciar sesión. ';
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage += 'La ventana de inicio de sesión fue cerrada.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage += 'La solicitud de inicio de sesión fue cancelada.';
          break;
        case 'auth/popup-blocked':
          errorMessage += 'El navegador bloqueó la ventana emergente.';
          break;
        case 'auth/unauthorized-domain':
          errorMessage += 'Este dominio no está autorizado.';
          break;
        default:
          errorMessage += error.message;
      }
      
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setRegistrations([]);
      setMessage('Has cerrado sesión exitosamente.');
      setIsAdmin(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setMessage('Error al cerrar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const q = query(
        collection(db, 'registrations'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const regs: Registration[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        regs.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate(),
        } as Registration);
      });
      setRegistrations(regs);
    } catch (error) {
      console.error('Error al cargar registros:', error);
      setMessage('Error al cargar los registros.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (bootcamp: Bootcamp, formData: RegistrationFormData) => {
    if (!user) {
      setMessage('Debes iniciar sesión para registrarte.');
      return;
    }

    try {
      setLoading(true);
      
      const registrationData = {
        userId: user.uid,
        userEmail: user.email,
        bootcampId: bootcamp.id,
        bootcampName: bootcamp.name,
        schedule: formData.schedule,
        selectedStartDate: formData.selectedStartDate,
        paymentPlan: formData.paymentPlan,
        timestamp: Timestamp.now(),
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'registrations'), registrationData);
      setMessage(`¡Te has registrado exitosamente en ${bootcamp.name}!`);
      await fetchRegistrations();
    } catch (error) {
      console.error('Error al registrar:', error);
      setMessage('Error al procesar el registro. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">Bootcamps Tech</h1>
              <p className="text-muted-foreground">
                Encuentra el bootcamp perfecto para impulsar tu carrera
              </p>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{user.email}</p>
                    {isAdmin && <Badge variant="secondary">Administrador</Badge>}
                  </div>
                  <Button 
                    onClick={handleSignOut} 
                    variant="outline"
                    disabled={loading}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar con Google
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-6 p-4 rounded-lg bg-primary/10 text-primary flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{message}</p>
          </div>
        )}

        <Tabs defaultValue="bootcamps">
          <TabsList>
            <TabsTrigger value="bootcamps">Bootcamps</TabsTrigger>
            {user && (
              <TabsTrigger value="my-registrations">Mis Inscripciones</TabsTrigger>
            )}
            {isAdmin && (
              <>
                <TabsTrigger value="admin">Registros</TabsTrigger>
                <TabsTrigger value="admin-management">Administradores</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="bootcamps">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bootcamps.map((bootcamp) => (
                <Card key={bootcamp.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      {bootcamp.name}
                      <Badge>{bootcamp.level}</Badge>
                    </CardTitle>
                    <CardDescription>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{bootcamp.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Próximo inicio: {new Date(bootcamp.startDates[0]).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="mb-4">{bootcamp.description}</p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Habilidades:</h4>
                        <div className="flex flex-wrap gap-2">
                          {bootcamp.skills.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Instructor:</h4>
                        <p>{bootcamp.instructor}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-4">
                    <div className="w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-2xl font-bold">{bootcamp.price}</span>
                      </div>
                      {bootcamp.paymentPlans[0].discount && (
                        <Badge variant="secondary">
                          Descuento: {bootcamp.paymentPlans[0].discount}
                        </Badge>
                      )}
                    </div>
                    {user ? (
                      <RegistrationDialog
                        bootcamp={bootcamp}
                        onSubmit={(formData) => handleRegistration(bootcamp, formData)}
                        isLoading={loading}
                      />
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={handleGoogleSignIn}
                      >
                        Iniciar sesión para inscribirte
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {user && (
            <TabsContent value="my-registrations">
              <div className="space-y-4">
                {registrations.length > 0 ? (
                  registrations.map((reg) => (
                    <Card key={reg.id}>
                      <CardHeader>
                        <CardTitle>{reg.bootcampName}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Registrado: {reg.timestamp.toLocaleDateString()}</span>
                            <Badge>{reg.status}</Badge>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Horario: {reg.schedule}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>Plan de pago: {reg.paymentPlan}</span>
                            <Badge variant="outline">{reg.paymentStatus}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Fecha de inicio: {new Date(reg.selectedStartDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No tienes inscripciones</CardTitle>
                      <CardDescription>
                        Inscríbete en alguno de nuestros bootcamps para comenzar tu journey.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </div>
            </TabsContent>
          )}

          {isAdmin && (
            <>
              <TabsContent value="admin">
                <AdminPanel isAdmin={isAdmin} />
              </TabsContent>
              <TabsContent value="admin-management">
                <AdminManagement />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
};