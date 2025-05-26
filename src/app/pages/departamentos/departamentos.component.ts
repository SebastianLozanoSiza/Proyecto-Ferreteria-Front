import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Departamentos } from 'src/app/interfaces/departamento';
import { DepartamentoService } from 'src/app/services/departamento.service';
import Swal from 'sweetalert2';
import { CrearDepartamentoComponent } from './crear-departamento/crear-departamento.component';
import { PermisosService } from 'src/app/services/permisos.service';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css']
})
export class DepartamentosComponent implements OnInit {

  public listaDepartamentos: Departamentos[] = [];
  public listaFiltrada: Departamentos[] = [];
  public dialog = inject(MatDialog);

  public searchControl: FormControl = new FormControl('');

  private departamentoService = inject(DepartamentoService);
  private permisosService = inject(PermisosService);

  public permisoCrear: boolean = false;
  public permisoEditar: boolean = false;
  public permisoEliminar: boolean = false;

  //PAGINADO
  public registrosPorPagina: number = 5;
  public totalRegistros: number = 0;

  public paginas: number[] = [];
  public paginaActual: number = 1;

  public buscar = new FormControl('');

  public sugerencias: Observable<Departamentos[]> = of([]);

  ngOnInit(): void {
    this.verificarPermisos();
    this.listarDepartamentos();

    this.sugerencias = this.buscar.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(valor => {
        if (!valor || valor.trim() === '') {
          this.listaFiltrada = [...this.listaDepartamentos];
          this.totalRegistros = this.listaFiltrada.length;
          this.calcularPaginas();
          return of(this.listaDepartamentos);
        }
        const coincidencias = this.listaDepartamentos.filter(dep =>
          dep.nombre.toLowerCase().includes(valor.toLowerCase())
        );
        this.listaFiltrada = coincidencias;
        this.totalRegistros = this.listaFiltrada.length;
        this.calcularPaginas();
        return of(coincidencias);
      })
    );
  }

seleccionarSugerencia(departamento: Departamentos) {
  this.buscar.setValue(departamento.nombre, { emitEvent: false });
  this.listaFiltrada = [departamento];
  this.totalRegistros = 1;
  this.calcularPaginas();
}

  listarDepartamentos() {
    this.departamentoService.listarDepartamentos("").subscribe({
      next: (value) => {
        if (!value.respuesta.error) {
          this.listaDepartamentos = value.departamentos;
          this.listaFiltrada = [...this.listaDepartamentos];
          this.totalRegistros = value.departamentos.length;
          this.calcularPaginas();
        } else {
          this.listaDepartamentos = [];
          this.totalRegistros = 0;
        }
      },
      error: (err) => {
        console.log(err);
        this.listaDepartamentos = [];
        this.listaFiltrada = [];
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

  eliminarDepartamento(departamento: Departamentos) {
    Swal.fire({
      title: "¿Desea eliminar el departamento?",
      text: departamento.nombre,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.departamentoService.eliminarDepartamento(departamento.idDepartamento).subscribe({
          next: (value) => {
            if (!value.error) {
              Swal.fire({
                title: "Eliminado",
                text: "El departamento ha sido eliminado correctamente.",
                icon: "success",
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
              });
              this.listarDepartamentos();
            } else {
              Swal.fire({
                title: "Error",
                text: "No se pudo eliminar el departamento.",
                icon: "error",
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
              });
            }
          },
          error: (err) => {
            Swal.fire({
              title: "Error",
              text: "Ocurrió un error al intentar eliminar el departamento.",
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

  crearDepartamento() {
    this.dialog.open(CrearDepartamentoComponent, {
      maxHeight: "80vh",
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.listarDepartamentos();
      }
    })
  }

  editarDepartamento(departamento: Departamentos) {
    this.dialog.open(CrearDepartamentoComponent, {
      maxHeight: "80vh",
      data: departamento,
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.listarDepartamentos();
      }
    })
  }

  verificarPermisos() {
    this.permisosService.listarModulos().subscribe({
      next: (value) => {
        if (!value.respuesta.error) {
          const modulo = value.modulos.find(m => m.nombreModulo === 'Departamentos');
          this.permisoCrear = modulo ? modulo.crear : false;
          this.permisoEditar = modulo ? modulo.actualizar : false;
          this.permisoEliminar = modulo ? modulo.eliminar : false;
        }
      },
    });
  }
}
