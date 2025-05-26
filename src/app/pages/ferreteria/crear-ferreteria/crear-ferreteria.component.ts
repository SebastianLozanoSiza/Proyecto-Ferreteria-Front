import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CrearFerreteria, Ferreteria } from 'src/app/interfaces/ferreteria';
import { FerreteriaService } from 'src/app/services/ferreteria.service';

@Component({
  selector: 'app-crear-ferreteria',
  templateUrl: './crear-ferreteria.component.html',
  styleUrls: ['./crear-ferreteria.component.css']
})
export class CrearFerreteriaComponent implements OnInit{

  public formBuild = inject(FormBuilder);
  public ferreteriaService = inject(FerreteriaService);

  public guardando = false;

  constructor(private dialogRef: MatDialogRef<CrearFerreteriaComponent>, private toastService: ToastrService, @Inject(MAT_DIALOG_DATA) public datosFerreteria: Ferreteria) {

  }
  ngOnInit(): void {
    this.formCrearFerreteria.patchValue({
      nit: this.datosFerreteria?.nit ?? '',
      razonSocial: this.datosFerreteria?.razonSocial ?? '',
      representante: this.datosFerreteria?.representante ?? ''
    })
  }

  public formCrearFerreteria = this.formBuild.group({
    nit: ['', Validators.required],
    razonSocial: ['', Validators.required],
    representante: ['', Validators.required]
  })

  crearFerreteria() {
    if (this.formCrearFerreteria.invalid) {
      this.formCrearFerreteria.markAllAsTouched();
      return;
    }

    this.guardando = true;
    const ferreteria: CrearFerreteria = {
      nit: this.formCrearFerreteria.value.nit ?? '',
      razonSocial: this.formCrearFerreteria.value.razonSocial ?? '',
      representante: this.formCrearFerreteria.value.representante ?? ''
    }

    if (this.datosFerreteria == null) {
      this.ferreteriaService.crearFerreteria(ferreteria).subscribe({
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
      this.ferreteriaService.editarFerreteria(this.datosFerreteria.idFerreteria, ferreteria).subscribe({
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
