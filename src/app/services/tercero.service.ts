import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ListarTerceros, RespuestaEditarTercero } from '../interfaces/tercero';
import { NuevoUsuario } from '../interfaces/nuevo-usuario';

@Injectable({
  providedIn: 'root'
})
export class TerceroService {

  private http = inject(HttpClient);
  private baseUrl: string = environment.url + "terceros";

  constructor() { }

  buscarTerceroPorNombreDeUsuario(nombreUsuario: string): Observable<ListarTerceros> {
    return this.http.get<ListarTerceros>(`${this.baseUrl}/buscarTerceroPorUsuario/${nombreUsuario}`)
  }

  editarTercero(id: number, cliente: NuevoUsuario): Observable<RespuestaEditarTercero> {
    return this.http.put<RespuestaEditarTercero>(`${this.baseUrl}/actualizarTercero/${id}`, cliente)
  }
}
