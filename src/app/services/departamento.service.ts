import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { CrearDepartamento, ListarDepartamento } from '../interfaces/departamento';
import { Respuesta } from '../interfaces/respuesta';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private http = inject(HttpClient);
  private baseUrl: string = environment.url + "departamentos/";

  constructor() { }

  listarDepartamentos(nombre: string): Observable<ListarDepartamento> {
    return this.http.get<ListarDepartamento>(`${this.baseUrl}listarDepartamentos?nombre=${nombre}`)
  }

  crearDepartamento(departamento: CrearDepartamento): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${this.baseUrl}crearDepartamento`, departamento)
  }

  actualizarDepartamento(id: number, departamento: CrearDepartamento) {
    return this.http.put<Respuesta>(`${this.baseUrl}actualizarDepartamento?id=${id}`, departamento)
  }

  eliminarDepartamento(id: number) {
    return this.http.delete<Respuesta>(`${this.baseUrl}eliminarDepartamento/{id}?id=${id}`)
  }

}
