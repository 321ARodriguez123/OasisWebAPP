/*const pool = require('../config/db');

exports.crearReserva = async (req, res) => {
    // Verificar si el usuario está logueado
    if (!req.session.userId) {
        return res.status(401).json({ success: false, error: 'No autorizado. Inicie sesión.' });
    }

    try {
        const cliente_ci = req.session.userId;
        const { numero_habitacion, fecha_entrada, fecha_salida, numero_huespedes } = req.body;

        if (!numero_habitacion || !fecha_entrada || !fecha_salida) {
            return res.status(400).json({ success: false, error: 'Faltan datos' });
        }

        const sql = `INSERT INTO reservas (cliente_ci, numero_huespedes, fecha_entrada, fecha_salida, estado, numero_habitacion) VALUES (?, ?, ?, ?, 'Confirmada', ?)`;
        
        await pool.execute(sql, [cliente_ci, numero_huespedes, fecha_entrada, fecha_salida, numero_habitacion]);

        res.json({ success: true, message: 'Reserva creada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};*/

/*const pool = require('../config/db');

// API 1: OBTENER TIPOS DE HABITACIÓN (Para el primer select)
exports.obtenerTiposHabitacion = async (req, res) => {
    try {
        const [tipos] = await pool.query("SELECT tipo_habitacion_id, nombre_tipo, precio_base FROM tipo_habitaciones");
        res.json({ success: true, tipos });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// API 1.5: OBTENER SERVICIOS (Para generar los checkboxes dinámicamente)
exports.obtenerServicios = async (req, res) => {
    try {
        const [servicios] = await pool.query("SELECT servicio_id, nombre_servicio, precio FROM servicios WHERE disponibilidad = 'Disponible'");
        res.json({ success: true, servicios });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// API 2: BUSCAR DISPONIBILIDAD (Simulación)
exports.buscarDisponibilidad = async (req, res) => {
    try {
        const { tipo_habitacion_id, fecha_entrada, fecha_final } = req.body; // Nota: 'fecha_final' según tu HTML

        if (!tipo_habitacion_id || !fecha_entrada || !fecha_final) {
            return res.status(400).json({ success: false, error: 'Faltan datos.' });
        }

        // 1. Buscar habitación física libre
        const sqlBuscar = `
            SELECT h.numero_habitacion, t.precio_base
            FROM habitaciones h
            JOIN tipo_habitaciones t ON h.tipo_habitacion_id = t.tipo_habitacion_id
            WHERE h.tipo_habitacion_id = ?
            AND h.condicion_habitacion = 'habilitado'
            AND h.numero_habitacion NOT IN (
                SELECT r.numero_habitacion
                FROM reservas r
                WHERE r.estado = 'Confirmada'
                AND (
                    (r.fecha_entrada <= ? AND r.fecha_salida >= ?) OR
                    (r.fecha_entrada <= ? AND r.fecha_salida >= ?) OR
                    (? <= r.fecha_entrada AND ? >= r.fecha_entrada)
                )
            )
            LIMIT 1
        `;

        const [rooms] = await pool.execute(sqlBuscar, [
            tipo_habitacion_id, 
            fecha_final, fecha_entrada, 
            fecha_final, fecha_entrada, 
            fecha_entrada, fecha_final
        ]);

        if (rooms.length === 0) {
            return res.json({ success: false, available: false, message: 'No hay habitaciones disponibles.' });
        }

        const habitacion = rooms[0];

        // 2. Calcular Extras de Habitación
        const sqlExtras = `
            SELECT COALESCE(SUM(c.precio_adicional), 0) as total_extras
            FROM habitacion_caracteristicas hc
            JOIN caracteristicas c ON hc.caracteristica_id = c.caracteristica_id
            WHERE hc.numero_habitacion = ?
        `;
        const [extras] = await pool.execute(sqlExtras, [habitacion.numero_habitacion]);
        
        const precioNoche = parseFloat(habitacion.precio_base) + parseFloat(extras[0].total_extras);
        
        // 3. Calcular Noches
        const d1 = new Date(fecha_entrada);
        const d2 = new Date(fecha_final);
        const noches = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)) || 1;

        res.json({
            success: true,
            available: true,
            resultado: {
                numero_habitacion: habitacion.numero_habitacion,
                total_estimado: precioNoche * noches
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// API 3: CREAR RESERVA (Guardar Todo)
exports.crearReserva = async (req, res) => {
    // Nota: Si usas login, descomenta esto:
    // if (!req.session.userId) return res.status(401).json({ success: false, error: 'No autorizado' });

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Si hay login, usa req.session.userId. Si no, usamos el CI del formulario como cliente_ci
        const { 
            numero_habitacion, fecha_entrada, fecha_final, 
            titular_ci, titular_nombre, titular_apellido, // Datos del Huésped
            servicios // Array de servicios seleccionados [{id: 1, dias: 3}]
        } = req.body;

        const cliente_ci = req.session.userId || titular_ci; // Fallback al CI del formulario si no hay login

        // 1. Re-verificar disponibilidad (Seguridad)
        const sqlCheck = `SELECT count(*) as ocupada FROM reservas WHERE numero_habitacion = ? AND estado = 'Confirmada' AND ((fecha_entrada <= ? AND fecha_salida >= ?) OR (? <= fecha_entrada AND ? >= fecha_entrada))`;
        const [check] = await conn.execute(sqlCheck, [numero_habitacion, fecha_final, fecha_entrada, fecha_entrada, fecha_final]);
        if (check[0].ocupada > 0) throw new Error('Habitación ya no disponible.');

        // 2. Calcular Precio Hospedaje
        const sqlPrecioHab = `
            SELECT t.precio_base, COALESCE(SUM(c.precio_adicional), 0) as total_caracteristicas
            FROM habitaciones h
            JOIN tipo_habitaciones t ON h.tipo_habitacion_id = t.tipo_habitacion_id
            LEFT JOIN habitacion_caracteristicas hc ON h.numero_habitacion = hc.numero_habitacion
            LEFT JOIN caracteristicas c ON hc.caracteristica_id = c.caracteristica_id
            WHERE h.numero_habitacion = ? GROUP BY h.numero_habitacion
        `;
        const [rowsHab] = await conn.execute(sqlPrecioHab, [numero_habitacion]);
        const precioNoche = parseFloat(rowsHab[0].precio_base) + parseFloat(rowsHab[0].total_caracteristicas);
        const d1 = new Date(fecha_entrada);
        const d2 = new Date(fecha_final);
        const noches = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)) || 1;
        const costoHospedaje = precioNoche * noches;

        // 3. Insertar Reserva (Primero aseguramos que el usuario exista si no hay login)
        // Opcional: Insertar usuario si no existe (omitido por brevedad, asumimos cliente existe o trigger)
        
        const sqlReserva = `INSERT INTO reservas (cliente_ci, numero_huespedes, fecha_entrada, fecha_salida, estado, numero_habitacion) VALUES (?, 1, ?, ?, 'Confirmada', ?)`;
        const [resReserva] = await conn.execute(sqlReserva, [cliente_ci, fecha_entrada, fecha_final, numero_habitacion]);
        const reservaId = resReserva.insertId;

        // 4. Insertar HUÉSPED (Titular) en reserva_huespedes
        // IMPORTANTE: Aquí guardamos los datos del formulario "¿Quién va a tomar la reserva?"
        await conn.execute(
            `INSERT INTO reserva_huespedes (reserva_id, ci, nombres, apellidos) VALUES (?, ?, ?, ?)`,
            [reservaId, titular_ci, titular_nombre, titular_apellido]
        );

        // 5. Insertar SERVICIOS en reserva_servicios
        let costoServicios = 0;
        if (servicios && Array.isArray(servicios)) {
            for (const svc of servicios) {
                // Obtener precio real
                const [rowsSvc] = await conn.execute('SELECT precio FROM servicios WHERE servicio_id = ?', [svc.id]);
                if (rowsSvc.length > 0) {
                    const precio = parseFloat(rowsSvc[0].precio);
                    const cantidad = svc.cantidad || 1; // Usamos 'cantidad' o 'dias' según la lógica
                    
                    costoServicios += precio * cantidad;

                    await conn.execute(
                        `INSERT INTO reserva_servicios (servicio_id, reserva_id, cantidad) VALUES (?, ?, ?)`,
                        [svc.id, reservaId, cantidad]
                    );
                }
            }
        }

        // 6. Crear PAGO
        const granTotal = costoHospedaje + costoServicios;
        const descripcion = `Reserva Hab ${numero_habitacion} + Servicios`;
        await conn.execute(
            `INSERT INTO pagos (reserva_id, metodo_pago, monto, fecha, estado, tipo_pago, descripcion) VALUES (?, 'Pendiente', ?, CURDATE(), 'Pendiente', 'Reserva', ?)`,
            [reservaId, granTotal, descripcion]
        );

        await conn.commit();

        res.json({ success: true, message: 'Reserva creada', datos: { reserva_id: reservaId, total: granTotal } });

    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        conn.release();
    }
};*/


