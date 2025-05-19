import { Respuesta } from "./respuesta";

export interface ListarProducto{
    respuesta: Respuesta,
    productos: Productos[]
}

export interface Productos{
    idProducto: number,
    nombreProducto: string,
    descripcion: string,
    categoria: string,
    precio: number,
    stock: number,
    razonSocialFerreteria: string
}

export interface CrearProducto{
    nombreProducto: string,
    descripcion: string,
    categoria: string,
    precio: number,
    stock: number,
    idFerreteria: number
}