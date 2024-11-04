// src/components/RegistrationDialog.tsx
import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Label } from "./ui/label";
import type { Bootcamp } from '../types/bootcamp';

interface RegistrationDialogProps {
  bootcamp: Bootcamp;
  onSubmit: (formData: any) => Promise<void>;
  isLoading: boolean;
}

export const RegistrationDialog: React.FC<RegistrationDialogProps> = ({
  bootcamp,
  onSubmit,
  isLoading
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    bootcampId: bootcamp.id,
    bootcampName: bootcamp.name
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schedule || !formData.paymentPlan || !formData.selectedStartDate) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setOpen(false);
      setFormData({
        bootcampId: bootcamp.id,
        bootcampName: bootcamp.name
      }); // Reset form
    } catch (error) {
      console.error('Error al registrar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.schedule && formData.paymentPlan && formData.selectedStartDate;

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isSubmitting) {
        setOpen(newOpen);
      }
    }}>
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
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un horario" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(bootcamp.schedule).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Fecha de inicio</Label>
            <Select
              onValueChange={(value) => updateFormData('selectedStartDate', value)}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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

          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting || !isFormValid}
              className="w-full"
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar inscripción'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};