const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const { identificacion_ci, nombres, apellidos, telefono, correo, contrasena, fecha_nacimiento } = req.body;

        if (!identificacion_ci || !correo || !contrasena) {
            return res.status(400).json({ success: false, error: 'Datos incompletos' });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const contrasena_hashed = await bcrypt.hash(contrasena, salt);
        const fecha_registro = new Date();

        const sql = `INSERT INTO usuarios (identificacion_ci, nombres, apellidos, telefono, contrasena, fecha_registro, fecha_nacimiento, correo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        await pool.execute(sql, [identificacion_ci, nombres, apellidos, telefono, contrasena_hashed, fecha_registro, fecha_nacimiento, correo]);

        res.json({ success: true, message: 'Usuario registrado correctamente' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, error: 'El CI o Correo ya están registrados' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const [rows] = await pool.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, error: 'Usuario no encontrado' });
        }

        const usuario = rows[0];
        const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!validPassword) {
            return res.status(401).json({ success: false, error: 'Contraseña incorrecta' });
        }

        // Guardar sesión en el servidor
        req.session.userId = usuario.identificacion_ci;
        req.session.userName = usuario.nombres;

        res.json({ 
            success: true, 
            message: 'Login exitoso', 
            user: { 
                ci: usuario.identificacion_ci, 
                nombre: usuario.nombres,
                correo: usuario.correo 
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ success: false, error: 'Error al cerrar sesión' });
        res.clearCookie('connect.sid'); 
        res.json({ success: true, message: 'Sesión cerrada' });
    });

};
// --- PERFIL (La corrección clave) ---
exports.obtenerPerfil = async (req, res) => {
    

    try {
        // 1. Verificar sesión
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ success: false, error: 'No autorizado' });
        }
        const userId = req.session.userId;

        // 2. Obtener datos personales
        const [usuarios] = await pool.query(
            "SELECT identificacion_ci, nombres, apellidos, telefono, correo FROM usuarios WHERE identificacion_ci = ?", 
            [userId]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }

        // 3. Obtener historial de reservas
        // CORRECCIÓN SQL: Usamos una subconsulta o eliminamos p.estado del GROUP BY implícito
        const sqlReservas = `
            SELECT 
                r.reserva_id, r.fecha_entrada, r.fecha_salida, r.estado, r.numero_habitacion, r.numero_huespedes,
                (SELECT COALESCE(SUM(monto), 0) FROM pagos WHERE reserva_id = r.reserva_id) as total_pago,
                (SELECT estado FROM pagos WHERE reserva_id = r.reserva_id LIMIT 1) as estado_pago
            FROM reservas r
            WHERE r.cliente_ci = ?
            ORDER BY r.fecha_entrada DESC
        `;
        
        const [reservas] = await pool.query(sqlReservas, [userId]);

        res.json({
            success: true,
            perfil: usuarios[0],
            reservas: reservas
        });

    } catch (error) {
        console.error("Error obteniendo perfil:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};