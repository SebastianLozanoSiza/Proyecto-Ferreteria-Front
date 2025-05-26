import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Ferreteria } from 'src/app/interfaces/ferreteria';
import { CrearProducto, Productos } from 'src/app/interfaces/producto';
import { FerreteriaService } from 'src/app/services/ferreteria.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-crear-productos',
  templateUrl: './crear-productos.component.html',
  styleUrls: ['./crear-productos.component.css']
})
export class CrearProductosComponent implements OnInit {

  public formBuild = inject(FormBuilder);
  public ferreteriaService = inject(FerreteriaService);
  public productoService = inject(ProductoService);

  public listaFerreterias: Ferreteria[] = [];

  public guardando = false;

  constructor(private dialogRef: MatDialogRef<CrearProductosComponent>, private toastService: ToastrService, @Inject(MAT_DIALOG_DATA) public datosProducto: Productos) {

  }

  ngOnInit(): void {
    this.listarFerreterias();
    if (this.datosProducto) {
      this.formCrearProducto.patchValue({
        nombreProducto: this.datosProducto.nombreProducto,
        descripcion: this.datosProducto.descripcion,
        categoria: this.datosProducto.categoria,
        precio: this.datosProducto.precio,
        stock: this.datosProducto.stock
      });
    }
  }

  public formCrearProducto: FormGroup = this.formBuild.group({
    nombreProducto: ['', Validators.required],
    descripcion: ['', Validators.required],
    categoria: ['', Validators.required],
    precio: [null, [Validators.required, Validators.min(0.01)]],
    stock: [null, [Validators.required, Validators.min(0)]],
    idFerreteria: ['', Validators.required]
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

  crearProducto() {
    if (this.formCrearProducto.invalid) {
      this.formCrearProducto.markAllAsTouched();
      return;
    }

    this.guardando = true;

    const producto: CrearProducto = {
      nombreProducto: this.formCrearProducto.value.nombreProducto,
      descripcion: this.formCrearProducto.value.descripcion,
      categoria: this.formCrearProducto.value.categoria,
      precio: this.formCrearProducto.value.precio,
      stock: this.formCrearProducto.value.stock,
      idFerreteria: this.formCrearProducto.value.idFerreteria
    }

    if (this.datosProducto == null) {
      this.productoService.crearProducto(producto).subscribe({
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
    } else {
      this.productoService.actualizarProducto(this.datosProducto.idProducto, producto).subscribe({
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
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
