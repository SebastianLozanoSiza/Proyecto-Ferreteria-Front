import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Departamentos } from 'src/app/interfaces/departamento';
import { DepartamentoService } from 'src/app/services/departamento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css']
})
export class DepartamentosComponent implements OnInit {

  public listaDepartamentos: Departamentos[] = [];

  public totalRegistros: number = 0;
  public searchControl: FormControl = new FormControl(''); // Control para el campo de búsqueda

  private departamentoService = inject(DepartamentoService);

  ngOnInit(): void {
    this.listarDepartamentos();

    this.searchControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe((searchTerm: string) => {
      this.listarDepartamentos(searchTerm);
    })
  }

  listarDepartamentos(nombre: string = '') {
    this.departamentoService.listarDepartamentos(nombre).subscribe({
      next: (value) => {
        if (!value.respuesta.error) {
          this.listaDepartamentos = value.departamentos;
          this.totalRegistros = value.departamentos.length;
        } else {
          this.listaDepartamentos = [];
          this.totalRegistros = 0;
        }
      },
      error: (err) => {
        console.log(err);
        this.listaDepartamentos = [];
        this.totalRegistros = 0;
      }
    })
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
}
