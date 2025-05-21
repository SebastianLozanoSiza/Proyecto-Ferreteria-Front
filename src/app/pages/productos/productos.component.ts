import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CrearProducto, Productos } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { CrearProductosComponent } from './crear-productos/crear-productos.component';
import Swal from 'sweetalert2';
import { PermisosService } from 'src/app/services/permisos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  public listaProductos: Productos[] = [];

  public productosService = inject(ProductoService);
  private permisosService = inject(PermisosService);
  public dialog = inject(MatDialog);

  public permisoCrear: boolean = false;
  public permisoEditar: boolean = false;
  public permisoEliminar: boolean = false;

  ngOnInit(): void {
    this.listarProductos();
  }

  listarProductos(nombre: string = '', categoria: string = '', razonSocial: string = '') {
    this.productosService.listarProductos(nombre, categoria, razonSocial).subscribe({
      next: (value) => {
        if (!value.respuesta.error) {
          this.listaProductos = value.productos;
        }
      },
      error: (err) => {
        console.log(err);
        this.listaProductos = [];
      }
    })
  }

  crearProducto() {
    this.dialog.open(CrearProductosComponent, {
      maxHeight: "80vh",
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.listarProductos();
      }
    })
  }

  editarProducto(producto: Productos) {
    this.dialog.open(CrearProductosComponent, {
      maxHeight: "80vh",
      data: producto,
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.listarProductos();
      }
    })
  }

  eliminarProducto(producto: Productos) {
    Swal.fire({
      title: "¿Desea eliminar el producto?",
      text: producto.nombreProducto,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.productosService.eliminarProducto(producto.idProducto).subscribe({
          next: (value) => {
            if (!value.error) {
              Swal.fire({
                title: "Eliminado",
                text: "El producto ha sido eliminado correctamente.",
                icon: "success",
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
              });
              this.listarProductos();
            } else {
              Swal.fire({
                title: "Error",
                text: "No se pudo eliminar el producto.",
                icon: "error",
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
              });
            }
          },
          error: (err) => {
            Swal.fire({
              title: "Error",
              text: "Ocurrió un error al intentar eliminar el producto.",
              icon: "error",
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar'
            });
            console.error(err);
          }
        });
      }
    });
  }

  verificarPermisos(){
    this.permisosService.listarModulos().subscribe({
      next:(value)=> {
          if (!value.respuesta.error) {
            const modulo = value.modulos.find(m => m.nombreModulo === 'Productos');
            this.permisoCrear = modulo ? modulo.crear : false;
            this.permisoEditar = modulo ? modulo.actualizar : false;
            this.permisoEliminar = modulo ? modulo.eliminar : false;
          }
      },
    });
  }

}
