// src/components/FAQ.jsx
import React from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BackButton from './BackButton'; // Importar BackButton

const FAQ = () => {
  const preguntas = [
    {
      pregunta: '¿Cómo puedo registrar un nuevo usuario?',
      respuesta: 'Ve a la sección "Registro" en la barra de navegación y completa el formulario con tus datos personales.',
    },
    {
      pregunta: '¿Cómo puedo solicitar un crédito?',
      respuesta: 'Navega a "Solicitar Crédito", completa el formulario con la información requerida y envía tu solicitud.',
    },
    {
      pregunta: '¿Qué documentos necesito para solicitar un crédito?',
      respuesta: 'Necesitarás subir comprobantes de ingresos y avalúos en formato jpg, png o pdf, con un tamaño máximo de 5MB cada uno.',
    },
    {
      pregunta: '¿Cómo puedo ver el estado de mi solicitud?',
      respuesta: 'Ve a la sección "Estado de Solicitudes", ingresa tu nombre completo y haz clic en "Ver Solicitudes" para ver el estado.',
    },
    {
      pregunta: '¿Puedo editar una solicitud después de enviarla?',
      respuesta: 'Sí, en la sección "Estado de Solicitudes" puedes editar una solicitud que aún esté en estado "En Revisión".',
    },
    // Puedes añadir más preguntas según necesidad
  ];

  return (
    <Container style={{ marginTop: '2rem' }}>
      <BackButton />
      <Typography variant="h5" gutterBottom>
        Preguntas Frecuentes (FAQ)
      </Typography>
      {preguntas.map((item, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <Typography>{item.pregunta}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{item.respuesta}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default FAQ;