const pool = require('../config/db');

// API 1: OBTENER TIPOS
exports.obtenerTiposHabitacion = async (req, res) => {
    try {
        const [tipos] = await pool.query("SELECT tipo_habitacion_id, nombre_tipo, precio_base FROM tipo_habitaciones");
        res.json({ success: true, tipos });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// API 1.5: OBTENER SERVICIOS
exports.obtenerServicios = async (req, res) => {
    try {
        const [servicios] = await pool.query("SELECT servicio_id, nombre_servicio, precio FROM servicios WHERE disponibilidad = 'Disponible'");
        res.json({ success: true, servicios });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// API 2: BUSCAR DISPONIBILIDAD
exports.buscarDisponibilidad = async (req, res) => {
    try {
        const { tipo_habitacion_id, fecha_entrada, fecha_final } = req.body;

        if (!tipo_habitacion_id || !fecha_entrada || !fecha_final) {
            return res.status(400).json({ success: false, error: 'Faltan datos.' });
        }

        const sqlBuscar = `
            SELECT h.numero_habitacion, t.precio_base
            FROM habitaciones h
            JOIN tipo_habitaciones t ON h.tipo_habitacion_id = t.tipo_habitacion_id
            WHERE h.tipo_habitacion_id = ?
            AND h.condicion_habitacion = 'habilitado'
            AND h.numero_habitacion NOT IN (
                SELECT r.numero_habitacion
                FROM reservas r
                WHERE r.estado = 'Confirmada'
                AND (
                    (r.fecha_entrada <= ? AND r.fecha_salida >= ?) OR
                    (r.fecha_entrada <= ? AND r.fecha_salida >= ?) OR
                    (? <= r.fecha_entrada AND ? >= r.fecha_entrada)
                )
            )
            LIMIT 1
        `;

        const [rooms] = await pool.execute(sqlBuscar, [
            tipo_habitacion_id, fecha_final, fecha_entrada, fecha_final, fecha_entrada, fecha_entrada, fecha_final
        ]);

        if (rooms.length === 0) {
            return res.json({ success: false, available: false, message: 'No hay habitaciones disponibles.' });
        }

        const habitacion = rooms[0];

        const sqlExtras = `
            SELECT COALESCE(SUM(c.precio_adicional), 0) as total_extras
            FROM habitacion_caracteristicas hc
            JOIN caracteristicas c ON hc.caracteristica_id = c.caracteristica_id
            WHERE hc.numero_habitacion = ?
        `;
        const [extras] = await pool.execute(sqlExtras, [habitacion.numero_habitacion]);
        
        const precioNoche = parseFloat(habitacion.precio_base) + parseFloat(extras[0].total_extras);
        
        const d1 = new Date(fecha_entrada);
        const d2 = new Date(fecha_final);
        const noches = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)) || 1;

        res.json({
            success: true,
            available: true,
            resultado: {
                numero_habitacion: habitacion.numero_habitacion,
                total_estimado_hospedaje: precioNoche * noches
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// API 3: CREAR RESERVA (CORREGIDO: Recibe numero_huespedes y crea usuario si no existe)
exports.crearReserva = async (req, res) => {
    
    // 1. VERIFICACIÓN DE SESIÓN (Opcional, según tu lógica)
    /* if (!req.session.userId) {
        return res.status(401).json({ success: false, error: 'Sesión no iniciada.' });
    } */

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Si hay sesión usamos esa ID, si no, usamos la del formulario
        const cliente_ci = req.session.userId || req.body.titular_ci; 

        // AHORA RECIBIMOS 'numero_huespedes'
        const { 
            numero_habitacion, fecha_entrada, fecha_final, numero_huespedes,
            titular_ci, titular_nombre, titular_apellido, 
            servicios 
        } = req.body;

        // Validación simple
        const cantPersonas = parseInt(numero_huespedes) || 1;

        // --- CORRECCIÓN ERROR FOREIGN KEY: AUTO-REGISTRO ---
        // Verificamos si el usuario existe antes de insertar la reserva
        const [existingUser] = await conn.execute('SELECT identificacion_ci FROM usuarios WHERE identificacion_ci = ?', [cliente_ci]);

        if (existingUser.length === 0) {
            // Si no existe, lo creamos con datos mínimos para que no falle la FK
            if (!titular_nombre || !titular_apellido) throw new Error("Datos del titular incompletos para registro nuevo.");
            
            await conn.execute(
                `INSERT INTO usuarios (identificacion_ci, nombres, apellidos, telefono, correo, fecha_nacimiento, fecha_registro) 
                 VALUES (?, ?, ?, 0, CONCAT(?, '@guest.com'), CURDATE(), CURDATE())`,
                [cliente_ci, titular_nombre, titular_apellido, cliente_ci]
            );
        }

        // 3. RE-VERIFICAR DISPONIBILIDAD
        const sqlCheck = `SELECT count(*) as ocupada FROM reservas WHERE numero_habitacion = ? AND estado = 'Confirmada' AND ((fecha_entrada <= ? AND fecha_salida >= ?) OR (? <= fecha_entrada AND ? >= fecha_entrada))`;
        const [check] = await conn.execute(sqlCheck, [numero_habitacion, fecha_final, fecha_entrada, fecha_entrada, fecha_final]);
        if (check[0].ocupada > 0) throw new Error('Habitación ya no disponible.');

        // 4. CALCULAR PRECIOS
        const sqlPrecioHab = `
            SELECT t.precio_base, COALESCE(SUM(c.precio_adicional), 0) as total_caracteristicas
            FROM habitaciones h
            JOIN tipo_habitaciones t ON h.tipo_habitacion_id = t.tipo_habitacion_id
            LEFT JOIN habitacion_caracteristicas hc ON h.numero_habitacion = hc.numero_habitacion
            LEFT JOIN caracteristicas c ON hc.caracteristica_id = c.caracteristica_id
            WHERE h.numero_habitacion = ? GROUP BY h.numero_habitacion
        `;
        const [rowsHab] = await conn.execute(sqlPrecioHab, [numero_habitacion]);
        const precioNoche = parseFloat(rowsHab[0].precio_base) + parseFloat(rowsHab[0].total_caracteristicas);
        
        const d1 = new Date(fecha_entrada);
        const d2 = new Date(fecha_final);
        const noches = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)) || 1;
        const costoHospedaje = precioNoche * noches;

        // 5. INSERTAR RESERVA PRINCIPAL (Con el número de huéspedes real)
        const sqlReserva = `INSERT INTO reservas (cliente_ci, numero_huespedes, fecha_entrada, fecha_salida, estado, numero_habitacion) VALUES (?, ?, ?, ?, 'Confirmada', ?)`;
        const [resReserva] = await conn.execute(sqlReserva, [cliente_ci, cantPersonas, fecha_entrada, fecha_final, numero_habitacion]);
        const reservaId = resReserva.insertId;

        // 6. INSERTAR HUÉSPED TITULAR
        if (titular_ci && titular_nombre) {
            await conn.execute(
                `INSERT INTO reserva_huespedes (reserva_id, ci, nombres, apellidos) VALUES (?, ?, ?, ?)`,
                [reservaId, titular_ci, titular_nombre, titular_apellido]
            );
        }

        // 7. INSERTAR SERVICIOS
        let costoServicios = 0;
        if (servicios && Array.isArray(servicios)) {
            for (const svc of servicios) {
                const [rowsSvc] = await conn.execute('SELECT precio FROM servicios WHERE servicio_id = ?', [svc.id]);
                if (rowsSvc.length > 0) {
                    const precio = parseFloat(rowsSvc[0].precio);
                    const cantidad = svc.cantidad || 1;
                    costoServicios += precio * cantidad;

                    await conn.execute(
                        `INSERT INTO reserva_servicios (servicio_id, reserva_id, cantidad) VALUES (?, ?, ?)`,
                        [svc.id, reservaId, cantidad]
                    );
                }
            }
        }

        // 8. PAGO
        const granTotal = costoHospedaje + costoServicios;
        const descripcion = `Reserva Hab ${numero_habitacion} (${cantPersonas} pers) + Servicios`;
        
        await conn.execute(
            `INSERT INTO pagos (reserva_id, metodo_pago, monto, fecha, estado, tipo_pago, descripcion) VALUES (?, 'Pendiente', ?, CURDATE(), 'Pendiente', 'Reserva', ?)`,
            [reservaId, granTotal, descripcion]
        );

        await conn.commit();

        res.json({ success: true, message: 'Reserva creada exitosamente', datos: { reserva_id: reservaId, total: granTotal } });

    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).json({ success: false, error: 'Error: ' + error.message });
    } finally {
        conn.release();
    }
};