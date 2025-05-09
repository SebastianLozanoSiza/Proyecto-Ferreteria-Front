import { Respuesta } from "./respuesta";

export interface ListarDepartamento {
    respuesta: Respuesta,
    departamentos: Departamentos[]
}

export interface Departamentos{
    idDepartamento: number,
    nombre: string
}

export interface CrearDepartamento{
    nombre: string
}
