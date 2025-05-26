import { inject, Injectable } from '@angular/core';
import { CrearFerreteria, ListarFerreterias } from '../interfaces/ferreteria';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Respuesta } from '../interfaces/respuesta';

@Injectable({
  providedIn: 'root'
})
export class FerreteriaService {

  private http = inject(HttpClient);
  private baseUrl: string = environment.url + "ferreterias";

  constructor() { }

  listarFerreterias(nit: string, razonSocial: string, representante: string): Observable<ListarFerreterias> {
    return this.http.get<ListarFerreterias>(`${this.baseUrl}/listarFerreterias?nit=${nit}&razonSocial=${razonSocial}&representante=${representante}`)
  }

  crearFerreteria(ferreteria: CrearFerreteria): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${this.baseUrl}/crearFerreteria`, ferreteria);
  }

  editarFerreteria(id: number, ferreteria: CrearFerreteria): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${this.baseUrl}/actualizarFerreteria?id=${id}`, ferreteria);
  }

  eliminarFerreteria(id: number): Observable<ListarFerreterias> {
    return this.http.delete<ListarFerreterias>(`${this.baseUrl}/eliminarFerreteria/${id}`);
  }
}
