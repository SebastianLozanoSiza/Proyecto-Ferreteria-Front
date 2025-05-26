import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Clientes } from 'src/app/interfaces/cliente';
import { ConvertirClienteAEmpleado } from 'src/app/interfaces/empleado';
import { Ferreteria } from 'src/app/interfaces/ferreteria';
import { Roles } from 'src/app/interfaces/rol';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { FerreteriaService } from 'src/app/services/ferreteria.service';
import { RolService } from 'src/app/services/rol.service';

@Component({
  selector: 'app-convertir-aempleado',
  templateUrl: './convertir-aempleado.component.html',
  styleUrls: ['./convertir-aempleado.component.css']
})
export class ConvertirAEmpleadoComponent implements OnInit {

  public formBuild = inject(FormBuilder);
  public ferreteriaService = inject(FerreteriaService);
  public empleadoService = inject(EmpleadoService);
  public rolService = inject(RolService);

  public listaFerreterias: Ferreteria[] = [];
  public listaRoles: Roles[] = [];

  clienteSeleccionado: any = null;
  public guardando = false;

  constructor(private dialogRef: MatDialogRef<ConvertirAEmpleadoComponent>, private toastService: ToastrService, @Inject(MAT_DIALOG_DATA) public datosCliente: Clientes) {

  }

  ngOnInit(): void {
    this.listarFerreterias();
    this.listarRoles();
    if (this.datosCliente) {
      this.formConvertirCliente.patchValue({
        idTercero: this.datosCliente.idTercero,
        nombreCliente: this.datosCliente.nombre + " " + this.datosCliente.apellidos
      })
    }
  }

  public formConvertirCliente: FormGroup = this.formBuild.group({
    idTercero: ['', Validators.required],
    idRol: ['', Validators.required],
    idFerreteria: ['', Validators.required],
    nombreCliente: [{ value: '', disabled: true }],
  })

  listarFerreterias() {
    this.ferreteriaService.listarFerreterias("", "", "").subscribe({
      next: (value) => {
        if (!value.respuesta.error) {
          this.listaFerreterias = value.ferreteria;
        }
      },
      error: (err) => {
        console.log(err);

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
        console.log(err);

      }
    })
  }

  convertirCliente() {
    if (this.formConvertirCliente.invalid) {
      this.formConvertirCliente.markAllAsTouched();
      return;
    }

    this.guardando = true;

    const cliente: ConvertirClienteAEmpleado = {
      idTercero: this.formConvertirCliente.value.idTercero,
      idRol: this.formConvertirCliente.value.idRol,
      idFerreteria: this.formConvertirCliente.value.idFerreteria
    }
    this.empleadoService.cambiarClienteAEmpleado(cliente).subscribe({
      next: (value) => {
        this.guardando = false;
        if (!value.error) {
          this.toastService.success(value.descripcion);
          this.dialogRef.close("true");
        } else {
          this.toastService.error(value.descripcion);
        }
      },
      error: (err) => {
        console.log(err);
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
