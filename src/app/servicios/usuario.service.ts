import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RutasDeNavegacion } from './rutadenavegacion';
import { UsuarioDTO } from '../dto/usuario-dto'; // Ajusta la ruta si es necesario

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = RutasDeNavegacion.apiUrl + "usuarios";

  constructor(private http: HttpClient) { }

  public obtenerUsuarios(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(`${this.baseUrl}`);
  }

  public obtenerUsuarioPorId(id: string): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.baseUrl}/${id}`);
  }

}
