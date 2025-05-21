import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ListarFerreterias } from '../interfaces/ferreteria';
import { ListarPermisosModulos } from '../interfaces/permisos';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  private http = inject(HttpClient);
  private baseUrl: string = environment.url + "permisos";

  constructor() { }

  listarModulos(): Observable<ListarPermisosModulos> {
    return this.http.get<ListarPermisosModulos>(`${this.baseUrl}`)
  }
}
