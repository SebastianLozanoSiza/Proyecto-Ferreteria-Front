import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { CrearDepartamento, Departamentos } from 'src/app/interfaces/departamento';

@Component({
  selector: 'app-crear-departamento',
  templateUrl: './crear-departamento.component.html',
  styleUrls: ['./crear-departamento.component.css']
})
export class CrearDepartamentoComponent implements OnInit {

  public formBuild = inject(FormBuilder);;
  public departamentoService = inject(DepartamentoService);

  public listaDepartamentos: Departamentos[] = [];

  public guardando = false;

  constructor(private dialogRef: MatDialogRef<CrearDepartamentoComponent>, private toastService: ToastrService, @Inject(MAT_DIALOG_DATA) public datosDepartamento: Departamentos) {

  }

  public formCrearDepartamento: FormGroup = this.formBuild.group({
    nombre: ['', Validators.required]
  })


  ngOnInit(): void {
    this.traerDepartamento();
  }

  traerDepartamento() {
    if (this.datosDepartamento) {
      this.formCrearDepartamento.patchValue({
        nombre: this.datosDepartamento.nombre
      })
    }
  }

  crearDepartamento() {
    if (this.formCrearDepartamento.invalid) {
      this.formCrearDepartamento.markAllAsTouched();
      return;
    }

    this.guardando = true;

    const departamento: CrearDepartamento = {
      nombre: this.formCrearDepartamento.value.nombre
    }

    if (this.datosDepartamento == null) {
      this.departamentoService.crearDepartamento(departamento).subscribe({
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
    } else {
      this.departamentoService.actualizarDepartamento(this.datosDepartamento.idDepartamento, departamento).subscribe({
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

  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
