require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración CORS (Importante para que Angular pueda conectarse)
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200', // Permite conexiones desde Angular
    credentials: true, // Permite que las cookies de sesión viajen entre Angular y Node
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true solo si usas HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 día
    }
}));

// Usar las rutas
app.use('/api', apiRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
    console.log(`📡 Esperando conexiones desde ${process.env.FRONTEND_URL || 'http://localhost:4200'}`);
});