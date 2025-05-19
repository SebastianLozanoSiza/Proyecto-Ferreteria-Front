import { inject, Injectable } from '@angular/core';
import { ListarFerreterias } from '../interfaces/ferreteria';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FerreteriaService {

  private http = inject(HttpClient);
  private baseUrl: string = environment.url + "ferreterias";

  constructor() { }

  listarFerreterias(): Observable<ListarFerreterias> {
    return this.http.get<ListarFerreterias>(`${this.baseUrl}/listarFerreterias`)
  }
}
