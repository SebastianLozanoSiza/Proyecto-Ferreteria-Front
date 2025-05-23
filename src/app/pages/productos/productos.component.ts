import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Productos } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { CrearProductosComponent } from './crear-productos/crear-productos.component';
import Swal from 'sweetalert2';
import { PermisosService } from 'src/app/services/permisos.service';
import { FormControl } from '@angular/forms';
import { debounceTime, map, Observable, of, startWith, switchMap } from 'rxjs';

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

  //PAGINADO
  public registrosPorPagina: number = 5;
  public totalRegistros: number = 0;

  public paginas: number[] = [];
  public paginaActual: number = 1;

  public buscarNombre = new FormControl('');
  public buscarCategoria = new FormControl('');
  public buscarRazonSocial = new FormControl('');

  public sugerenciasNombre: Observable<Productos[]> = of([]);
  public sugerenciasCategoria: Observable<Productos[]> = of([]);
  public sugerenciasRazonSocial: Observable<Productos[]> = of([]);


  ngOnInit(): void {
    this.listarProductos();

    this.sugerenciasNombre = this.buscarNombre.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      switchMap(valor => {
        if (!valor || valor.trim() === '') return of([]);
        return this.productosService.listarProductos(valor, '', '').pipe(
          map(resp => resp.productos || [])
        );
      })
    );

    this.sugerenciasCategoria = this.buscarCategoria.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      switchMap(valor => {
        if (!valor || valor.trim() === '') return of([]);
        return this.productosService.listarProductos('', valor, '').pipe(
          map(resp => resp.productos || [])
        );
      })
    );

    this.sugerenciasRazonSocial = this.buscarRazonSocial.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      switchMap(valor => {
        if (!valor || valor.trim() === '') return of([]);
        return this.productosService.listarProductos('', '', valor).pipe(
          map(resp => resp.productos || [])
        );
      })
    );
  }

  buscarProductos() {
    this.productosService.listarProductos(this.buscarNombre.value || '', this.buscarCategoria.value || '', this.buscarRazonSocial.value || '').subscribe({
      next: (value) => {
        if (!value.respuesta.error) {
          this.listaProductos = value.productos;
          this.totalRegistros = value.productos.length;
          this.calcularPaginas();
        }
      },
      error: (err) => {
        this.listaProductos = [];
        this.totalRegistros = 0;
        this.calcularPaginas();
      }
    });
  }

  seleccionarSugerenciaNombre(producto: Productos) {
    this.buscarNombre.setValue(producto.nombreProducto);
    this.buscarProductos();
  }

  seleccionarSugerenciaCategoria(producto: Productos) {
    this.buscarCategoria.setValue(producto.categoria);
    this.buscarProductos();
  }

  seleccionarSugerenciaRazonSocial(producto: Productos) {
    this.buscarRazonSocial.setValue(producto.razonSocialFerreteria);
    this.buscarProductos();
  }

  listarProductos() {
    this.productosService.listarProductos("", "", "").subscribe({
      next: (value) => {
        if (!value.respuesta.error) {
          this.listaProductos = value.productos;
          this.totalRegistros = value.productos.length;
          this.calcularPaginas();
        }
      },
      error: (err) => {
        console.log(err);
        this.listaProductos = [];
        this.totalRegistros = 0;
        this.calcularPaginas();
      }
    })
  }

  actualizarRegistrosPorPagina(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.registrosPorPagina = parseInt(selectElement.value, 10);
    this.paginaActual = 1;
    this.listarProductos();
  }

  calcularPaginas() {
    const totalPaginas = Math.ceil(this.totalRegistros / this.registrosPorPagina);
    this.paginas = totalPaginas > 0 ? Array.from({ length: totalPaginas }, (_, i) => i + 1) : [1];
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
    this.listarProductos();
  }

  getIndiceInicial(): number {
    if (this.totalRegistros === 0) {
      return 0;
    }
    return (this.paginaActual - 1) * this.registrosPorPagina + 1;
  }

  getIndiceFinal(): number {
    return Math.min(this.paginaActual * this.registrosPorPagina, this.totalRegistros);
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

  verificarPermisos() {
    this.permisosService.listarModulos().subscribe({
      next: (value) => {
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
