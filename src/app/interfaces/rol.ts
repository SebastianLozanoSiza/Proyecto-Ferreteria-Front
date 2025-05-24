import { Respuesta } from "./respuesta";

export interface ListarRoles{
    respuesta: Respuesta,
    roles: Roles[]
}

export interface Roles{
    idRol: number,
    nombreRol: string
}