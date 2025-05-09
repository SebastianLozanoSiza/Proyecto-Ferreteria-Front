import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NuevoUsuario } from 'src/app/interfaces/nuevo-usuario';
import { AccesoService } from 'src/app/services/acceso.service';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent {

  private router = inject(Router);
  private formBuild = inject(FormBuilder);
  private accesoService = inject(AccesoService);

  constructor() {
  }

  public formNuevoUsuario: FormGroup = this.formBuild.group({
    identificacion: ['', Validators.required],
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    correo: ['', Validators.required],
    direccion: ['', Validators.required],
    telefono: ['', Validators.required],
    nombreUsuario: ['', Validators.required],
    contrasena: ['', Validators.required]
  })

  crearNuevoUsuario() {
    if (this.formNuevoUsuario.invalid) return;

    const nuevoUsuario: NuevoUsuario = {
      identificacion: this.formNuevoUsuario.value.identificacion,
      nombre: this.formNuevoUsuario.value.nombre,
      apellidos: this.formNuevoUsuario.value.apellidos,
      correo: this.formNuevoUsuario.value.correo,
      direccion: this.formNuevoUsuario.value.direccion,
      telefono: this.formNuevoUsuario.value.telefono,
      nombreUsuario: this.formNuevoUsuario.value.nombreUsuario,
      contrasena: this.formNuevoUsuario.value.contrasena
    }

    this.accesoService.nuevoUsuario(nuevoUsuario).subscribe({
      next: (value) => {
        if (!value.respuesta.error) {
          alert(value.respuesta.descripcion);
        } else {
          alert(value.respuesta.descripcion);
        }
      },
      error: (err) => {
        if (err.status === 400 && err.error) {
          alert(err.error.descripcion); 
        } else {
          alert('Ocurrió un error inesperado.');
        }
      },
    })
  }

  iniciarSesion() {
    this.router.navigate(['login']);
  }

}
