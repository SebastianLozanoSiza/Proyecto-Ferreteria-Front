import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, Observable, of, startWith, switchMap } from 'rxjs';
import { Empleados } from 'src/app/interfaces/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';
import Swal from 'sweetalert2';
import { CrearEmpleadoComponent } from './crear-empleado/crear-empleado.component';
import { PermisosService } from 'src/app/services/permisos.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  public empleadoService = inject(EmpleadoService);
  private permisosService = inject(PermisosService);
  public dialog = inject(MatDialog);

  public permisoCrear: boolean = false;
  public permisoEditar: boolean = false;
  public permisoEliminar: boolean = false;

  public listEmpleados: Empleados[] = [];
  public listaFiltrada: Empleados[] = [];

  //PAGINADO
  public registrosPorPagina: number = 5;
  public totalRegistros: number = 0;

  public paginas: number[] = [];
  public paginaActual: number = 1;

  public buscarIdentificacion = new FormControl('');
  public buscarNombre = new FormControl('');
  public buscarCorreo = new FormControl('');
  public buscarRol = new FormControl('');
  public buscarFerreteria = new FormControl('');

  public sugerenciasIdentificacion: Observable<Empleados[]> = of([]);
  public sugerenciasNombre: Observable<Empleados[]> = of([]);
  public sugerenciasCorreo: Observable<Empleados[]> = of([]);
  public sugerenciasRol: Observable<Empleados[]> = of([]);
  public sugerenciasFerreteria: Observable<Empleados[]> = of([]);


  ngOnInit(): void {
    this.verificarPermisos();
    this.listarEmpleados();

    this.sugerenciasIdentificacion = this.buscarIdentificacion.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      switchMap(valor => {
        if (!valor || valor.trim() === '') {
          this.listaFiltrada = [...this.listEmpleados];
          return of(this.listEmpleados);
        }
        const coincidencias = this.listEmpleados.filter(emple =>
          emple.identificacion.includes(valor)
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
          this.listaFiltrada = [...this.listEmpleados];
          return of(this.listEmpleados);
        }
        const coincidencias = this.listEmpleados.filter(emple =>
          emple.nombre.toLowerCase().includes(valor.toLowerCase())
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
          this.listaFiltrada = [...this.listEmpleados];
          return of(this.listEmpleados);
        }
        const coincidencias = this.listEmpleados.filter(emple =>
          emple.correo.toLowerCase().includes(valor.toLowerCase())
        );
        this.listaFiltrada = coincidencias;
        return of(coincidencias);
      })
    );

    this.sugerenciasRol = this.buscarRol.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      switchMap(valor => {
        if (!valor || valor.trim() === '') {
          this.listaFiltrada = [...this.listEmpleados];
          return of(this.listEmpleados);
        }
        const coincidencias = this.listEmpleados.filter(emple =>
          emple.nombreRol.toLowerCase().includes(valor.toLowerCase())
        );
        this.listaFiltrada = coincidencias;
        return of(coincidencias);
      })
    );

    this.sugerenciasFerreteria = this.buscarFerreteria.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      switchMap(valor => {
        if (!valor || valor.trim() === '') {
          this.listaFiltrada = [...this.listEmpleados];
          return of(this.listEmpleados);
        }
        const coincidencias = this.listEmpleados.filter(emple =>
          emple.razonSocial.toLowerCase().includes(valor.toLowerCase())
        );
        this.listaFiltrada = coincidencias;
        return of(coincidencias);
      })
    );
  }

  buscarEmpleados() {
    this.empleadoService.listarEmpleados(this.buscarIdentificacion.value || '', this.buscarNombre.value || '', this.buscarCorreo.value || '', this.buscarRol.value || '', this.buscarFerreteria.value || '').subscribe({
      next: (value) => {
        if (!value.respuesta.error) {
          this.listEmpleados = value.empleados;
          this.totalRegistros = value.empleados.length;
          this.calcularPaginas();
        }
      },
      error: (err) => {
        this.listEmpleados = [];
        this.totalRegistros = 0;
        this.calcularPaginas();
      }
    });
  }

  listarEmpleados() {
    this.empleadoService.listarEmpleados("", "", "", "", "").subscribe({
      next: (value) => {
        if (!value.respuesta.error) {
          this.listEmpleados = value.empleados;
          this.totalRegistros = value.empleados.length;
          this.calcularPaginas();
        }
      },
      error: (err) => {
        console.log(err);
        this.listEmpleados = [];
        this.totalRegistros = 0;
        this.calcularPaginas();
      }
    })
  }

  seleccionarSugerenciaIdentificacion(empleado: Empleados) {
    this.buscarIdentificacion.setValue(empleado.identificacion, { emitEvent: false });
    this.listaFiltrada = [empleado];
  }

  seleccionarSugerenciaNombre(empleado: Empleados) {
    this.buscarNombre.setValue(empleado.nombre, { emitEvent: false });
    this.listaFiltrada = [empleado];
  }

  seleccionarSugerenciaCorreo(empleado: Empleados) {
    this.buscarCorreo.setValue(empleado.correo, { emitEvent: false });
    this.listaFiltrada = [empleado];
  }

  seleccionarSugerenciaRol(empleado: Empleados) {
    this.buscarRol.setValue(empleado.nombreRol, { emitEvent: false });
    this.listaFiltrada = [empleado];
  }

  seleccionarSugerenciaFerreteria(empleado: Empleados) {
    this.buscarFerreteria.setValue(empleado.razonSocial, { emitEvent: false });
    this.listaFiltrada = [empleado];
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

  crearEmpleado() {
    this.dialog.open(CrearEmpleadoComponent, {
      maxHeight: '80vh',
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.listarEmpleados();
      }
    })
  }

  eliminarEmpleado(empleados: Empleados) {
    Swal.fire({
      title: "¿Desea eliminar el empleado?",
      text: empleados.nombre + " " + empleados.apellidos,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.empleadoService.eliminarEmpleado(empleados.idEmpleado).subscribe({
          next: (value) => {
            if (!value.error) {
              Swal.fire({
                title: "Eliminado",
                text: "El empleado ha sido eliminado correctamente.",
                icon: "success",
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
              });
              this.listarEmpleados();
            } else {
              Swal.fire({
                title: "Error",
                text: "No se pudo eliminar el empleado.",
                icon: "error",
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
              });
            }
          },
          error: (err) => {
            Swal.fire({
              title: "Error",
              text: "Ocurrió un error al intentar eliminar el empleado.",
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
          const modulo = value.modulos.find(m => m.nombreModulo === 'Empleados');
          this.permisoCrear = modulo ? modulo.crear : false;
          this.permisoEditar = modulo ? modulo.actualizar : false;
          this.permisoEliminar = modulo ? modulo.eliminar : false;
        }
      },
    });
  }

}
