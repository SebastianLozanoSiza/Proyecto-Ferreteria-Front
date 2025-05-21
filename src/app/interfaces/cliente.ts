import { Respuesta } from "./respuesta"

export interface ListarClientes {
    respuesta: Respuesta,
    clientes: Clientes[]
}

export interface Clientes {
    idTercero: number,
    idCliente: number,
    identificacion: string,
    nombre: string,
    apellidos: string,
    correo: string,
    direccion: string,
    telefono: string,
    nombreUsuario: string
}