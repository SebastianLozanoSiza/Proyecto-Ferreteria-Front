import { inject, Injectable } from '@angular/core';
import { ListarRoles } from '../interfaces/rol';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private http = inject(HttpClient);
  private baseUrl: string = environment.url + "roles";

  constructor() { }

  listarRoles(): Observable<ListarRoles> {
    return this.http.get<ListarRoles>(`${this.baseUrl}/listarRoles`)
  }
}
