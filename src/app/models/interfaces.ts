export interface User {
    identificacion_ci: string;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string;
    telefono: string;
    correo: string;
    contrasena: string;
}

export interface Room {
    numero_habitacion: string;
    nombre_tipo: string;
    precio_base: number;
}

export interface Service {
    servicio_id: number;
    nombre_servicio: string;
    precio: number;
    selected?: boolean; // Para saber si el usuario lo marcó con el checkbox
    cantidad?: number;  // Para saber cuántos quiere
}