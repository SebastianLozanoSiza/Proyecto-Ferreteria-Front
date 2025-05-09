import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login, RespuestaLogin } from '../interfaces/login';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { NuevoUsuario } from '../interfaces/nuevo-usuario';
import { Respuesta, } from '../interfaces/respuesta';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  private http = inject(HttpClient);
  private baseUrl: string = environment.url;

  constructor() { }

  login(login: Login):Observable<RespuestaLogin>{
    return this.http.post<RespuestaLogin>(`${this.baseUrl}login`, login)
  }

  nuevoUsuario(nuevoUsuario: NuevoUsuario): Observable<Respuesta>{
    return this.http.post<Respuesta>(`${this.baseUrl}registrarNuevo`, nuevoUsuario);
  }
}
