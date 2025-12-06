const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const reservaController = require('../controllers/reservaController');

// Rutas de Autenticación
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

// Rutas de Reservas
// 1. Catálogo: Tipos de habitación (para el select)
router.get('/habitaciones/tipos', reservaController.obtenerTiposHabitacion);

// 1.5. Catálogo: Servicios adicionales (para los checkboxes dinámicos) ¡NUEVA!
router.get('/habitaciones/servicios', reservaController.obtenerServicios);

// 2. Buscador: Simular reserva (Disponibilidad y Precio)
router.post('/reservas/buscar', reservaController.buscarDisponibilidad);

// 3. Confirmación: Guardar todo (Reserva, Huésped, Servicios, Pago)
router.post('/reservas/crear', reservaController.crearReserva);
router.get('/usuario/perfil', authController.obtenerPerfil);
module.exports = router;