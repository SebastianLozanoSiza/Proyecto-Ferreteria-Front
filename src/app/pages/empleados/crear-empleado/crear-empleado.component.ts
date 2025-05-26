import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CrearEmpleado } from 'src/app/interfaces/empleado';
import { Ferreteria } from 'src/app/interfaces/ferreteria';
import { Roles } from 'src/app/interfaces/rol';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { FerreteriaService } from 'src/app/services/ferreteria.service';
import { RolService } from 'src/app/services/rol.service';

@Component({
  selector: 'app-crear-empleado',
  templateUrl: './crear-empleado.component.html',
  styleUrls: ['./crear-empleado.component.css']
})
export class CrearEmpleadoComponent implements OnInit {

  public formBuild = inject(FormBuilder);
  public empleadoService = inject(EmpleadoService);
  public rolService = inject(RolService);
  public ferreteriaService = inject(FerreteriaService);

  public guardando = false;

  public listaFerreteria: Ferreteria[] = [];
  public listaRoles: Roles[] = [];

  constructor(private dialogRef: MatDialogRef<CrearEmpleadoComponent>, private toastService: ToastrService) {

  }

  public formCrearEmpleado: FormGroup = this.formBuild.group({
    identificacion: ['', Validators.required],
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    correo: ['', Validators.required],
    direccion: ['', Validators.required],
    telefono: ['', Validators.required],
    idRol: ['', Validators.required],
    idFerreteria: ['', Validators.required]
  })

  ngOnInit(): void {
    this.listarFerreterias();
    this.listarRoles();
  }

  listarFerreterias() {
    this.ferreteriaService.listarFerreterias("", "", "").subscribe({
      next: (value) => {
        if (!value.respuesta.error) {
          this.listaFerreteria = value.ferreteria;
        }
      },
      error: (err) => {
        this.listaFerreteria = [];
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

  listarRoles() {
    this.rolService.listarRoles().subscribe({
      next: (value) => {
        if (!value.respuesta.error) {
          this.listaRoles = value.roles;
        }
      },
      error: (err) => {
        this.listaRoles = [];
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

  crearEmpleado() {
    if (this.formCrearEmpleado.invalid) {
      this.formCrearEmpleado.markAllAsTouched();
      return;
    }

    this.guardando = true;

    const empleado: CrearEmpleado = {
      identificacion: this.formCrearEmpleado.value.identificacion,
      nombre: this.formCrearEmpleado.value.nombre,
      apellidos: this.formCrearEmpleado.value.apellidos,
      correo: this.formCrearEmpleado.value.correo,
      direccion: this.formCrearEmpleado.value.direccion,
      telefono: this.formCrearEmpleado.value.telefono,
      idRol: this.formCrearEmpleado.value.idRol,
      idFerreteria: this.formCrearEmpleado.value.idFerreteria
    }

    this.empleadoService.crearEmpleado(empleado).subscribe({
      next: (value) => {
        this.guardando = false;
        if (!value.error) {
          this.toastService.success(value.descripcion);
          this.dialogRef.close("true");
        } else {
          this.toastService.error(value.descripcion)
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
