export interface Notificacion {
  id: string;
  idUsuario: string;
  mensaje: string;
  cuerpo: string;
  topic: string;
  fecha: string; // o Date
  leida: boolean;
}
