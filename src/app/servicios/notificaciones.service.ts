import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificacion } from '../dto/notificaciones-dto';  // o donde lo tengas
import { MensajeDTO } from '../dto/MensajeDTO';  // si tienes un DTO para mensajes de respuesta
import { RutasDeNavegacion } from './rutadenavegacion';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private baseURL = RutasDeNavegacion.apiUrl + "notificaciones";

  constructor(private http: HttpClient) {}

  public obtenerNotificacionesPorUsuario(idUsuario: string): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.baseURL}/usuario/${idUsuario}`);
  }

  public marcarNotificacionComoLeida(id: string): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.baseURL}/marcar-leida/${id}`, {});
  }

  public eliminarNotificacion(id: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.baseURL}/${id}`);
  }
  obtenerNotificaciones(email: string): Observable<Notificacion[]> {
  return this.http.get<Notificacion[]>(`/api/notificaciones/usuario/${email}`);
}

}
