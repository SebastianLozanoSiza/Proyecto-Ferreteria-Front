import { Respuesta } from "./respuesta"

export interface ListarEmpleados {
    respuesta: Respuesta,
    empleados: Empleados[]
}

export interface Empleados {
    idEmpleado: number,
    identificacion: string,
    nombre: string,
    apellidos: string,
    correo: string,
    direccion: string,
    telefono: string,
    nombreUsuario: string,
    idRol: number,
    nombreRol: string,
    idFerreteria: number,
    razonSocial: string
}

export interface CrearEmpleado {
    identificacion: string,
    nombre: string,
    apellidos: string,
    correo: string,
    direccion: string,
    telefono: string,
    idRol: number,
    idFerreteria: number
}

export interface ConvertirClienteAEmpleado {
    idTercero: number,
    idRol: number,
    idFerreteria: number
}