import { Respuesta } from "./respuesta"

export interface Login {
    username: string,
    password: string
}

export interface RespuestaLogin{
    respuesta: Respuesta,
    token: string
}