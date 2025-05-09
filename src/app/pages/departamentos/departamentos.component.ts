import { Component, inject, OnInit } from '@angular/core';
import { Departamentos } from 'src/app/interfaces/departamento';
import { DepartamentoService } from 'src/app/services/departamento.service';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css']
})
export class DepartamentosComponent implements OnInit{
  
  listaDepartamentos: Departamentos[] = [];

  private departamentoService = inject(DepartamentoService);
  
  ngOnInit(): void {
    this.listarDepartamentos();
  }

  listarDepartamentos(){
    this.departamentoService.listarDepartamentos("").subscribe({
      next:(value)=> {
          if (!value.respuesta.error) {
            this.listaDepartamentos = value.departamentos;
          }
      },
      error: (err) =>{
        console.log(err);
        
      }
    })
  }
}
