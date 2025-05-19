import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ListarDepartamento } from '../interfaces/departamento';
import { CrearProducto, ListarProducto } from '../interfaces/producto';
import { Respuesta } from '../interfaces/respuesta';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private http = inject(HttpClient);
  private baseUrl: string = environment.url + "productos";

  constructor() { }

  listarProductos(nombre: string, categoria: string, razonSocial: string): Observable<ListarProducto> {
    return this.http.get<ListarProducto>(`${this.baseUrl}/listarProductos?nombreProducto=${nombre}&categoria=${categoria}&razonSocial=${razonSocial}`)
  }

  crearProducto(producto: CrearProducto): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${this.baseUrl}/crearProductos`, producto)
  }

  actualizarProducto(id: number, producto: CrearProducto): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${this.baseUrl}/${id}`, producto)
  }

  eliminarProducto(id: number): Observable<Respuesta> {
    return this.http.delete<Respuesta>(`${this.baseUrl}/eliminarProducto/${id}`)
  }
}
