export interface Respuesta {
    respuesta: RespuestaGeneral
}

export interface RespuestaGeneral{
    error: boolean,
    codigo: string,
    descripcion: string
}
