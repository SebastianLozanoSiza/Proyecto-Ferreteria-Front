import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { NuevoUsuario } from '../interfaces/nuevo-usuario';
import { Observable } from 'rxjs';
import { Respuesta } from '../interfaces/respuesta';
import { ListarClientes } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient);
  private baseUrl: string = environment.url + "clientes";

  constructor() { }


  listarClientes(){
    
  }

  buscarClientePorId(nombreUsuario:string):Observable<ListarClientes>{
    return this.http.get<ListarClientes>(`${this.baseUrl}/buscarClientePorUsuario/${nombreUsuario}`)
  }

  editarCliente(id: number, cliente: NuevoUsuario):Observable<Respuesta>{
    return this.http.put<Respuesta>(`${this.baseUrl}/actualizarCliente/${id}`, cliente)
  }

  eliminarCliente(id: number):Observable<Respuesta>{
    return this.http.delete<Respuesta>(`${this.baseUrl}/eliminarCliente/${id}`)
  }

}
