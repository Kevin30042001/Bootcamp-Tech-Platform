// src/components/RegistrationForm.tsx
import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import type { Bootcamp, RegistrationFormData } from '../types/bootcamp';

interface RegistrationFormProps {
  bootcamp: Bootcamp;
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  isLoading: boolean;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  bootcamp,
  onSubmit,
  isLoading
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({
    bootcampId: bootcamp.id
  });

  const scheduleOptions = Object.entries(bootcamp.schedule).map(([key, value]) => ({
    id: key,
    label: value
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.schedule) {
      await onSubmit(formData as RegistrationFormData);
      setOpen(false);
    }
  };

  const updateFormData = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Inscribirse</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inscripción - {bootcamp.name}</DialogTitle>
          <DialogDescription>
            Complete los detalles de su inscripción
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schedule">Horario</Label>
            <Select
              onValueChange={(value) => updateFormData('schedule', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un horario" />
              </SelectTrigger>
              <SelectContent>
                {scheduleOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Fecha de inicio</Label>
            <Select
              onValueChange={(value) => updateFormData('selectedStartDate', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione fecha de inicio" />
              </SelectTrigger>
              <SelectContent>
                {bootcamp.startDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentPlan">Plan de pago</Label>
            <Select
              onValueChange={(value) => updateFormData('paymentPlan', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione plan de pago" />
              </SelectTrigger>
              <SelectContent>
                {bootcamp.paymentPlans.map((plan) => (
                  <SelectItem key={plan.type} value={plan.type}>
                    {plan.type} - {plan.price}
                    {plan.discount && ` (-${plan.discount})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-8">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !formData.schedule || !formData.selectedStartDate || !formData.paymentPlan}
            >
              {isLoading ? 'Procesando...' : 'Confirmar inscripción'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};