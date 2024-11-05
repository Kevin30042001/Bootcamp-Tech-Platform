// src/services/emailService.ts
import emailjs from '@emailjs/browser';

interface EmailData {
  to: string;
  bootcampName: string;
  schedule: string;
  startDate: string;
}

const SERVICE_ID = "service_fs7rinj";
const TEMPLATE_ID = "template_0x8t6tg";
const PUBLIC_KEY = "yqXWOTT_ASE0Psx89";

export const sendThankYouEmail = async (data: EmailData) => {
  try {
    console.log('Iniciando envío de correo a:', data.to);
    
    // Extraer el nombre del usuario del email de una manera más segura
    const userName = data.to.split('@')[0].charAt(0).toUpperCase() + 
                    data.to.split('@')[0].slice(1);
    
    const templateParams = {
      to_email: data.to,           // Email destino
      to_name: userName,           // Nombre extraído del email
      bootcamp_name: data.bootcampName,
      schedule: data.schedule,
      start_date: data.startDate,
      reply_to: data.to            
    };

    console.log('Parámetros de la plantilla:', templateParams);

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log('Respuesta del servicio:', response);

    if (response.status === 200) {
      console.log('Correo enviado exitosamente a:', data.to);
      return true;
    }
    throw new Error(`Error al enviar el correo: ${response.status}`);
  } catch (error) {
    console.error('Error en el envío del correo:', error);
    throw error;
  }
};