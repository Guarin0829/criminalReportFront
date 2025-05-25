import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../../servicios/notificaciones.service';
import { Notificacion } from '../../dto/notificaciones-dto';
import { TokenService } from '../../servicios/token.service';
import { RouterModule } from '@angular/router'; // Importar RouterModule
import { RegistroUsuarioService } from '../../servicios/registro-usuario.service';
import { NgFor, NgIf, NgClass } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-header',
  imports: [RouterModule, NgFor, NgIf, NgClass], // Agregar RouterModule para que funcione routerLink
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  title = 'Home';
  notificaciones: Notificacion[] = [];
  mostrarPanel: boolean = false;
  unreadCount = 0;
  idUsuario: string = '';

  isLogged = false;
  isLoggedCliente = false;
  isLoggedAdministrador = false;

  email: string = '';


  constructor(
    private notificacionesService: NotificacionesService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.isLogged = this.tokenService.isLogged();
    this.isLoggedCliente = this.tokenService.isLoggedCliente();
    this.isLoggedAdministrador = this.tokenService.isLoggedAdmin();

    if (this.isLogged) {
    this.idUsuario = this.tokenService.getEmail();
    this.email = this.idUsuario; // <- Agregado
    this.cargarNotificaciones();
}

  }

  cargarNotificaciones(): void {
  console.log('Llamando a obtenerNotificaciones para:', this.idUsuario);
  this.notificacionesService.obtenerNotificaciones(this.idUsuario).subscribe(data => {
    console.log('Notificaciones recibidas:', data);
    this.notificaciones = data;
    this.unreadCount = this.notificaciones.filter(n => !n.leida).length;
  }, error => {
    console.error('Error al obtener notificaciones:', error);
  });
}


  togglePanel(): void {
    this.mostrarPanel = !this.mostrarPanel;
  }

  logout(): void {
    this.tokenService.logout();
  }

}
