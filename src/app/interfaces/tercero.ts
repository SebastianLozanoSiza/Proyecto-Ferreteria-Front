import { Respuesta } from "./respuesta";

export interface ListarTerceros{
    respuesta: Respuesta,
    terceros: Tercero[]
}

export interface Tercero{
    idTercero: number,
    identificacion: string,
    nombre: string,
    apellidos: string,
    correo: string,
    direccion: string,
    telefono: string,
    nombreUsuario: string
}

export interface RespuestaEditarTercero{
    respuesta: Respuesta,
    token: string
}