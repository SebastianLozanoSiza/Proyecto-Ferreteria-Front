import { Respuesta } from "./respuesta";

export interface ListarPermisosModulos{
    respuesta: Respuesta,
    modulos: modulos[]
}

export interface modulos{
    crear: boolean,
    actualizar: boolean,
    leer: boolean,
    eliminar: boolean,
    nombreModulo: string
}