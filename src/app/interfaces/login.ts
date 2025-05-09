import { RespuestaGeneral } from "./respuesta"

export interface Login {
    username: string,
    password: string
}

export interface RespuestaLogin{
    respuesta: RespuestaGeneral,
    token: string
}