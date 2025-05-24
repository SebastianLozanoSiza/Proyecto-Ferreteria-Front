import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Respuesta } from '../interfaces/respuesta';
import { ConvertirClienteAEmpleado, CrearEmpleado, ListarEmpleados } from '../interfaces/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private http = inject(HttpClient);
  private baseUrl: string = environment.url + "empleados";

  constructor() { }

  listarEmpleados(): Observable<ListarEmpleados> {
    return this.http.get<ListarEmpleados>(`${this.baseUrl}/listarEmpleados`)
  }

  crearEmpleado(empleado: CrearEmpleado): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${this.baseUrl}/crearEmpleado`, empleado)
  }

  cambiarClienteAEmpleado(empleado: ConvertirClienteAEmpleado): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${this.baseUrl}/convertirClienteAEmpleado`, empleado)
  }

  eliminarEmpleado(id: number) {
    return this.http.delete<Respuesta>(`${this.baseUrl}/eliminarEmpleado/${id}`)
  }
}
