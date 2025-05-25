export class ComentarioDTO{
    constructor(
        public usuarioId: string  = '',
        public comentarioTexto: string = '',
        public fecha: string = '',
        public nombre: string = '',
    ) { }
}