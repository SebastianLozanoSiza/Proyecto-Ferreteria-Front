import { Respuesta } from "./respuesta";

export interface ListarFerreterias{
    respuesta: Respuesta,
    ferreteria: Ferreteria[]
}

export interface Ferreteria{
    idFerreteria: number,
    nit: string,
    razonSocial: string,
    representante: string,
    fechaRegistro: string
}

export interface CrearFerreteria{
    nit: string,
    razonSocial: string,
    representante: string
}