import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Clientes } from 'src/app/interfaces/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import Swal from 'sweetalert2';
import { ConvertirAEmpleadoComponent } from './convertir-aempleado/convertir-aempleado.component';
import { FormControl } from '@angular/forms';
import { debounceTime, map, Observable, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  public clientesService = inject(ClienteService);
  public empleadosService = inject(EmpleadoService);

  public dialog = inject(MatDialog);

  public listClientes: Clientes[] = [];
  public listaFiltrada: Clientes[] = [];

  //PAGINADO
  public registrosPorPagina: number = 5;
  public totalRegistros: number = 0;

  public paginas: number[] = [];
  public paginaActual: number = 1;

  public buscarIdentificacion = new FormControl('');
  public buscarNombre = new FormControl('');
  public buscarCorreo = new FormControl('');

  public sugerenciasIdentificacion: Observable<Clientes[]> = of([]);
  public sugerenciasNombre: Observable<Clientes[]> = of([]);
  public sugerenciasCorreo: Observable<Clientes[]> = of([]);

  ngOnInit(): void {
    this.listarClientes();

    this.sugerenciasIdentificacion = this.buscarIdentificacion.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      switchMap(valor => {
        if (!valor || valor.trim() === '') {
          this.listaFiltrada = [...this.listClientes];
          return of(this.listClientes);
        }
        const coincidencias = this.listClientes.filter(cli =>
          cli.identificacion.includes(valor)
        );
        this.listaFiltrada = coincidencias;
        return of(coincidencias);
      })
    );

    this.sugerenciasNombre = this.buscarNombre.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      switchMap(valor => {
        if (!valor || valor.trim() === '') {
          this.listaFiltrada = [...this.listClientes];
          return of(this.listClientes);
        }
        const coincidencias = this.listClientes.filter(cli =>
          cli.nombre.toLowerCase().includes(valor.toLowerCase())
        );
        this.listaFiltrada = coincidencias;
        return of(coincidencias);
      })
    );



    this.sugerenciasCorreo = this.buscarCorreo.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      switchMap(valor => {
        if (!valor || valor.trim() === '') {
          this.listaFiltrada = [...this.listClientes];
          return of(this.listClientes);
        }
        const coincidencias = this.listClientes.filter(cli =>
          cli.correo.toLowerCase().includes(valor.toLowerCase())
        );
        this.listaFiltrada = coincidencias;
        return of(coincidencias);
      })
    );
  }

  buscarClientes() {
    this.clientesService.listarClientes(this.buscarIdentificacion.value || '', this.buscarNombre.value || '', this.buscarCorreo.value || '').subscribe({
      next: (value) => {
        if (!value.respuesta.error) {
          this.listClientes = value.clientes;
          this.totalRegistros = value.clientes.length;
          this.calcularPaginas();
        }
      },
      error: (err) => {
        this.listClientes = [];
        this.totalRegistros = 0;
        this.calcularPaginas();
      }
    });
  }

  seleccionarSugerenciaIdentificacion(cliente: Clientes) {
    this.buscarIdentificacion.setValue(cliente.identificacion, { emitEvent: false });
    this.listaFiltrada = [cliente];
  }

  seleccionarSugerenciaNombre(cliente: Clientes) {
    this.buscarNombre.setValue(cliente.nombre, { emitEvent: false });
    this.listaFiltrada = [cliente];
  }

  seleccionarSugerenciaCorreo(cliente: Clientes) {
    this.buscarCorreo.setValue(cliente.correo, { emitEvent: false });
    this.listaFiltrada = [cliente];
  }

  listarClientes() {
    this.clientesService.listarClientes("", "", "").subscribe({
      next: (value) => {
        if (!value.respuesta.error) {
          this.listClientes = value.clientes;
          this.totalRegistros = value.clientes.length;
          this.calcularPaginas();
        }
      },
      error: (err) => {
        console.log(err);
        this.listClientes = [];
        this.totalRegistros = 0;
        this.calcularPaginas();
      }
    })
  }

  actualizarRegistrosPorPagina(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.registrosPorPagina = parseInt(selectElement.value, 10);
    this.paginaActual = 1;
    this.calcularPaginas();
  }

  calcularPaginas() {
    const totalPaginas = Math.ceil(this.totalRegistros / this.registrosPorPagina);
    this.paginas = totalPaginas > 0 ? Array.from({ length: totalPaginas }, (_, i) => i + 1) : [1];
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
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

  eliminarCliente(cliente: Clientes) {
    Swal.fire({
      title: "¿Desea eliminar el cliente?",
      text: cliente.nombre + " " + cliente.apellidos,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.clientesService.eliminarCliente(cliente.idCliente).subscribe({
          next: (value) => {
            if (!value.error) {
              Swal.fire({
                title: "Eliminado",
                text: "El cliente ha sido eliminado correctamente.",
                icon: "success",
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
              });
              this.listarClientes();
            } else {
              Swal.fire({
                title: "Error",
                text: "No se pudo eliminar el cliente.",
                icon: "error",
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
              });
            }
          },
          error: (err) => {
            Swal.fire({
              title: "Error",
              text: "Ocurrió un error al intentar eliminar el cliente.",
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

  convertirAEmpleado(cliente: Clientes) {
    this.dialog.open(ConvertirAEmpleadoComponent, {
      maxHeight: "80vh",
      data: cliente,
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.listarClientes();
      }
    })
  }

}
