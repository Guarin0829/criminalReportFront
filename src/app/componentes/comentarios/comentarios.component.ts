import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { ComentarioDTO } from '../../dto/ComentarioDTO';
import { ComentarioService } from '../../servicios/comentario.service';
import { TokenService } from '../../servicios/token.service';
import { UsuarioService } from '../../servicios/usuario.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent implements OnInit {

  idreporte: string = '';

  //Inicializar Clase
  ComentarioDTO = new ComentarioDTO();

  //Lista Categorias 
  categorias: ComentarioDTO[] 

  //monstrar boton agregar y actualizar :idreporte
  mostrarBotonAgregar: boolean = true;
  
  terminoBusqueda: string = '';

  categoriaSeleccionada: ComentarioDTO = { 
    usuarioId: '',
    comentarioTexto: '', 
    fecha: '', 
    nombre: '',
  };

  usuariosMap: { [id: string]: string } = {}; //OJO

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private categoriasService: ComentarioService, 
    private tokenService:TokenService,
    private userService: UsuarioService, 
    private cdRef: ChangeDetectorRef  
    ){
      this.ComentarioDTO = new ComentarioDTO();
      this.categorias = [];

      this.route.paramMap.subscribe(params => {
      this.idreporte = params.get('idreporte') || '';
    });
    }

  ngOnInit(): void {
    this.getUsuarios();   // cargar la lista de usuarios
    this.getCategorias();
    
  }

  //Limpiar Campos
  limpiarCampos(){
    this.categoriaSeleccionada.comentarioTexto = ""; 
  }

  //Crear*
  agregarComentario(){

    this.ComentarioDTO.comentarioTexto = this.categoriaSeleccionada.comentarioTexto;
    this.ComentarioDTO.usuarioId = this.tokenService.getId();  // <--- Aquí asignas el id del usuario logueado

    this.categoriasService.crearComentario(this.idreporte,this.ComentarioDTO).subscribe({
      next: (data) => {
        console.log('Comentario registrado', JSON.stringify(data));
        
        this.getCategorias();
        // this.router.navigate(["/categoria"]).then(() => {
        //   window.location.reload();
        // });
      },
      error: (error) => {
        console.error(JSON.stringify(error));

        if (error.status === 500) {
          console.error('Error en el servidor');
        } else {
          if (error.error && error.error.mensaje) {
            console.log(error.error.mensaje);
          } else {
            console.log('Se produjo un error, por favor verifica tus datos o intenta más tarde.');
          }
        }
      },
    });
    
  }

  public getCategorias(): void {
  this.categoriasService.obtenerComentarios(this.idreporte).subscribe({
    next: (data) => {
      this.categorias = data.data;

      // Aquí agregas el console.log para ver los usuarioId de cada comentario
      console.log("Comentarios recibidos:");
      this.categorias.forEach((comentario, i) => {
        console.log(`Comentario ${i}:`, comentario.usuarioId);
      });

      console.log("Categorias encontradas: ", JSON.stringify(data));
    },
    error: (error) => {
      console.error(JSON.stringify(error));

      if (error.status === 500) {
        console.error('Error en el servidor');
      } else {
        if (error.error && error.error.mensaje) {
          console.log(error.error.mensaje);
        } else {
          console.log('Se produjo un error, por favor verifica tus datos o intenta más tarde.');
        }
      }
    }
  })
}


  //Buscador Palabras
  public comentarioFiltrados(): ComentarioDTO[] {
    
    if (!this.terminoBusqueda.trim()) {
      return this.categorias;
      
    }
  
    const termino = this.terminoBusqueda.toLowerCase();
    const filtradas = this.categorias.filter(categoria =>
      categoria.comentarioTexto.toLowerCase().includes(termino)
    );
  
    // Si no hay coincidencias, retornar todas las categorías
    return filtradas.length > 0 ? filtradas : this.categorias;
  }




getUsuarios(): Promise<void> {
  return new Promise((resolve, reject) => {
    this.userService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuariosMap = {};
        usuarios.forEach(usuario => {
          this.usuariosMap[usuario.id || ''] = usuario.nombre;
        });
        resolve();
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
        reject(err);
      }
    });
  });
}

getNombreUsuario(id: string): string {
  return this.usuariosMap[id] || id;
}

}
