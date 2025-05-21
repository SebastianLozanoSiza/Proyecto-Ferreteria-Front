import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Clientes } from 'src/app/interfaces/cliente';
import { NuevoUsuario } from 'src/app/interfaces/nuevo-usuario';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css']
})
export class CrearClienteComponent implements OnInit {

  public formBuild = inject(FormBuilder);
  public clienteService = inject(ClienteService);

  public guardando = false;
  public mostrarPassword = false;
  public mostrarConfirmPassword = false;

  constructor(private dialogRef: MatDialogRef<CrearClienteComponent>, private toastService: ToastrService, @Inject(MAT_DIALOG_DATA) public datosCliente: Clientes) {

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
    if (this.datosCliente && this.datosCliente.nombreUsuario) {
      this.clienteService.buscarClientePorId(this.datosCliente.nombreUsuario).subscribe({
        next: (value) => {
          this.formEditarCliente.patchValue({
            identificacion: value.clientes[0].identificacion,
            nombre: value.clientes[0].nombre,
            apellidos: value.clientes[0].apellidos,
            correo: value.clientes[0].correo,
            direccion: value.clientes[0].direccion,
            telefono: value.clientes[0].telefono,
            nombreUsuario: value.clientes[0].nombreUsuario,
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

    const cliente: NuevoUsuario = {
      identificacion: this.formEditarCliente.value.identificacion,
      nombre: this.formEditarCliente.value.nombre,
      apellidos: this.formEditarCliente.value.apellidos,
      correo: this.formEditarCliente.value.correo,
      direccion: this.formEditarCliente.value.direccion,
      telefono: this.formEditarCliente.value.telefono,
      nombreUsuario: this.formEditarCliente.value.nombreUsuario,
      contrasena: this.formEditarCliente.value.contrasena
    }

    this.clienteService.editarCliente(this.datosCliente.idCliente, cliente).subscribe({
      next: (value) => {
        this.guardando = false;
        if (!value.error) {
          this.toastService.success(value.descripcion);
        } else {
          this.toastService.error(value.descripcion);
        }
      },
      error: (err) => {
        this.guardando = false;
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

  cerrar(): void {
    this.dialogRef.close();
  }
}
