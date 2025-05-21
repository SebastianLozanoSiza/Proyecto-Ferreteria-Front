import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NuevoUsuario } from 'src/app/interfaces/nuevo-usuario';
import { Tercero } from 'src/app/interfaces/tercero';
import { TerceroService } from 'src/app/services/tercero.service';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css']
})
export class CrearClienteComponent implements OnInit {

  public formBuild = inject(FormBuilder);
  public terceroService = inject(TerceroService);

  public guardando = false;
  public mostrarPassword = false;
  public mostrarConfirmPassword = false;

  constructor(private dialogRef: MatDialogRef<CrearClienteComponent>, private toastService: ToastrService, @Inject(MAT_DIALOG_DATA) public datosCliente: Tercero) {

  }

  public formEditarCliente: FormGroup = this.formBuild.group({
    identificacion: ['', Validators.required],
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    correo: ['', Validators.required],
    direccion: ['', Validators.required],
    telefono: ['', Validators.required],
    nombreUsuario: ['', Validators.required],
    contrasena: ['', Validators.required]
  })

  ngOnInit(): void {
    this.listarTercero();
  }

  listarTercero() {
    if (this.datosCliente && this.datosCliente.nombreUsuario) {
      this.terceroService.buscarTerceroPorNombreDeUsuario(this.datosCliente.nombreUsuario).subscribe({
        next: (value) => {
          this.formEditarCliente.patchValue({
            identificacion: value.terceros[0].identificacion,
            nombre: value.terceros[0].nombre,
            apellidos: value.terceros[0].apellidos,
            correo: value.terceros[0].correo,
            direccion: value.terceros[0].direccion,
            telefono: value.terceros[0].telefono,
            nombreUsuario: value.terceros[0].nombreUsuario,
          });
        },
        error: (err) => {
          if (err.status === 500) {
            this.toastService.error(err.error.descripcion)
          } else if (err.status === 400) {
            this.toastService.error(err.error.descripcion)
          } else if (err.status === 404) {
            this.toastService.error(err.error.descripcion)
          }
        }
      })
    }
  }

  editarCliente() {
    if (this.formEditarCliente.invalid) {
      this.formEditarCliente.markAllAsTouched();
      return;
    }
    this.guardando = true;

    const tercero: NuevoUsuario = {
      identificacion: this.formEditarCliente.value.identificacion,
      nombre: this.formEditarCliente.value.nombre,
      apellidos: this.formEditarCliente.value.apellidos,
      correo: this.formEditarCliente.value.correo,
      direccion: this.formEditarCliente.value.direccion,
      telefono: this.formEditarCliente.value.telefono,
      nombreUsuario: this.formEditarCliente.value.nombreUsuario,
      contrasena: this.formEditarCliente.value.contrasena
    }

    this.terceroService.editarTercero(this.datosCliente.idTercero, tercero).subscribe({
      next: (value) => {
        this.guardando = false;
        if (!value.respuesta.error) {
          if (this.datosCliente.nombreUsuario !== tercero.nombreUsuario) {
            localStorage.setItem('nombreUsuario', tercero.nombreUsuario);
            localStorage.setItem('token', value.token);
          }
          this.toastService.success(value.respuesta.descripcion);
          this.listarTercero();
        } else {
          this.toastService.error(value.respuesta.descripcion);
        }
      },
      error: (err) => {
        this.guardando = false;
        if (err.status === 500) {
          this.toastService.error(err.error.respuesta.descripcion)
        } else if (err.status === 400) {
          this.toastService.error(err.error.respuesta.descripcion)
        } else if (err.status === 404) {
          this.toastService.error(err.error.respuesta.descripcion)
        }
      }
    })
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
