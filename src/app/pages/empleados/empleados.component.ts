import { Component, inject, OnInit } from '@angular/core';
import { Empleados } from 'src/app/interfaces/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  public empleadoService = inject(EmpleadoService);

  public listEmpleados: Empleados[] = [];

  //PAGINADO
  public registrosPorPagina: number = 5;
  public totalRegistros: number = 0;

  public paginas: number[] = [];
  public paginaActual: number = 1;


  ngOnInit(): void {
    this.listarEmpleados()
  }

  listarEmpleados() {
    this.empleadoService.listarEmpleados().subscribe({
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

}
