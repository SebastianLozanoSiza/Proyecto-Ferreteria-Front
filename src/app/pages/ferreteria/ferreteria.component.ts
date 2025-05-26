import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Ferreteria } from 'src/app/interfaces/ferreteria';
import { FerreteriaService } from 'src/app/services/ferreteria.service';
import { CrearFerreteriaComponent } from './crear-ferreteria/crear-ferreteria.component';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { debounceTime, Observable, of, startWith, switchMap } from 'rxjs';
import { Productos } from 'src/app/interfaces/producto';
import { PermisosService } from 'src/app/services/permisos.service';

@Component({
  selector: 'app-ferreteria',
  templateUrl: './ferreteria.component.html',
  styleUrls: ['./ferreteria.component.css']
})
export class FerreteriaComponent implements OnInit {

  public ferreteriaService = inject(FerreteriaService);
  private permisosService = inject(PermisosService);
  public dialog = inject(MatDialog);

  public permisoCrear: boolean = false;
  public permisoEditar: boolean = false;
  public permisoEliminar: boolean = false;


  public listaFerreteria: Ferreteria[] = [];
  public listaFiltrada: Ferreteria[] = [];

  //PAGINADO
  public registrosPorPagina: number = 5;
  public totalRegistros: number = 0;

  public paginas: number[] = [];
  public paginaActual: number = 1;

  public buscarNit = new FormControl('');
  public buscarRazonSocial = new FormControl('');
  public buscarRepresentante = new FormControl('');

  public sugerenciasNit: Observable<Ferreteria[]> = of([]);
  public sugerenciasRazonSocial: Observable<Ferreteria[]> = of([]);
  public sugerenciasRepresentante: Observable<Ferreteria[]> = of([]);

  constructor(private toastService: ToastrService) {

  }

  ngOnInit(): void {
    this.verificarPermisos();
    this.listarFerreterias();
    this.sugerenciasNit = this.buscarNit.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      switchMap(valor => {
        if (!valor || valor.trim() === '') {
          this.listaFiltrada = [...this.listaFerreteria];
          return of(this.listaFerreteria);
        }
        const coincidencias = this.listaFerreteria.filter(ferre =>
          ferre.nit.includes(valor)
        );
        this.listaFiltrada = coincidencias;
        return of(coincidencias);
      })
    );

    this.sugerenciasRazonSocial = this.buscarRazonSocial.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      switchMap(valor => {
        if (!valor || valor.trim() === '') {
          this.listaFiltrada = [...this.listaFerreteria];
          return of(this.listaFerreteria);
        }
        const coincidencias = this.listaFerreteria.filter(ferre =>
          ferre.razonSocial.includes(valor)
        );
        this.listaFiltrada = coincidencias;
        return of(coincidencias);
      })
    );

    this.sugerenciasRepresentante = this.buscarRepresentante.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      switchMap(valor => {
        if (!valor || valor.trim() === '') {
          this.listaFiltrada = [...this.listaFerreteria];
          return of(this.listaFerreteria);
        }
        const coincidencias = this.listaFerreteria.filter(ferre =>
          ferre.representante.includes(valor)
        );
        this.listaFiltrada = coincidencias;
        return of(coincidencias);
      })
    );
  }

  buscarFerreterias() {
    this.ferreteriaService.listarFerreterias(this.buscarNit.value || '', this.buscarRazonSocial.value || '', this.buscarRepresentante.value || '').subscribe({
      next: (value) => {
        if (!value.respuesta.error) {
          this.listaFerreteria = value.ferreteria;
          this.totalRegistros = value.ferreteria.length;
          this.calcularPaginas();
        }
      },
      error: (err) => {
        this.listaFerreteria = [];
        this.totalRegistros = 0;
        this.calcularPaginas();
      }
    });
  }

  seleccionarSugerenciaNit(ferreteria: Ferreteria) {
    this.buscarNit.setValue(ferreteria.nit, { emitEvent: false });
    this.listaFiltrada = [ferreteria];
  }


  seleccionarSugerenciaRazonSocial(ferreteria: Ferreteria) {
    this.buscarRazonSocial.setValue(ferreteria.razonSocial, { emitEvent: false });
    this.listaFiltrada = [ferreteria];
  }

  seleccionarSugerenciaRepresentante(ferreteria: Ferreteria) {
    this.buscarRepresentante.setValue(ferreteria.representante, { emitEvent: false });
    this.listaFiltrada = [ferreteria];
  }

  listarFerreterias() {
    this.ferreteriaService.listarFerreterias("", "", "").subscribe({
      next: (value) => {
        if (!value.respuesta.error) {
          this.listaFerreteria = value.ferreteria;
          this.totalRegistros = value.ferreteria.length;
          this.calcularPaginas();
        }
      },
      error: (err) => {
        this.listaFerreteria = [];
        this.totalRegistros = 0;
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

  crearFerreteria() {
    this.dialog.open(CrearFerreteriaComponent, {
      maxHeight: '80vh',
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.listarFerreterias();
      }
    })
  }

  editarFerreteria(ferreteria: Ferreteria) {
    this.dialog.open(CrearFerreteriaComponent, {
      maxHeight: '80vh',
      data: ferreteria,
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.listarFerreterias();
      }
    })
  }

  eliminarFerreteria(ferreteria: Ferreteria) {
    Swal.fire({
      title: "¿Desea eliminar la ferreteria?",
      text: ferreteria.razonSocial,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.ferreteriaService.eliminarFerreteria(ferreteria.idFerreteria).subscribe({
          next: (value) => {
            if (!value.respuesta.error) {
              Swal.fire({
                title: "Eliminado",
                text: "La ferreteria ha sido eliminada correctamente.",
                icon: "success",
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
              });
              this.listarFerreterias();
            } else {
              Swal.fire({
                title: "Error",
                text: "No se pudo eliminar la ferretería.",
                icon: "error",
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
              });
            }
          },
          error: (err) => {
            Swal.fire({
              title: "Error",
              text: "Ocurrió un error al intentar eliminar la ferretería.",
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
          const modulo = value.modulos.find(m => m.nombreModulo === 'Ferreterias');
          this.permisoCrear = modulo ? modulo.crear : false;
          this.permisoEditar = modulo ? modulo.actualizar : false;
          this.permisoEliminar = modulo ? modulo.eliminar : false;
        }
      },
    });
  }

}
